aviation.core.string = {
	generateUUID : function () {
		//	http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	    var d = new Date().getTime(),
	    	uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        	var r = (d + Math.random()*16)%16 | 0;
	        	d = Math.floor(d/16);
	        	return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    	});
	    return uuid;
	},
	serializeObj : function (obj) {
		function serialize(obj, _tabs) {
			var tabs = _tabs+"\t",
				str = "";
			if (obj instanceof array) {
				obj.forEach((function(i) {
					str+="\r\n"+tabs+serialize(i, tabs);
				}).bind(this));
			} else if (obj instanceof Object ){
				for (var k in obj) {
					str+= "\r\n"+ tabs + k;
					str+= serialize(obj[k], tabs);
				}
			} else {
				str+= "\t"+obj;
			}
			return str;
		}
		return sserialize(obj, "");
	},
	serializeJSON : function (json, keys) {
		return json.reduce(function(a,b) {
			return a+(keys.map(function(key) {
				return '"'+b[key]+'"';
			}).join(',')+'\n');
		}, keys.join(',')+'\n');
	},
	parseJSON : function (fileStr) {
		try { return JSON.parse(fileStr); }
		catch (e) { return null; }
	},
	parseCSV : function (fileStr) {
		var parsed = fileStr.split('\n'),
			re = /[^\w\:\-]/gi,
			keys = parsed[0].split(',').map(function(str) {
				return str.replace(re, "");
			});
		return parsed.slice(1).map(function(csvarray) {
			var flight = {};
			csvarray.split(',').map(function(str) {	return str.replace(re, "");	})
				.forEach(function(value, idx) {
				if (!isNaN(Number(value))) flight[keys[idx]] =  Number(value);
				else if (value.match(':')) flight[keys[idx]] = timeToDecimalDay(value);
				else flight[keys[idx]] = value;
			});
			return flight;
		});
	}
};