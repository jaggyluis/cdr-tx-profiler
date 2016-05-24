(function() {

	function paxBuilder() { 

		function getArrivalDistribution(pArr) {

			var delta = [],
				dist;

			pArr.forEach(function(p) {

				var arrTime,
					depTime;

				if (AVIATION.time.isapTime(p.ARRTIME)) {
					arrTime = AVIATION.time.aptimeToDecimalDay(p.ARRTIME);
				} else if (!isNaN(p.ARRTIME)) {
					arrTime = p.ARRTIME;
				}
				if (AVIATION.time.isapTime(p.DEPTIME)) {
					depTime = AVIATION.time.aptimeToDecimalDay(p.DEPTIME);
				} else if (!isNaN(p.DEPTIME)) {
					depTime = p.DEPTIME;
				}
				if (arrTime && depTime) {
					var near = AVIATION.math.round(AVIATION.time.decimalDayToMinutes(depTime-arrTime),5)
					delta.push(near);
				}
			});
			dist = AVIATION.array.dist(delta);
			console.log(Object.keys(dist).map(function(o) {
				return dist[o];
			}).reduce(function(a,b) {
				return a+b;
			}))
			return dist;
			}

		var flights = [];
		var passengers = p13.concat(p14).concat(p15);
		var typeData = {};
		console.log('total passengers: ', passengers.length);

		var destinations = AVIATION.array.buildLib(passengers, 'DEST');
		Object.keys(destinations).map(function(dest) {
			var aLib = AVIATION.array.buildLib(destinations[dest], 'AIRLINE');
			for (var airline in aLib) {
				flights.push({
					passengers : aLib[airline],
					flight : aLib[airline][0].FLIGHT,
					destination : key.DESTINATION[dest],
					airline : key.AIRLINE[airline],
					aircraft : null,
				})
			}
		})
		console.log('total flight types: ', flights.length)
		var sorted = flights.sort(function(a,b) {
			return b.passengers.length - a.passengers.length
		});
		sorted.forEach((function(f) {

			var airport = AVIATION.get.airportByString(f.destination);
			var airline = AVIATION.get.airlineByCode(f.airline);
			
			if (airport !== undefined && airline !== undefined) {

				var matchedFlights = designDay.filter(function(flight) {
					return flight.OPERATOR == airline.IATA && 
						flight["DEST."] == airport.IATA
				});
				if (matchedFlights.length !== 0) {
					//console.log(airport.IATA, airline.IATA);
					//console.log(matchedFlights);
					var types = matchedFlights.map(function(m) {
						try {
							return AVIATION.get.aircraftByCode(m.AIRCRAFT).RFLW;
						} catch (e) {
							console.log('not in library: ', m.AIRCRAFT)
						}
					});
					var type = AVIATION.array.mode(types);
					if (type in typeData) {
						f.passengers.forEach(function(p) {
							typeData[type].push(p);
						})
					} else {
						typeData[type] = f.passengers;
					}
				} else {
					console.log('flight not matched');
				}
			}

		}).bind(this));

		console.log(typeData);
		console.log(getArrivalDistribution(typeData.C));
	}

	paxBuilder();

})();