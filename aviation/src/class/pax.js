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

		_dist : { 										// ! superceded

			'C': [										// Low Cost
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,1,2,2,3,4,5,6,7,8,9,10,10,9,7,3,3,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,4,3,2,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],
			'_C': [										// Full Service - swap if needed
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,2,3,3,4,5,6,7,8,9,10,10,9,7,3,3,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,3,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],
			'D': [										// Assuming same as Full Service C
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,2,3,3,4,5,6,7,8,9,10,10,9,7,3,3,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,3,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],
			'E': [  									// Full service
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			],
			'_E': [ 									// Low Cost - swap if needed
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,25,25,25,15,2,0,0]
			],
			'F': [ 										// same as E
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			]
		},

		_data : {

			'globals' : { 								// minutes

				'arrival' : 			[],
				'checkIn' : 			[1.0, 5.0],		// (ACRP)
				'security' : 			[0.3, 0.7], 	// verify this rate 140/hr ~ 0.43 (ACRP)
				'concourse' : 			[],
				'gate': 				[],
				'boarding': 			[],
				'departure' : 		[]
			},
			'walkTimes' : {

				'security' : 			[2.0, 5.0]
			}
		},

		get data() {

			return this._data;
		},

		getTimeActual(minutes) {

			//
			//	This method returns the decimal day time for
			//	the current flight object associated with this pax object.
			//

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
			//
			//	checkinCounters can be replaced with a function of capacity (ACRP)
			//

			var passengerPercentagesTotal = this.passengerTypeDistributionPercentages,
				passengerSeats = this.flight.seats,
				checkinCounters = Math.floor(passengerSeats / 100),
				passengers = [],
				modulo = 5,
				matrix = aviation.class.Matrix3d(3, 1440 / modulo, modulo),
				self = this;


			Object.keys(passengerPercentagesTotal).map(function(type) {

				var typePercentageTotal = Math.ceil((passengerPercentagesTotal[type].percentage / 100) * passengerSeats),
					passengerProfile = aviation._passengerProfiles.find(function(profile) {
								return profile._name === type;
							});

				Object.keys(passengerPercentagesTotal[type].dist).map(function(arrivalTime) {

					//
					//	Convert the passenger type distribution percentages from the flightProfile
					//	into a mapped number for this particular flight
					//

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
						aviation.math.getRandomBinaryWithProbablity(arrivalTimePercentageMapped) : 
						Math.round(arrivalTimePercentageMapped);

					for (var i=0; i<arrivalTimePercentageMapped; i++) {

						//
						//	Create passengers for each mapped flight percentage.
						// 	This is also assigning default arrival times and departure times to the 
						//	passenger matrix
						//

						var passenger = aviation.class.Passenger(self.flight, passengerProfile),
							checkInTime = passenger.attributes.isTransfer ?
								0 : !passenger.attributes.bags ?
								0 : aviation.math.getRandomArbitrary(self._data.globals.checkIn),
							securityTime = passenger.attributes.isTransfer ?
								0 : passenger.attributes.isPreCheck ?
								0 : aviation.math.getRandomArbitrary(self._data.globals.security);
						
						passenger.setAttribute('checkInTime', checkInTime);
						passenger.setAttribute('securityTime', securityTime);
						passengers.push(passenger);

						//
						//	In order to handle transfer passengers - they are not included in the
						//	matrix simulation up until the concourse level. 
						//

						if (passenger.attributes.isTransfer) {
							passenger.setEvent('arrival', arrivalTimeActual);
							passenger.setEvent('security', arrivalTimeActual);
							passenger.setEvent('concourse', arrivalTimeActual);
						} else {
							matrix.pushItem(passenger, 0, arrivalTimeRounded / modulo);
						}
						matrix.pushItem(passenger, -1, departureTimeRounded / modulo);
					}
				});
			});
			
			//
			//	Add all the passengers to this flight's passenger array
			//	for later usage. 
			//

			self.flight.setPassengers(passengers);

			//
			//	Sort passengers by their checkin time - making sure that the tansfer and 
			//	bag-less passengers remain at the bottom prior to distribution.
			//

			matrix.sortRowCols(0, function(pa, pb){
			
				if (pa.attributes.checkInTime && !pb.attributes.checkInTime) {

					return 1;

				} else if (!pa.attributes.checkInTime && pb.attributes.checkInTime) {

					return -1;

				} else {

					return 0;
				}
			});

			//
			//	Assign passenger check in queing times
			//	Uses the callback method to pop off the end of the list if the sum of all
			//	passenger times is over the given timeslot.
			//

			matrix.distributeRowByCallBack(0, 1, false, function(passengerArray, mod) {

				var sum = passengerArray.reduce(function(val, passenger, i) {

					//
					//	This makes sure that all transfer and passengers with no
					//	bags are maintained at the front of the list when the new list is inserted
					//	in front. It also makes sure they stay in the correct sorted order.
					//

					if (passenger.attributes.checkInTime === 0) {
						passengerArray.splice(0,0,passengerArray.splice(i,1)[0])
					}

					return val + passenger.attributes.checkInTime;
				}, 0);

				return sum / checkinCounters > mod;
			})

			//
			//	Assign passenger walk to security times
			//	this is an optional row that distributes walk times from the check in counter to
			//	security. removed for now, as it invalidates the simulation with regards to
			//	industry standard. It might be worth implementing this with the design scheme.
			//
			/*
			matrix.copyRowApply(1, 2, true, function(passenger, count, index, column) {

				var walkTimeToSecurity = aviation.math.getRandomArbitrary(self.data.walkTimes.security),
					indexTimeSlot = modulo * (index / count),
					deltaTimeSlot = aviation.math.round(walkTimeToSecurity + indexTimeSlot, modulo),
					deltaTimeSlotMapped = deltaTimeSlot / modulo;

				return column + deltaTimeSlotMapped;
			});
			*/

			matrix.shiftRow(1,-1);

			return m.merge(matrix);
		}
	}

	return aviation;

})(AVIATION || {});