var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Pax = function(flightClass, flight) {
		
		return new Pax(flightClass, flight);
	}

	function Pax(flightClass, flight) {

		this.flight = flight;
		this.flightClass = flightClass;
	}
	Pax.prototype = {

		get type() {

			return this.flightClass.type;
		},
		get profile() {

			return this._dist[this.flightClass._name];
		},
		get passengerTypeDistributionPercentages() {

			return this.flightClass._getPerc()[this.flight.getDI()];
		},
		get passengerTypeDistributionArray() {

			return this.flightClass._getPercArray(this.passengerTypeDistributionPercentages);
		},

		_dist : { // ! superceded

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

		_data : {

			'globals' : {

				'arrivalTime' : 		[],
				'checkIn' : 			[2, 5],
				'security' : 			[1, 2],
				'departureLounge' : 	[],
				'boardingZone': 		[],
				'boarding': 			[]
			}
		},

		get data() {

			return this._data;
		},

		getTimeActual(minutes) {

			var departureTime = this.flight.getTime(),
				arrivalTime = aviation.time.minutesToDecimalDay(minutes);

			return  departureTime > arrivalTime ? 
				departureTime - arrivalTime :
				1 + departureTime - arrivalTime;

		},
		getFlowDistributionMatrix : function(m) {
			//
			//	This needs to be replaced with a fit function and statistical model that
			//	estimates the arrival probability distribution (Weibull/Poisson?)
			//
			function getRandomBinaryWithProbablity(p) {

				return Math.random() >= 1-p ? 1 : 0;
			};
			function interpolateRandom(range) {
				
				return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
			};	

			var passengerPercentagesTotal = this.passengerTypeDistributionPercentages,
				passengerSeats = this.flight.seats,
				passengers = [],
				modulo = 5,
				matrix = aviation.class.Matrix3d(3, 1440 / modulo, modulo);
				self = this;

			Object.keys(passengerPercentagesTotal).map(function(type) {

				var typePercentageTotal = Math.ceil((passengerPercentagesTotal[type].percentage / 100) * passengerSeats);

				Object.keys(passengerPercentagesTotal[type].dist).map(function(arrivalTime) {

					var arrivalTimePercentageTotal = passengerPercentagesTotal[type].dist[arrivalTime];
						arrivalTimePercentageMapped = arrivalTimePercentageTotal / 100 * typePercentageTotal,
						arrivalTimeActual = self.getTimeActual(arrivalTime),
						arrivalTimeRounded = aviation.math.floor(
							aviation.time.decimalDayToMinutes(arrivalTimeActual), 
							modulo),
						departureTimeRounded = aviation.math.floor(
							aviation.time.decimalDayToMinutes(self.flight.getTime()),
							modulo);

					arrivalTimePercentageMapped = arrivalTimePercentageMapped > 0 && arrivalTimePercentageMapped < 1 ?
						getRandomBinaryWithProbablity(arrivalTimePercentageMapped) : 
						Math.round(arrivalTimePercentageMapped);

					for (var i=0; i<arrivalTimePercentageMapped; i++) {

						var passenger = aviation.class.Passenger(self.flight, type);
						
						matrix.pushItem(passenger, 0, arrivalTimeRounded / modulo);
						matrix.pushItem(passenger, -1, departureTimeRounded / modulo);

						passengers.push(passenger);
					}

				});
			});

			this.flight.setPassengers(passengers);

			//
			//	New passenger distribution functionality
			// matrix.applyRow(1,2, ( matrix.m * checkinCounters ) / checkInTime );
			
			matrix.applyRow( 0, 1, ( modulo * 5 ) / 5 );


			console.log(matrix)
			
			return m.merge(matrix);
		}
	}

	return aviation;

})(AVIATION || {});