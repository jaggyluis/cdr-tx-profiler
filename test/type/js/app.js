
//--------------------------------------------------------
// main app
//--------------------------------------------------------
'use strict';


(function() {	

	function typeBuilder() {

		function getPassengersByType(pArr) {

			var types = {
				leasure : [2,3,4,5,6],
				business : [1,11],
				assisted : [10],
				unique : [7,12],
				family : [13]
			};

			var filtered = {
				leasure : [],
				business : [],
				assisted : [],
				unique : [],
				family : []
			};

			var Q8assisted = Object.keys(key.Q8assisted),
				Q8family = Object.keys(key.Q8family),
				Q8unique = Object.keys(key.Q8unique);

			pArr.forEach(function(p) {

				var age = p.Q18AGE;

				if (age === 1) {
					filtered['assisted'].push(p);
					return;
				}

				for (var i=0; i<=6; i++) {

					if (Q8assisted.includes(p['Q8COM'+i.toString()])) { //answered assisted
						filtered['assisted'].push(p);
						return;
					}
					if (Q8family.includes(p['Q8COM'+i.toString()])) { //answered assisted
						filtered['family'].push(p);
						return;
					}
					if (p['Q2PURP']+i.toString() == 4 && age > 2) {
						filtered['family'].push(p);
						return;
					}
					if (Q8unique.includes(p['Q8COM'+i.toString()])) { //answered assisted
						filtered['unique'].push(p);
						return;
					}
				}

				for (var i=0; i<=6; i++) {

					for (var type in types) {
						if (types[type].includes(p['Q2PURP'+i.toString()])) {
							filtered[type].push(p);
							return;
						}
					}
				}
			});
			return filtered;
		};
		function buildTypeProfile(pArr, weighted) {
			
			var profile = {
				percentage : 0,
				speed : 0,
				bags : 0,
				df : 0,
				food : 0
			};

			pArr.forEach(function(p) {
				var weight = p.WEIGHT && weighted ? p.WEIGHT : 1;
				profile.percentage++;
				if(p.Q4BAGS === 1) profile.bags+=weight;
				if(p.Q4STORE === 1) profile.df+=weight;
				if(p.Q4FOOD === 1) profile.food+=weight;
			})

			console.log(profile);

			return Object.keys(profile).reduce(function(a,b) {
				a[b] = Math.round((profile[b]/profile.percentage)*100);
				return a;
			},{})
		};

		var passengers = p12.concat(p13).concat(p14).concat(p15);
		passengers = passengers.filter(function(p) {
			return p.BAREA == 'B' || (p.GATE >= 20 && p.GATE < 40) ||
				p.BAREA == 'A' || (p.GATE >= 1 && p.GATE < 13);
			//return p.BAREA == 'C' || (p.GATE >= 40 && p.GATE < 49);
			//return p.BAREA == 'D' || (p.GATE >= 50 && p.GATE < 60);
			//return p.BAREA == 'E' || (p.GATE >= 60 && p.GATE < 70);
			//return p.BAREA == 'F' || (p.GATE >= 70 && p.GATE < 91);
			//return p.BAREA == 'G' || (p.GATE >= 91 && p.GATE < 103);
		})
		var len = passengers.length;
		var filtered = getPassengersByType(passengers);

		console.log('total profile');
		console.log(buildTypeProfile(passengers))
		//console.log(buildTypeProfile(passengers, true))

		console.log(filtered)

		for (var type in filtered) {
			console.log(type, Math.round(filtered[type].length/passengers.length*100));
			console.log(buildTypeProfile(filtered[type]));
			//console.log(buildTypeProfile(filtered[type], true));
		}
	}

	typeBuilder();

})();