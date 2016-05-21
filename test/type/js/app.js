(function() {	

	function typeBuilder() {

		function getPassengersByDI(pArr) {

			var filtered = {
				domestic : [],
				international : [],
			}

			pArr.forEach(function(p) {

			});
		}

		function getPassengersByDT(pArr) {

			var filtered = {
				departing : [],
				transfer : []
			}

			pArr.forEach(function(p) {

				for (var i=1; i<=6; i++) {

					var dt = p['Q3GETTO'+i.toString()]
					var arrTime = p['ARRTIME'];

					if (dt === 3 || arrTime === 'N') {
						filtered.transfer.push(p);
						return;
					}
				}
				filtered.departing.push(p);
				return;

			});
			return filtered;
		}

		function getPassengersByType(pArr) {

			var filtered = {
				leisure : [],
				business : [],
				other : []
			};

			pArr.forEach(function(p) {

				for (var i=1; i<=3; i++) {

					var type = p['Q2PURP'+i.toString()]

					switch ( type ) {
						case 1 :
							filtered.business.push(p);
							return;
						case 2 || 3 || 4 || 5 || 6: 
							filtered.leisure.push(p);
							return;
						default :
							break;
					}
				}
				filtered.other.push(p);
				return;
			});
			return filtered;
		};

		function getTypeProfile(pArr, weighted) {
			
			var filtered = {
				percentage : 0,
				bags : 0,
				shop : 0,
				food : 0,
			};

			pArr.forEach(function(p) {
				var weight = p.WEIGHT && weighted ? p.WEIGHT : 1;
				filtered.percentage++;
				if(p.Q4BAGS === 1) filtered.bags+=weight;
				if(p.Q4STORE === 1) filtered.shop+=weight;
				if(p.Q4FOOD === 1) filtered.food+=weight;
			});

			console.log(filtered);

			return Object.keys(filtered).reduce(function(a,b) {
				a[b] = Math.round((filtered[b]/filtered.percentage)*100);
				return a;
			},{})
		};

		var passengers = p12.concat(p13).concat(p14).concat(p15);
		passengers = passengers.filter(function(p) {
			return p.BAREA == 'A' || (p.GATE >= 1 && p.GATE < 13) ||
				p.BAREA == 'B' || (p.GATE >= 20 && p.GATE < 40) ||
				p.BAREA == 'C' || (p.GATE >= 40 && p.GATE < 49);
		});

		var len = passengers.length;
		//var filtered = getPassengersByType(passengers);
		var filtered = getPassengersByDT(passengers);

		console.log('total profile');
		console.log(getTypeProfile(passengers))
		console.log(filtered)

		for (var type in filtered) {
			console.log(type, Math.round(filtered[type].length/passengers.length*100));
			console.log(getTypeProfile(filtered[type]));
		}
	}

	typeBuilder();

})();