var AVIATION = (function (aviation) {

	aviation.array = {

		filterStrict : function (Arr, str) {

			var spl = str.split(/[^\w\.]/);

			return Arr.filter(function(obj) {

				return spl.every(function(s) {

					return JSON.stringify(obj).match(s);
				});
			});
		},
		filterLoose : function (Arr, str) {

			var spl = str.split(/[^\w\.]/);

			return Arr.filter(function(obj) {

				return spl.some(function(s) {

					return JSON.stringify(obj).match(s);
				});
			});
		},
		getBestMatch : function (Arr, str) {

			var spl = str.split(/[^\w\.]/);

			if (!Arr) return Arr;

			return Arr.sort(function(a,b) {

				var ac = 0, 
					bc = 0;

				spl.forEach(function(s) {
					if (JSON.stringify(a).match(s)) ac++;
					if (JSON.stringify(b).match(s)) bc++;
				})

				return bc-ac;

			})[0];
		},
		mode : function (Arr) {

			var max = Arr[0],
				hold = {};

			for (var i=0; i<Arr.length; i++) {
				if (hold[Arr[i]]) {
					hold[Arr[i]]++;
				} else {
					hold[Arr[i]] = 1;
				}
				if (hold[Arr[i]] > hold[max]) {
					max = Arr[i];
				}
			}

			return max;
		},
		mapElementsToObjByPercentile : function (Arr, clean) {

			var len = Arr.length,
				perc = {};

			for (var i=0; i<Arr.length; i++) {
				if (perc[Arr[i]]) {
					perc[Arr[i]]++;
				} else {
					perc[Arr[i]] = 1;
				}
			}
			for (var p in perc) {
				perc[p] = Math.round((perc[p]/len)*100);
				if (perc[p] === 0 && clean) delete perc[p];
			}

			return perc;
		},
		mapElementsToObjByKey : function (Arr, k) {

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
		},
		hasAllMatchingElementsByKeys : function (Arr, k, l) {

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
	}

	return aviation;

})(AVIATION || {});