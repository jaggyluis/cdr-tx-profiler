aviation.core.csv = {
	parse : function (str) {
		var parsed = str.split('\n'),
			re = /[^\w\:\-]/gi,
			keys = parsed[0].split(',').map(function(str) {
				return str.replace(re, "");
			});
		return parsed.slice(1).map(function(csvarray) {
			var flight = {};
			csvarray.split(',').map(function(str) {	return str.replace(re, "");	})
				.forEach(function(value, idx) {
				if (!isNaN(Number(value))) flight[keys[idx]] =  Number(value);
				else if (value.match(':')) flight[keys[idx]] = aviation.core.time.toDecimalDay(value);
				else flight[keys[idx]] = value;
			});
			return flight;
		});
	},
	serialize : function (obj, keys) {
		return obj.reduce(function(a,b) {
			return a+(keys.map(function(key) {
				return '"'+b[key]+'"';
			}).join(',')+'\n');
		}, keys.join(',')+'\n');
	}
};