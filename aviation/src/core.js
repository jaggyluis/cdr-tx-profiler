var AVIATION = (function (aviation) {


	aviation._flights = [];
	aviation._gates = [];
	aviation._flightProfiles = [];
	aviation._passengerProfiles = [];

	aviation.class = aviation.class || {};
	aviation.get = {

		//
		//	Database methods - eventually needs to be replaced with a server sice component,
		//	along with the profileBuilder
		//

		passengers : function (filter) {

			var passengers = [];

			aviation._flights.forEach(function(flight) {
				flight.getPassengers().forEach(function(passenger) {
					if ( filter === undefined || JSON.stringify(passenger.attributes).match(filter)) {
						passengers.push(passenger);
					}
				});
			});

			return passengers;
		},
		flights : function () {

			return aviation._flights;
		},
		gates : function () {

			return aviation._gates;

		},
		turnaroundTimes : function () {

			return aviation._tt;

		},
		passengerProfiles : function () {

			return aviation._passengerProfiles;

		},
		airportByCode : function (code) {

			return aviation._airports.find(function(obj) {

				return obj.IATA == code;				
			});
		},
		airlineByCode : function (code) {

			return aviation._airlines.find(function(obj) {

				return obj.IATA == code;
			});
		},
		aircraftByCode : function (code) {

			return aviation._aircraft.find(function(obj) {

				return obj.IATA == code;
			});
		},
		airportByString : function (str) {

			var airports = aviation.array.filterStrict(aviation._airports, str);

			if (airports == undefined || airports.length === 0) {
				airports = aviation.array.filterLoose(aviation._airports, str);
			}

			return aviation.array.getBestMatch(airports, str);
		},
		profileByAircraftType : function (type) {

			return aviation._flightProfiles.find(function(p) {

				return p._name === type;

			});
		}
	};
	aviation.clear = function () {

		aviation._gates = [];
		aviation._flights = [];	
	};
	aviation.set = function(gateSchemeObjArr,
					designDayFlightObjArr, 
					flightProfiles, 
					passengerProfiles,
					loadFactor, 
					filter, 
					timeFrame,
					timeSlice) {

		function setGates (gateSchemeObjArr) {

			var gates = [];

			gateSchemeObjArr.forEach(function(gateObj) {

				var gate = aviation.class.Gate(gateObj);

				gates.push(gate);
			});

			return gates;
		};

		function setFlights (designDayFlightObjArr, loadFactor, filter, timeFrame) {

			var flights = [],
				sorted = [],
				filtered = [],
				securityCounters = [10, 10], 
				matrix = aviation.class.Matrix3d(undefined,undefined,timeSlice);

			designDayFlightObjArr.forEach(function(flightObj, index) {

				var flight = aviation.class.Flight(flightObj,
						aviation.get.airportByCode(flightObj.destination),
						aviation.get.airlineByCode(flightObj.airline),
						aviation.get.aircraftByCode(flightObj.aircraft),
						loadFactor);

				flight.setTurnaroundTime(aviation.get.turnaroundTimes());

				//
				//	Filter flights
				//

				if (aviation.time.decimalDayToTime(flightObj.time).split(':')[0] > timeFrame[0] &&
					aviation.time.decimalDayToTime(flightObj.time).split(':')[0] < timeFrame[1]) {
					if (JSON.stringify(flight).match(filter)){
						filtered.push(flight);
					}
				}

				//
				//	Sort ALL flights
				//

				if (sorted.length === 0) {
					sorted.push(flight);
				} else {

					var a = flight.ival.getLength(),
						a_bis = flight.getDesignGroup();

					for (var i=0, len=sorted.length; i<len; i++) {

						var b = sorted[i].ival.getLength(),
							b_bis = sorted[i].getDesignGroup();

						if ( a+a_bis >= b+b_bis ) {

							break;
						}
					}
					sorted.splice(i,0,flight);
				}
				flights.push(flight);
				
			});

			//
			//	Creates the Pax Objects for passenger arrival simulation,
			//	and assigns each flight to a gate using the gate packing algorithm
			//	(bin packing). Now also accounts for airline clustering, but not for initial preference.
			//

			sorted.forEach(function(flight) {

				var pax = aviation.class.Pax(aviation.get.profileByAircraftType(flight.getCategory()), flight, timeSlice);

				flight.findGate(aviation.get.gates());
				matrix = pax.getFlowDistributionMatrix(matrix, aviation.get.passengerProfiles());
			});

			//
			//	Gate clustering verification
			//
			/*
			aviation.get.gates().sort(function(ga, gb) {
				
				return ga.num - gb.num;
			})
			aviation.get.gates().forEach(function(gate) {
				console.log(gate.name, gate.getFlights().map(function(flight) {
					
					return flight.airline.name;
				}))
			})
			*/

			//
			//	Sorts all the passengers in the security arrival timeSlots.
			//	All passengers that are isTransfer and isPreCheck are moved to the front of the queue
			//	and ignored during the queuing process for security
			//

			matrix.sortRowCols(1, function(pa, pb){
				
				if (pa.attributes.securityTime && !pb.attributes.securityTime) {

					return 1;

				} else if (!pa.attributes.securityTime && pb.attributes.securityTime) {

					return -1;

				} else {

					return 0;
				}
			});

			//
			//	 Splice all the transfer passengers for later
			//

			var transferPassengers = matrix.getRow(2).slice();
			matrix.setRow(matrix.getRowBlank(), 2);

			//
			//	Calculate the distributed timings for passengers in the security queue, by 
			//	returning their time spent in the queue as a function of how long they take and 
			//	how many lines are available to them. Ignored passengers are spliced back into the 
			//	front of the queue
			//

			matrix.distributeRowByCounter(1, 2, false, function(passenger, matrix, i, c, r, sort) {

				var securityTime = passenger.attributes.securityTime,
					securityLines = passenger.attributes.bags ?
						securityCounters[0] : securityCounters[1];

				if (sort && securityTime === 0) {
					matrix.d[r][c].splice(0,0,matrix.d[r][c].splice(i,1)[0])
				}
				
				return securityTime / securityLines;
			});

			//
			//	Apply passenger timing to the security times
			//

			matrix.copyRowApply(2, 2, false, function(passenger, matrix, count, i, c) {

				var val = aviation.math.round(passenger.attributes.securityTime, matrix.m ) / matrix.m;

				if (!passenger.attributes.isNull) return c + val;
			});

			//
			//	Merge Transfer passengers back into the main passenger array
			//

			matrix.mergeRows(transferPassengers, 2);

			//
			//	Calculate the passenger timing for arrival at the gate, as a function of the 
			//	weibull distribution and the gate info derived from the flight Pax object
			//

			matrix.copyRowApply(2, 3, false, function(passenger, matrix, count, i, c, r) {

				var gateInfo = passenger.attributes.gateInfo,
					flightTime = aviation.time.decimalDayToMinutes(passenger.flight.getTime());

				//
				//	These are the gate parameters - 
				//	scaleParam : the time in minutes from the 5 minutes to boading call,
				//		set so that the median passenger show up is more or less 50 %
				//		around that time, with a skew to later
				// 	shapeParam : skew the function towards 0
				//	Is is represented as a function of the middle of the boarding timeline,
				//	so that there is some overlap between arrival and boarding.
				//

				var scaleParam = (gateInfo[0] - gateInfo[2]) - ((gateInfo[1] - gateInfo[2]) / 2),
					shapeParam = 1.5,
					weibull = aviation.math.getRandomWeibull(scaleParam, shapeParam);
					delta = (weibull + ((gateInfo[1] - gateInfo[2]) / 2) + gateInfo[2]);

				var	gateTime = aviation.math.round(flightTime - delta, matrix.m) / matrix.m;

				if (passenger.attributes.isGateHog) {

					return c;

				} else {

					return c < gateTime ? gateTime : c;
				}
			});

			//
			//	Passenger timing for boarding distribution.
			//

			matrix.copyRowApply(3, 4, false, function(passenger, matrix, count, i, c, r) {

				var gateInfo = passenger.attributes.gateInfo, 
					gateTime = matrix.m * c,
					flightTime = aviation.time.decimalDayToMinutes(passenger.flight.getTime()),
					deltaFlightTime = flightTime - gateTime;

				var boardingStart = gateInfo[1] < deltaFlightTime ? gateInfo[1] : deltaFlightTime,
					boardingEnd = gateInfo[2],
					boardingTime = boardingStart - boardingEnd;

				var scaleParam = boardingTime / 2,
					shapeParam = 2,
					weibull = aviation.math.getRandomWeibull(scaleParam, shapeParam),
					deltaBoarding = weibull + boardingEnd;

				var boardingMapped = aviation.math.round(flightTime - deltaBoarding, matrix.m) / matrix.m,
					boardingStartMapped = aviation.math.round(flightTime - boardingStart, matrix.m) / matrix.m;

				return passenger.attributes.isBusiness ? boardingStartMapped : boardingMapped ;
			})

			//
			//	Final Passenger timing assignment from location within the combination matrix.
			//

			matrix.forEachItem(function(passenger, count, i, c, r) {

				var rounded = aviation.time.minutesToDecimalDay(matrix.m * c);
				
				switch (r) {

					case 0 :

						passenger.setEvent('arrival', rounded);

						break;

					case 1 :

						passenger.setEvent('security', rounded);

						break;

					case 2 :

						passenger.setEvent('concourse', rounded);

						break;

					case 3 :

						passenger.setEvent('gate', rounded);

						break;

					case 4 :

						passenger.setEvent('boarding', rounded);

						break;

					case 5 : 

						passenger.setEvent('departure', rounded);

						break;

					default:

						break;
				};
			})

			console.log(matrix);

			return filtered;
		};

		aviation._flightProfiles = flightProfiles;
		aviation._passengerProfiles = passengerProfiles;
		aviation._gates = setGates(gateSchemeObjArr);
		aviation._flights = setFlights(designDayFlightObjArr, loadFactor, filter, timeFrame);
	};

	return aviation;

})(AVIATION || {});
