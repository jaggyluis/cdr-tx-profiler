aviation.set = function (data, cb) {
	aviation._flightProfiles = data.flightProfiles.map(function(f) {
		return aviation.profiles.FlightProfile.deserialize(f.data); 
	});
	aviation._passengerProfiles = data.passengerProfiles.map(function(p) {
		return aviation.profiles.PassengerProfile.deserialize(p.data);
	});
	aviation._gates = setGates(data.gates);
	aviation._flights = setFlights(data.designDay, data.loadFactor, data.filter, data.timeFrame, data.timeSlice, data.clusterType);
	cb();
};
function setGates (gateSchemeObjarr) {
	var gates = [];
	gateSchemeObjarr.forEach(function(gateObj) {
		var gate = aviation.class.Gate(gateObj);
		gates.push(gate);
	});
	return gates;
}
function setFlights (designDayFlightObjarr, loadFactor, filter, timeFrame, timeSlice, clusterType) {
	var flights = [],
		sorted = [],
		filtered = [],
		securityCounters = [10, 16], 
		matrix = aviation.class.Matrix3d(undefined,undefined,timeSlice),
		transferPassengers;
	designDayFlightObjarr.forEach(function(flightObj, index) {
		var flight = aviation.class.Flight(flightObj,
				aviation.get.airportByCode(flightObj.destination),
				aviation.get.airlineByCode(flightObj.airline),
				aviation.get.aircraftByCode(flightObj.aircraft),
				loadFactor);
		flight.setTurnaroundTime(aviation.get.turnaroundTimes());
		if (aviation.core.time.decimalDayToTime(flightObj.time).split(':')[0] > timeFrame[0] &&
			aviation.core.time.decimalDayToTime(flightObj.time).split(':')[0] < timeFrame[1]) {
			if (JSON.stringify(flight).match(filter)){
				filtered.push(flight);
			}
		}
		if (sorted.length === 0) {
			sorted.push(flight);
		} else {
			var a = flight.ival.getLength(),
				a_bis = flight.getDesignGroup(),
				i,
				b,
				b_bis;
			for (i=0, len=sorted.length; i<len; i++) {
				b = sorted[i].ival.getLength();
				b_bis = sorted[i].getDesignGroup();
				if ( a+a_bis >= b+b_bis ) break;
			}
			sorted.splice(i,0,flight);
		}
		flights.push(flight);
	});
	sorted.forEach(function(flight) {
		var pax = aviation.class.Pax(aviation.get.flightProfileByAircraftType(flight.getCategory()), flight, timeSlice);
		flight.findGate(aviation.get.gates(), clusterType);
		matrix = pax.getFlowDistributionMatrix(matrix, aviation.get.passengerProfiles());
	});
	matrix.sortRowCols(1, function(pa, pb){
		if (pa.attributes.securityTime && !pb.attributes.securityTime) return 1;
		else if (!pa.attributes.securityTime && pb.attributes.securityTime) return -1;
		else return 0;
	});
	transferPassengers = matrix.getRow(2).slice();
	matrix.setRow(matrix.getRowBlank(), 2);
	matrix.distributeRowByCounter(1, 2, false, function(passenger, matrix, i, c, r, sort) {
		var securityTime = passenger.attributes.securityTime,
			securityLines = passenger.attributes.bags
					? securityCounters[0]
					: securityCounters[1];
		if (sort && securityTime === 0) matrix.d[r][c].splice(0,0,matrix.d[r][c].splice(i,1)[0]);	
		return securityTime / securityLines;
	});
	matrix.copyRowApply(2, 2, false, function(passenger, matrix, count, i, c) {
		var val = aviation.core.math.round(passenger.attributes.securityTime, matrix.m ) / matrix.m;
		if (!passenger.attributes.isNull) return c + val;
	});
	matrix.mergeRows(transferPassengers, 2);
	matrix.copyRowApply(2, 3, false, function(passenger, matrix, count, i, c, r) {
		var gateInfo = passenger.attributes.gateInfo,
			flightTime = aviation.core.time.decimalDayToMinutes(passenger.flight.getTime()),
				scaleParam = (gateInfo[0] - gateInfo[2]) - ((gateInfo[1] - gateInfo[2]) / 2),
			shapeParam = 1.5,
			weibull = aviation.core.math.getRandomWeibull(scaleParam, shapeParam);
			delta = (weibull + ((gateInfo[1] - gateInfo[2]) / 2) + gateInfo[2]),
			gateTime = aviation.core.math.round(flightTime - delta, matrix.m) / matrix.m;

		if (passenger.attributes.isGateHog) return c;
		else return c < gateTime ? gateTime : c;
	});
	matrix.copyRowApply(3, 4, false, function(passenger, matrix, count, i, c, r) {
		var gateInfo = passenger.attributes.gateInfo, 
			gateTime = matrix.m * c,
			flightTime = aviation.core.time.decimalDayToMinutes(passenger.flight.getTime()),
			deltaFlightTime = flightTime - gateTime,
			boardingStart = gateInfo[1] < deltaFlightTime ? gateInfo[1] : deltaFlightTime,
			boardingEnd = gateInfo[2],
			boardingTime = boardingStart - boardingEnd,
			scaleParam = boardingTime / 2,
			shapeParam = 2,
			weibull = aviation.core.math.getRandomWeibull(scaleParam, shapeParam),
			deltaBoarding = weibull + boardingEnd,
			boardingMapped = aviation.core.math.round(flightTime - deltaBoarding, matrix.m) / matrix.m,
			boardingStartMapped = aviation.core.math.round(flightTime - boardingStart, matrix.m) / matrix.m;
		return passenger.attributes.isBusiness ? boardingStartMapped : boardingMapped ;
	});
	matrix.forEachItem(function(passenger, count, i, c, r) {
		var rounded = aviation.core.time.minutesToDecimalDay(matrix.m * c);
		switch (r) {
			case 0 : passenger.setEvent('arrival', rounded); break;
			case 1 : passenger.setEvent('security', rounded); break;
			case 2 : passenger.setEvent('concourse', rounded); break;
			case 3 : passenger.setEvent('gate', rounded); break;
			case 4 : passenger.setEvent('boarding', rounded); break;
			case 5 : passenger.setEvent('departure', rounded); break;
			default: break;
		}
	});
	return filtered;
}
