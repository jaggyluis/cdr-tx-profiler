var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Pax = function(flightClass, flight, timeSlice) {
		
		return new Pax(flightClass, flight, timeSlice);
	}

	function Pax(flightClass, flight, timeSlice) {

		this.flight = flight;
		this.flightClass = flightClass;
		this.timeSlice = timeSlice;
	}
	Pax.prototype = {

		get type () {

			return this.flightClass.type;
		},
		get data () {

			return this._data;
		},
		get profile () {

			return this._dist[this.flightClass._name];
		},
		get passengerTypeDistributionPercentages () {

			return this.flightClass._getPerc()[this.flight.getDI()];
		},
		get passengerTypeDistributionArray () {

			return this.flightClass._getPercArray(this.passengerTypeDistributionPercentages);
		},

		_dist : { 										

			//
			// 	! superceded
			//	Distributions for passengers from arrival to boarding for the Perth airport.
			//	Derived from Perth by Richard Spencer - assumptions.
			//

			'C': [		// Low Cost
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,1,2,2,3,4,5,6,7,8,9,10,10,9,7,3,3,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,4,3,2,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],

			'_C': [		// Full Service - swap if needed
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,2,3,3,4,5,6,7,8,9,10,10,9,7,3,3,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,3,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],

			'D': [		// Assuming same as Full Service C
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,2,3,3,4,5,6,7,8,9,10,10,9,7,3,3,2,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,3,1,1,1,1,6,45,26,2,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]
			],

			'E': [  	// Full service
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			],

			'_E': [ 	// Low Cost - swap if needed
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,25,25,25,15,2,0,0]
			],

			'F': [ 		// same as E
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			]
		},

		_data : {

			'globals' : {
				
				//
				//	global variables for Pax object
				//
			},

			'designGroupBoardingDistribution' : { 

				//
				//	Start and end times for boarding call
				//	Derived from Perth by Richard Spencer - assumptions.
				//	29 - 50% are at gate prior to boarding.
				//

				'C' : 					[25,	20,		10],
				'D' : 					[30,	25,		10],
				'E' : 					[40,	35,		10],
				'F' : 					[50,	45,		15],
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
		},

		getTimeActual : function (minutes) {

			//
			//	Returns the decimal day time for
			//	the current flight object associated with this pax object.
			//

			var departureTime = this.flight.getTime(),
				arrivalTime = aviation.time.minutesToDecimalDay(minutes);

			return  departureTime > arrivalTime ? 
				departureTime - arrivalTime :
				1 + departureTime - arrivalTime;

		},
		getFlowDistributionMatrix : function (m) {

			//
			//	Needs to be replaced with a fit function and statistical model that
			//	estimates the arrival probability distribution (Weibull/Poisson?)
			//
			//
			//	checkInCounters can be replaced with a function of capacity (ACRP)
			//
			var self = this;

			var passengerPercentagesTotal = self.passengerTypeDistributionPercentages,
				passengerSeats = self.flight.seats,
				checkInCounters = Math.ceil(passengerSeats / 100),
				passengers = [],
				arrivalMatrix = aviation.class.Matrix3d(3, 1440 / self.timeSlice, self.timeSlice),
				transferMatrix = aviation.class.Matrix3d(3, 1440 / self.timeSlice, self.timeSlice);
				

			//
			//	Weibull shape parameters for gate and boarding probability
			//	distribution.
			//

			var gateTimingInfo = self.data.designGroupBoardingDistribution[self.flight.getCategory()];

			//
			//	Apply all data to passenger arrivalMatrix
			//

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
							self.timeSlice),
						departureTimeRounded = aviation.math.floor(
							aviation.time.decimalDayToMinutes(self.flight.getTime()),
							self.timeSlice);

					arrivalTimePercentageMapped = arrivalTimePercentageMapped > 0 && arrivalTimePercentageMapped < 1 ?
						aviation.math.getRandomBinaryWithProbablity(arrivalTimePercentageMapped) : 
						Math.round(arrivalTimePercentageMapped);

					for (var i=0; i<arrivalTimePercentageMapped; i++) {

						//
						//	Create passengers for each mapped flight percentage.
						// 	This is also assigning default arrival times and departure times to the 
						//	passenger arrivalMatrix
						//

						var passenger = aviation.class.Passenger(self.flight, passengerProfile),
							checkInTime = passenger.attributes.isTransfer ?
								0 : !passenger.attributes.bags ?
								0 : aviation.math.getRandomArbitrary(self._data.timing.checkIn),
							securityTime = passenger.attributes.isTransfer ?
								0 : passenger.attributes.isPreCheck ?
								0 : aviation.math.getRandomArbitrary(self._data.timing.security);
						
						passenger.setAttribute('checkInTime', checkInTime);
						passenger.setAttribute('securityTime', securityTime);
						passenger.setAttribute('gateInfo', gateTimingInfo);
						passengers.push(passenger);

						//
						//	In order to handle transfer passengers - they are not included in the
						//	arrivalMatrix simulation up until the concourse level. 
						//

						if (passenger.attributes.isTransfer) {
							passenger.setEvent('arrival', arrivalTimeActual);
							passenger.setEvent('security', arrivalTimeActual);
							passenger.setEvent('concourse', arrivalTimeActual);
							transferMatrix.pushItem(passenger, 1, arrivalTimeRounded / self.timeSlice);
						} else {
							arrivalMatrix.pushItem(passenger, 0, arrivalTimeRounded / self.timeSlice);
						}

						arrivalMatrix.pushItem(passenger, -1, departureTimeRounded / self.timeSlice);
					}
				});
			});
			
			//
			//	Add all the passengers to this flight's passenger array
			//	for later usage. 
			//

			self.flight.setPassengers(passengers);

			//
			//	Sort passengers by their checkInTime - making sure that the tansfer and 
			//	bag-less passengers remain at the bottom prior to distribution.
			//

			arrivalMatrix.sortRowCols(0, function(pa, pb){
			
				if (pa.attributes.checkInTime && !pb.attributes.checkInTime) {

					return 1;

				} else if (!pa.attributes.checkInTime && pb.attributes.checkInTime) {

					return -1;

				} else {

					return 0;
				}
			});

			//
			//	Assign passenger check in queuing times
			//	Uses the callback method to pop off the end of the list if the sum of all
			//	passenger times is over the given timeslot.
			//

			arrivalMatrix.distributeRowByIndex(0, 1, false, function(passengerArray, matrix, c, r) {

				if (passengerArray.length !== 0) {

					var sub = aviation.class.Matrix3d(1, checkInCounters, matrix.m),
						count = 0,
						overflow = [];

					passengerArray.sort(function(pa,pb) {

						//
						//	This makes sure that all transfer and passengers with no
						//	bags are maintained at the front of the list when the new list is inserted
						//	in front. It also makes sure they stay in the correct sorted order.
						//

						if (pa.attributes.isNull && pb.attributes.isNull) {

							return 0;
						
						} else if (pa.attributes.isNull && !pb.attributes.isNull) {

							return -1;
						
						} else if (!pa.attributes.isNull && pb.attributes.isNull) {

							return 1;
						
						} else {

							if (pa.attributes.checkInTime && !pb.attributes.checkInTime) {

								return 1;

							} else if (!pa.attributes.checkInTime && pb.attributes.checkInTime) {

								return -1;

							} else {

								return 0;
							}
						}
					});

					for (var i = 0; i<passengerArray.length; i++) {
						sub.pushItem(passengerArray[i], 0, 0)
					}

					//
					//	Calculate  the index by packing passengers within the counters
					//

					sub.distributeRowByCallBack(0, 0, false, function(passengerArray, m, c, r) {

							var sum = passengerArray.reduce(function(val, passenger, i) {

								return val+passenger.attributes.checkInTime;

							}, 0);

							if (passengerArray.length > 1 && sum > matrix.m) {
								if (c === m.d[r].length - 1) {
									count ++ ;
								}

								return true;

							} else {
								if (sum > matrix.m) {
									
									var nullPassenger = aviation.class.Passenger.null(),
										deltaTime = sum - matrix.m;

									nullPassenger.setAttribute('checkInTime', deltaTime);
									nullPassenger.setAttribute('passengerID', aviation.string.generateUUID());
									overflow.push(nullPassenger);
								}
								
								return false;
							}

					})
					/*
					for (var i=0; i<overflow.length; i++) {
						console.log(overflow[i])
						matrix.spliceItem(overflow[i], 0, r, c+1);
					}
					*/
					return passengerArray.length - count;
				}
			});

			//
			//	Assign passenger walk to security times
			//	this is an optional row that distributes walk times from the check in counter to
			//	security. removed for now, as it invalidates the simulation with regards to
			//	industry standard. It might be worth implementing this with the design scheme.
			//
			/*
			arrivalMatrix.copyRowApply(1, 2, true, function(passenger, matrix, count, index, column) {

				var walkTimeToSecurity = aviation.math.getRandomArbitrary(self.data.walkTimes.security),
					indexTimeSlot = self.timeSlice * (index / count),
					deltaTimeSlot = aviation.math.round(walkTimeToSecurity + indexTimeSlot, self.timeSlice),
					deltaTimeSlotMapped = deltaTimeSlot / self.timeSlice;

				return column + deltaTimeSlotMapped;
			});
			*/

			arrivalMatrix.copyRowApply(1, 1, false, function(passenger, matrix, count, i, c) {

				var val = aviation.math.round(passenger.attributes.checkInTime, matrix.m ) / matrix.m;

				if (!passenger.attributes.isNull) return c + val;
			});

			//
			//	Assign the passenger  wait time at security to the profile.
			//	look into how to move this elsewhere?
			//

			arrivalMatrix.forEachItem(function(passenger, count, i, c, r) {

				var rounded = aviation.time.minutesToDecimalDay(arrivalMatrix.m * c);

				switch (r) {

					case 0 :

						passenger.setEvent('arrival', rounded);

						break;

					case 1 :

						passenger.setEvent('security', rounded);

						break;

					case 2 :

						passenger.setEvent('departure', rounded);

						break;

					default:

						break;
				};
				
			});

			/*
			arrivalMatrix.forEachItem(function(passenger) {
				console.log(passenger);
				if (passenger.getEvent('security').value !== null) {
					var val = passenger.getEvent('security').value - passenger.getEvent('arrival').value
					console.log(aviation.time.decimalDayToMinutes(val));
				} else {
					console.warn(passenger);
				}
			})
			*/

			//console.log(arrivalMatrix);
			//arrivalMatrix.merge(transferMatrix);

			return m.merge(arrivalMatrix);
		}
	}

	return aviation;

})(AVIATION || {});