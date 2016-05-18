
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
	//console.log(flights);
	console.log(flights.length)
	var BAB = flights.sort(function(a,b) {
		return a.passengers.length - b.passengers.length
	});
	//console.log(BAB)
	BAB.forEach(function(flight) {
		console.log(flight.destination, getAirportByString(flight.destination));
	})

	function getAirportByString(str) {
		var airports = AVIATION._airports.filter(function(airport) {
			return airport.name.match(str) || 
				airport.municipality.match(str);
		});
		if (airports.length === 0) {
			var spl = str.split(/ /);
			var all = [];
			spl.forEach(function(s) {
				AVIATION._airpo
			})
		}
		return airports;
	}

	function buildLib(pArr, key) {
		var lib = {};
		pArr.forEach(function(p) {
			if (p[key] !== null && p[key] !== undefined) {
				if (p[key] in lib) {
					lib[p[key]].push(p);
				} else {
					lib[p[key]] = [p];
				}
			}
		})
		return lib
	}
	function matchAll(pArr, k, l) {
		pArr.forEach(function(p,i) {
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