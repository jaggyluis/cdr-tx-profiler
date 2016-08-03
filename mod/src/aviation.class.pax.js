aviation.class.Pax = function(FlightProfile, flight, timeSlice) {
	return new Pax(FlightProfile, flight, timeSlice);
};
function Pax(flightProfile, flight, timeSlice) {
	this.flight = flight;
	this.flightProfile = flightProfile;
	this.timeSlice = timeSlice;
}
Pax.prototype = {};
Pax.prototype.__defineGetter__('type', function () {
	return this.flightProfile.type;
});
Pax.prototype.__defineGetter__('data', function () {
	return this._data;
});
Pax.prototype.__defineGetter__('passengerTypeDistributionPercentages', function () {
	var isPre9AM = aviation.core.time.isPre9AM(this.flight.getTime()) ? 'pre9AM' : 'post9AM';
	return this.flightProfile.data[this.flight.getDI()][isPre9AM];
});
Pax.prototype._data = {
	'designGroupBoardingDistribution' : { 
		//
		//	Start and end times for boarding call
		//	Derived from Perth by Richard Spencer - assumptions.
		//	29 - 50% are at gate prior to boarding.
		//
		'C' : 					[25,	20,		10],
		'D' : 					[30,	25,		10],
		'E' : 					[40,	35,		10],
		'F' : 					[50,	45,		15]
	},
	'timing' : {  
		// 
		//	Global Simulation variables in minutes, Derived from the
		//	ARCP manual fon airport planning.
		//
		'arrival' : 			[],
		'checkIn' : 			[1.0, 	5.0],	
		'security' : 			[0.3, 	0.7], 	// verify this rate 140/hr ~ 0.43
		'concourse' : 			[],
		'gate': 				[],
		'boarding': 			[],
		'departure' : 			[]
	},
	'walkTimes' : {
		//
		//	Intervals for assumed walktimes from one point in the airport to another.
		// 	Not being used, and have not been validated or set to match the current scheme.
		//
		'security' : 			[2.0, 	5.0]
	}
};
Pax.prototype.getTimeActual = function (minutes) {
	var departureTime = this.flight.getTime(),
		arrivalTime = aviation.core.time.minutesToDecimalDay(minutes);
	return  departureTime > arrivalTime
		? departureTime - arrivalTime
		: 1 + departureTime - arrivalTime;
};
Pax.prototype.getFlowDistributionMatrix = function (m, passengerProfiles) {
	//
	//	Needs to be replaced with a fit function and statistical model that
	//	estimates the arrival probability distribution (Weibull/Poisson?)
	//
	//
	//	checkInCounters can be replaced with a function of capacity (ACRP)
	//
	var self = this,
		passengerPercentagesTotal = self.passengerTypeDistributionPercentages,
		passengerSeats = self.flight.seats,
		checkInCounters = Math.ceil(passengerSeats / 100) + 1,
		passengers = [],
		matrix = aviation.class.Matrix3d(6, 1440 / self.timeSlice, self.timeSlice),
		gateTimingInfo = self.data.designGroupBoardingDistribution[self.flight.getCategory()],
		typePercentageTotal,
		passengerProfile,
		arrivalTimePercentageTotal,
		arrivalTimePercentageMapped,
		arrivalTimeActual,
		arrivalTimeRounded,
		departureTimeRounded,
		passenger,
		checkInTime,
		securityTime;	
	Object.keys(passengerPercentagesTotal).map(function(type) {
		typePercentageTotal = Math.ceil((passengerPercentagesTotal[type].percentage / 100) * passengerSeats);
		passengerProfile = aviation.get.passengerProfileByType(type);
		Object.keys(passengerProfile.data.arrivalDistribution).map(function(arrivalTime) {
			arrivalTimePercentageTotal = passengerProfile.data.arrivalDistribution[arrivalTime];
			arrivalTimePercentageMapped = arrivalTimePercentageTotal / 100 * typePercentageTotal;
			arrivalTimeActual = self.getTimeActual(arrivalTime);
			arrivalTimeRounded = aviation.core.math.floor(aviation.core.time.decimalDayToMinutes(arrivalTimeActual), self.timeSlice);
			departureTimeRounded = aviation.core.math.floor(aviation.core.time.decimalDayToMinutes(self.flight.getTime()), self.timeSlice);
			arrivalTimePercentageMapped = arrivalTimePercentageMapped > 0 && arrivalTimePercentageMapped < 1
				? aviation.core.math.getRandomBinaryWithProbablity(arrivalTimePercentageMapped)
				: Math.round(arrivalTimePercentageMapped);
			for (var i=0; i<arrivalTimePercentageMapped; i++) {
				passenger = aviation.class.Passenger(self.flight, passengerProfile);
				checkInTime = passenger.attributes.isTransfer 
					? 0
					: !passenger.attributes.bags 
						? 0
						: aviation.core.math.getRandomArbitrary(self._data.timing.checkIn),
				securityTime = passenger.attributes.isTransfer
					? 0
					: passenger.attributes.isPreCheck
						? 0
						: aviation.core.math.getRandomArbitrary(self._data.timing.security);
				passenger.setAttribute('checkInTime', checkInTime);
				passenger.setAttribute('securityTime', securityTime);
				passenger.setAttribute('gateInfo', gateTimingInfo);
				passengers.push(passenger);
				if (passenger.attributes.isTransfer) {
					passenger.setEvent('arrival',
						aviation.core.time.minutesToDecimalDay(self.timeSlice * arrivalTimeRounded));
					passenger.setEvent('security', 
						aviation.core.time.minutesToDecimalDay(self.timeSlice * arrivalTimeRounded));
					matrix.pushItem(passenger, 2, arrivalTimeRounded / self.timeSlice);
				} else {
					matrix.pushItem(passenger, 0, arrivalTimeRounded / self.timeSlice);
				}
				matrix.pushItem(passenger, -1, departureTimeRounded / self.timeSlice);
			}
		});
	});
	self.flight.setPassengers(passengers);
	matrix.sortRowCols(0, function(pa, pb){
		if (pa.attributes.checkInTime && !pb.attributes.checkInTime) return 1;
		else if (!pa.attributes.checkInTime && pb.attributes.checkInTime) return -1;
		else return 0;
	});
	matrix.distributeRowByIndex(0, 1, false, function(passengerarray, matrix, c, r) {
		if (passengerarray.length !== 0) {
			var sub = aviation.class.Matrix3d(1, checkInCounters, matrix.m),
				count = 0,
				overflow = [],
				i;
			passengerarray.sort(function(pa,pb) {
				if (pa.attributes.isNull && pb.attributes.isNull) {
					return 0;
				} else if (pa.attributes.isNull && !pb.attributes.isNull) {
					return -1;
				} else if (!pa.attributes.isNull && pb.attributes.isNull) {
					return 1;
				} else {
					if (pa.attributes.checkInTime && !pb.attributes.checkInTime) return 1;
					else if (!pa.attributes.checkInTime && pb.attributes.checkInTime) return -1;
					else return 0;
				}
			});
			for (i = 0; i<passengerarray.length; i++) sub.pushItem(passengerarray[i], 0, 0);
			sub.distributeRowByCallBack(0, 0, false, function(passengerarray, m, c, r) {
				var sum = passengerarray.reduce(function(val, p, i) { return val+p.attributes.checkInTime; }, 0),
					nullPassenger,
					deltaTime;
				if (passengerarray.length > 1 && sum > matrix.m) {
					if (c === m.d[r].length - 1) count ++ ;
					return true;
				} else {
					if (sum > matrix.m) {
						nullPassenger = aviation.class.Passenger.null();
						deltaTime = sum - matrix.m;
						nullPassenger.setAttribute('checkInTime', deltaTime);
						nullPassenger.setAttribute('passengerID', aviation.core.string.generateUUID());
						overflow.push(nullPassenger);
					}
					return false;
				}
			});
			/*
			for (var i=0; i<overflow.length; i++) {
				console.log(overflow[i])
				matrix.spliceItem(overflow[i], 0, r, c+1);
			}
			*/
			return passengerarray.length - count;
		}
	});
	matrix.copyRowApply(1, 1, false, function(passenger, matrix, count, i, c) {
		var val = aviation.core.math.round(passenger.attributes.checkInTime, matrix.m ) / matrix.m;
		if (!passenger.attributes.isNull) return c + val;
	});
	return m.merge(matrix);
};
