
(function() {



	var flights = [];
	var passengers = p13.concat(p14).concat(p15);
	console.log(passengers.length);

	var destinations = buildLib(passengers, 'DESTINATION');
	Object.keys(destinations).map(function(dest) {
		var aLib = buildLib(destinations[dest], 'AIRLINE');
		for (var airline in aLib) {
			//if matchAll(aLib[airline], )
			flights.push({
				passengers : aLib[airline],
				flight : aLib[airline][0].FLIGHT,
				destination : key.DESTINATION[dest],
				airline : key.AIRLINE[airline],
				aircraft : null,
			})
		}
	})
	console.log(flights.length)
	var sorted = flights.sort(function(a,b) {
		return a.passengers.length - b.passengers.length
	});
	sorted.forEach(function(f) {

		var airport = AVIATION.get.airportByString(f.destination);
		var airline = AVIATION.get.airlineByCode(f.airline);
		if (airport !== undefined && airline !== undefined) {
			console.log(airport.IATA, airline.IATA);
			console.log(t1designday.filter(function(flight) {
				return flight.airline == airline.IATA && 
					flight.destination == airport.IATA
			}))
		}
	})
	function buildLib(Arr, k) {
		var lib = {};
		Arr.forEach(function(p) {
			if (p[k] !== null && p[k] !== undefined) {
				if (p[k] in lib) {
					lib[p[k]].push(p);
				} else {
					lib[p[k]] = [p];
				}
			}
		})
		return lib
	}
	function matchAll(Arr, k, l) {
		Arr.forEach(function(p,i) {
			pArr.forEach(function(q,j) {
				if (i!==j) {
					if (p[k]!==q[k] || 
						p[l]!==q[l]) {
						return false;
					}
				}
			})
		})
		return true;
	}
})();