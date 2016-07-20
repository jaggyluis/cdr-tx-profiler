

function PassengerProfile () {

};
PassengerProfile.prototype = {

};

function Profiler (name, passengerArray, flightArray, trace) {

	this.passengers = passengerArray;
	this.flights = flightArray;

};
Profiler.prototype = {

	get types () {

		// !!!! TODO

	},
	getArrivalDistribution : function (passengerArray, timeSlice) {

		var deltaArrivalTimes = [].
			deltaArrivalDistribution;

		for (var i=0; i<passengerArray.length; i++) {

			var delta = passengerArray[i].departure-passengerArray[i].arrival,
				minutes = aviation.time.decimalDayToMinutes(delta),
				near = aviation.math.round(minutes);

			deltaArrivalTimes.push(near);
		}
		deltaArrivalDistribution = aviation.array.mapElementsToObjByPercentile(deltaArrivalTimes, true);

		return deltaArrivalDistribution;
	},
	getDomesticInternationalDistribution : function (passengerArray) {

		return passengerArray.reduce(function(obj, passenger) {

			obj[passenger.di].push(passenger);

			return obj;

		}, { 'domestic' : [], 'international' : [] });
	},
	getDepartingTransferDistribution : function (passengerArray) {

		return passengerArray.reduce(function(obj, passenger) {

			if (passenger.isTransfer) {
				obj['transfer'].push(passenger);
			} else {
				obj['departing'].push(passenger);
			}

			return obj;

		}, { 'departing' : [], 'transfer' : [] });
	},
	getTypeDistribution : function (obj, passengerArray) {

		return passengerArray.reduce(function(obj, passenger) {

			obj[passenger.type].push(passenger);

			return obj;

		}, {'leisure' : [], 'domestic' : [], 'other' : [] });
	},
	getPaxData : function (passengerArray, lexicon) {

		var self = this;

		var passengerDataflights = [],
			passengerDestinations = aviation.array.mapElementsToObjByKey(passengerArray, 'destination');

		var typeData = {};

		Object.keys(passengerDestinations).map(function(destination) {

			var airlines = aviation.array.mapElementsToObjByKey(passengerDestinations[destination], 'airline');

			for (var airline in airlines) {
				passengerDataflights.push({
					'passengers' : airlines[airline],
					'destination' : destination,
					'airline' : airline
				})
			}
			for (var i=0; i<passengerDataflights.length; i++) {

				var destination = aviation.get.airportByString(passengerDataflights[i].destination),
					airline = aviation.get.airlineByCode(passengerDataflights[i].airline);

				if (airport !== undefined && airline !== undefined) {

					var matchedflights = self.flights.filter(function(flight) {

						return flight.airline === airline.IATA && flight.destination === airport.IATA;
					})
					if (matchedflights.length !== 0) {

						var types = 
					}

				}

			}


		})


	}


};