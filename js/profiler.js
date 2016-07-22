importScripts('lib/aviation/airports.js',
	'lib/aviation/airlines.js',
	'lib/aviation/aircraft.js',
	'lib/aviation/tt.js',
	'lib/aviation/aviation.js');


function Profiler(passengerData, flightData, attributeData) {

	this.passengers = passengerData;
	this.attributes = attributeData;
	this.flights = flightData;


	this._cluster = this.cluster(this.passengers, this.attributes);
	this._cluster.flightTypes = this.match(this._cluster.flightTypes, this.flights);

	for (var key in this._cluster.passengerTypes) {

		var arr = this._cluster.passengerTypes[key],
			len = arr.length,
			perc = this.percentile(arr, len, true);

		console.log(key);

		for (var p in perc) {
			console.log(p, perc[p]);
		}
	}	
}
Profiler.prototype = {

	percentile : function (passengers, total, weighted) {

		var count = 0,
			weightedCount = 0,
			weighted = weighted === undefined ? false : weighted,
			percentiles = {};

		for (var i=0; i<passengers.length; i++) {
			for (var key in passengers[i]) {
				if (!(key in percentiles)) {
					percentiles[key] = 0;
				}
				if (passengers[i][key]) {
					percentiles[key] += weighted ? passengers[i].weight : 1;
				}
			}
			weightedCount += weighted ? passengers[i].weight : 1;
			count++;
		}

		return Object.keys(percentiles).reduce(function(obj, attribute) {
			if ('br'+attribute.toString() in percentiles) {
				//obj['br'+attribute.toString()] = Math.round(func(filtered[b] / count) * 100);
			}
			obj[attribute] = Math.round((percentiles[attribute] / weightedCount) * 100);

			return obj;

		}, {
			'count' : count,
			'weighted' : weighted,
			'percentage' : Math.round(count / total * 100)
		});
	},
	stream : function (passengers, attribute) {

		return AVIATION.array.mapElementsToObjByKey(passengers, attribute);

	},
	permute : function (attributes) {

		var permuted = [[]],
			curr = [];

		for (var i=0; i<nestedArray.length; i++) {
			for (var j=0; j<nestedArray[i].length; j++) {
				for (var k=0; k<permuted.length; k++) {
					curr.push(permuted[k].slice().concat([nestedArray[i][j]]));
				}
			}
			permuted = curr;
			curr = [];
		}

		return permuted;
	},
	cluster : function (passengers, attributes) {

		var typeCluster = {},
			typeAttibutes = attributes,
			
			flightCluster = {},
			flightAttributes = ['airline', 'destination'];

		for (var i=0; i<passengers.length; i++) {

			var type = [],
				flight = [];

			for (var j=0; j<typeAttibutes.length; j++) {
				type.push(passengers[i][typeAttibutes[j]]);
			}
			type = type.join('.');
			if (!(type in typeCluster)) {
				typeCluster[type] = [];
			}
			typeCluster[type].push(passengers[i]);

			for (var k=0; k<flightAttributes.length; k++) {
				flight.push(passengers[i][flightAttributes[k]]);
			}
			flight = flight.join('.');
			if (!(flight in flightCluster)) {
				flightCluster[flight] = [];
			}
			flightCluster[flight].push(passengers[i]);

			passengers[i].flightType = flight;
			passengers[i].passengerType = type;
		}

		return {
			'passengerTypes' : typeCluster,
			'flightTypes' : flightCluster
		}
	},
	match : function (flightTypes, flights) {

		var typeCluster = {};

		Object.keys(flightTypes).forEach(function(flight) {

			var params = flight.split('.');
				airline = AVIATION.get.airlineByCode(params[0]),
				destination = AVIATION.get.airportByString(params[1]);

			if (airline && destination) {
				
				for (var i=0; i<flights.length; i++) {
					if (flights[i].airline == airline.IATA && flights[i].destination == destination.IATA) {

						var aircraft = AVIATION.get.aircraftByCode(flights[i].aircraft),
							type = aircraft ? AVIATION.time.romanToLetter(aircraft.ARC.split('-')[1]) : undefined; 

						if (aircraft == undefined) {
							break;
						}
						if (!(type in typeCluster)) {
							typeCluster[type] = [];
						}
						typeCluster[type] = typeCluster[type].concat(flightTypes[flight]);

						for (var j=0; j<flightTypes[flight].length; j++) {
							flightTypes[flight][j].flightType = type;
						} 

						break;

					}
				}
			}
		});

		return typeCluster;

	}
}