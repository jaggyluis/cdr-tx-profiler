var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Pax = function(flightClass, flight) {
		return new Pax(flightClass, flight);
	}

	function Pax(flightClass, flight) {

		this.time = [180,0,5];
		this.flight = flight;
		this.flightClass = flightClass;
		this.legend = [
			'airport',
			'departureLounge',
			'boardingZone',
			'boarding'
		];
	}
	Pax.prototype = {

		get type() {

			return this.flightClass.type;
		},
		get profile() {

			return this._data[this.flightClass._name];
		},
		get passengerTypeDistributionPercentages() {

			return this.flightClass._getPerc()[this.flight.getDI()];
		},
		get passengerTypeDistributionArray() {

			return this.flightClass._getPercArray(this.passengerTypeDistributionPercentages);
		},

		_data : { // ! superceded

			'C': [	// Low Cost
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,1,2,2,3,4,5,6,7,8,9,10,10,9,7,3,3,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,4,3,2,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],
			'_C': [	// Full Service - swap if needed
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,2,3,3,4,5,6,7,8,9,10,10,9,7,3,3,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,3,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],
			'D': [	// Assuming same as Full Service C
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,2,3,3,4,5,6,7,8,9,10,10,9,7,3,3,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,3,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],
			'E': [  // Full service
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			],
			'_E': [ // Low Cost - swap if needed
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,25,25,25,15,2,0,0]
			],
			'F': [ 	// same as E
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			]
		},

		getArrivalDistributionMatrix : function() {
			//
			//	This needs to be replaced with a fit function and statistical model that
			//	estimates the arrival probability distribution (Weibull?)
			//
			function getRandomBinaryWithProbablity(p) {
				if ( Math.random() >= 1-p) return 1;
				return 0;
			}

			var passengerPercentagesTotal = this.passengerTypeDistributionPercentages,
				passengerArrivalDistributionTimes = {},
				passengerSeats = this.flight.seats;

			Object.keys(passengerPercentagesTotal).map(function(type) {

				var typePercentageTotal = Math.ceil((passengerPercentagesTotal[type].percentage / 100) * passengerSeats);
				passengerArrivalDistributionTimes[type] = {};

				Object.keys(passengerPercentagesTotal[type].dist).map(function(arrivalTime) {

					var arrivalTimePercentageTotal = passengerPercentagesTotal[type].dist[arrivalTime];
						arrivalTimePercentageMapped = arrivalTimePercentageTotal / 100 * typePercentageTotal

					arrivalTimePercentageMapped = arrivalTimePercentageMapped > 0 && arrivalTimePercentageMapped < 1 ?
						getRandomBinaryWithProbablity(arrivalTimePercentageMapped) : 
						Math.round(arrivalTimePercentageMapped);
				
					passengerArrivalDistributionTimes[type][arrivalTime] = arrivalTimePercentageMapped;
				});
			});

			console.log(passengerArrivalDistributionTimes);








			// keep doing the old version for now
			this.flight.setPassengers(this);
		}
	}

	return aviation;

})(AVIATION || {});