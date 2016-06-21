var AVIATION = (function (aviation) {


	aviation._flights = [];
	aviation._gates = [];
	aviation._flightProfiles = [];
	aviation._passengerProfiles = [];
	
	aviation.set = set;
	aviation.clear = clear;
	aviation.class = aviation.class || {};
	
	aviation.get = {
		airportByCode : getAirportByCode,
		airportByString : getAirportByString,
		airlineByCode : getAirlineByCode,
		aircraftByCode :  getAircraftByCode,
		profileByAircraftType : getProfileByAircraftType,
		passengers : getPassengers,
		passengersWithinTimeFrame : getPassengersWithinTimeFrame,
		passengersAtTimePadded : getPassengersAtTimePadded,
		flights : getFlights
	};
	aviation.JSON = {
		serialize : serializeJSON,
		parse : parseJSON
	};
	aviation.CSV = {
		parse : parseCSV
	};
	aviation.array = {
		filter : {
			strict : filterStrict,
			loose : filterLoose,
			getBestMatch : getBestMatch,
		},
		mode : mode,
		mapElementsToObjByPercentile : mapElementsToObjByPercentile,
		hasAllMatchingElementsByKeys : hasAllMatchingElementsByKeys,
		mapElementsToObjByKey : mapElementsToObjByKey
	};
	aviation.time = {
		decimalDayToTime : decimalDayToTime,
		decimalDayToMinutes : decimalDayToMinutes,
		minutesToDecimalDay : minutesToDecimalDay,
		secondsToDecimalDay : secondsToDecimalDay,
		timeToDecimalDay : timeToDecimalDay,
		romanToNumber : romanToNumber,
		romanToLetter : romanToLetter,
		apTimeToDecimalDay : apTimeToDecimalDay,
		isapTime : isapTime
	};
	aviation.math = {
		round : round,
		floor : floor,
		getRandomBinaryWithProbablity : getRandomBinaryWithProbablity,
		getRandomArbitrary : getRandomArbitrary
	};
	aviation.generate = {
		guid : generateUUID
	};


	function generateUUID(){
		/*
		 * http://stackoverflow.com/questions/
		 * 105034/create-guid-uuid-in-javascript
		 *
		 */
	    var d = new Date().getTime();

	    if(window.performance && typeof window.performance.now === "function"){
	        d += performance.now(); //use high-precision timer if available
	    }

	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });

	    return uuid;
	};
	function decimalDayToTime(dday) {

		dday = dday>=0 ? dday : 1 + dday;

		var hours = Number((dday*24).toString().split('.')[0]);
		var minutes = Number((dday*24*60 - hours*60).toString().split('.')[0]);
		var seconds = Number((dday*24*60*60 - hours*60*60 - minutes*60).toString().split('.')[0]);

		hours = hours > 0 ? hours.toString() : '00';
		minutes = minutes > 0 ? minutes.toString() : '00';
		seconds = seconds > 0 ? seconds.toString() : '00';
		hours = hours.length > 1 ? hours : "0"+hours;
		minutes = minutes.length > 1 ? minutes: "0"+minutes;
		seconds = seconds.length > 1 ? seconds: "0"+seconds;

		return hours+':'+minutes+':'+seconds;
	};
	function decimalDayToMinutes(dday) {

		dday = dday>=0 ? dday : 1 + dday;

		return Number((dday*24*60).toString().split('.')[0]);
	};
	function timeToDecimalDay(time) {

		var splitStr = time.split(':');
		var hours = Number(splitStr[0]);
		var minutes = Number(splitStr[1]);
		var seconds = null // not needed in current simulation

		return minutesToDecimalDay(hours*60+minutes);
	};
	function minutesToDecimalDay(minutes) {

		var hours = minutes/60;
		var dday = hours/24;

		return dday;
	};
	function secondsToDecimalDay(seconds) {

		return minutesToDecimalDay(seconds / 60);
	};
	function isapTime(str) {

		return ['AM', 'PM']
			.includes(str.toString().split(/ /).reverse()[0]);
	};
	function apTimeToDecimalDay(str) {

		var time = str.split(/[: ]/);
		var hours = time[2] === 'AM' ? time[0] : 
					time[2] === 'PM' ? (Number(time[0]) + 12).toString() :
					time[2];
		var minutes = time[1];

		return timeToDecimalDay(hours+':'+minutes);
	};
	function romanToNumber(str) {

		var dict = {
			"I" : 1,
			"II" : 2,
			"III" : 3,
			"IV" : 4,
			"V" : 5,
			"VI" : 6,
		};

		if (dict[str] !== undefined) {
			return dict[str];
		} else {
			//console.warn('number not in dict: ', str);
			return 3; // for now
		}
	};
	function romanToLetter(str) {

		var dict = {
			"I" : 'A',
			"II" : 'B',
			"III" : 'C',
			"IV" : 'D',
			"V" : 'E',
			"VI" : 'F',
		};

		if (dict[str] !== undefined) {
			return dict[str];
		} else {
			//console.warn('number not in dict: ', str);
			return 'C'; // for now
		}
	};
	function getAirportByCode(code) {
		return aviation._airports.filter(function(obj) {
			return obj.IATA == code;
		})[0];
	};
	function getAirlineByCode(code) {

		return aviation._airlines.filter(function(obj) {

			return obj.IATA == code;
		})[0];
	};
	function getAircraftByCode(code) {

		return aviation._aircraft.filter(function(obj) {

			return obj.IATA == code;
		})[0];
	};
	function getAirportByString(str) {

		var airports = filterStrict(aviation._airports, str);

		if (airports == undefined || airports.length === 0) {
			airports = filterLoose(aviation._airports, str);
			//console.warn('filterLoose:', str)
			//console.warn('\tfound: ', filterBest(airports, str).name);
		}

		return getBestMatch(airports, str);
	};
	function getProfileByAircraftType(type) {

		return aviation._flightProfiles.filter(function(p) {

			return p._name === type;
		})[0];
	};
	function getBestMatch(Arr, str) {

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
	};
	function filterStrict(Arr, str) {

		var spl = str.split(/[^\w\.]/);

		return Arr.filter(function(obj) {

			return spl.every(function(s) {

				return JSON.stringify(obj).match(s);
			});
		});
	};
	function filterLoose(Arr, str) {

		var spl = str.split(/[^\w\.]/);

		return Arr.filter(function(obj) {

			return spl.some(function(s) {

				return JSON.stringify(obj).match(s);
			});
		});
	};
	function mode(Arr) {

		var max = Arr[0];
		var hold = {};

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
	};
	function mapElementsToObjByPercentile(Arr, clean) {

		var len = Arr.length;
		var perc = {};

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
	};
	function mapElementsToObjByKey(Arr, k) {

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
	};
	function hasAllMatchingElementsByKeys(Arr, k, l) {

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
	};
	function round (num, mod) {

		return Math.round(num/mod)*mod;
	};
	function floor (num, mod) {

		return Math.floor(num/mod)*mod;
	};
	function getRandomBinaryWithProbablity(p) {

		return Math.random() >= 1-p ? 1 : 0;
	};
	function getRandomArbitrary(range) {
		
		return Math.random() * (range[1] - range[0]) + range[0];
	};
	function set(gateSchemeObjArr, 
					designDayFlightObjArr, 
					flightProfiles, 
					passengerProfiles, 
					loadFactor, 
					filter, 
					timeFrame) {

		aviation._gates = setGates(gateSchemeObjArr);
		aviation._flightProfiles = flightProfiles;
		aviation._passengerProfiles = passengerProfiles;
		aviation._flights = setFlights(
			designDayFlightObjArr, 
			loadFactor, 
			filter, 
			timeFrame);
	};
	function clear() {

		aviation._gates = [];
		aviation._flights = [];	
	};
	function setGates(gateSchemeObjArr) {

		var gates = [];

		gateSchemeObjArr.forEach(function(gateObj) {

			var gate = aviation.class.Gate(gateObj[0], gateObj[1]);

			gate.setSeats(gateObj[2]);
			gate.setArea('waiting', gateObj[3]);
			gate.setArea('boarding', gateObj[4]);
			gate.setDesignGroup(gateObj[5]);
			if (gateObj[6] !== null) {
				gate.setDesignGroup(gateObj[6], true);
			}
			gates.push(gate);
		});

		return gates;
	};
	function setFlights(designDayFlightObjArr, 
						loadFactor, 
						filter, 
						timeFrame) {

		var flights = [],
			sorted = [],
			filtered = [],
			securityCounters = [10, 10], 
			matrix = aviation.class.Matrix3d();

		designDayFlightObjArr.forEach(function(flightObj, index) {
			if (decimalDayToTime(flightObj.time).split(':')[0] > timeFrame[0] &&
				decimalDayToTime(flightObj.time).split(':')[0] < timeFrame[1]) {

				var flight = aviation.class.Flight(flightObj,
						getAirportByCode(flightObj.destination),
						getAirlineByCode(flightObj.airline),
						getAircraftByCode(flightObj.aircraft),
						loadFactor);

				if (JSON.stringify(flight).match(filter)){
					filtered.push(flight);
				} 
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
			}
		});

		sorted.forEach(function(flight) {

			var pax = aviation.class.Pax(
					getProfileByAircraftType(flight.getCategory()),
					flight);

			flight.findGate();
			matrix = pax.getFlowDistributionMatrix(matrix);				
		});
		matrix.sortRowCols(1, function(pa, pb){
			
			if (pa.attributes.securityTime && !pb.attributes.securityTime) {

				return 1;

			} else if (!pa.attributes.securityTime && pb.attributes.securityTime) {

				return -1;

			} else {

				return 0;
			}
		});
		matrix.insertRowBlank(2);
		matrix.distributeRowByCounter(1, 2, false, function(passenger, matrix, i, c, r, sort) {

			var securityTime = passenger.attributes.securityTime,
				securityLines = passenger.attributes.bags ?
					securityCounters[0] : securityCounters[1];

			if (sort && securityTime === 0) {
				matrix.d[r][c].splice(0,0,matrix.d[r][c].splice(i,1)[0])
			}
			
			return securityTime / securityLines;
		});
		matrix.forEachItem(function(passenger, count, i, c, r) {

			var rounded = aviation.time.minutesToDecimalDay(matrix.m * c);
			
			switch (r) {

				case 2 :

					/*
					var val = (c * matrix.m ) + passenger.attributes.securityTime,
						tt = 0;

					if (passenger.attributes.securityTime !== 0) {
						for (var j=0; j<i; j++) {

							var st = matrix.d[r][c][j].attributes.securityTime;

							if (st !== 0) tt+=st;
						}
					} else {
						passenger.setEvent('concourse', passenger.getEvent('security').value);

						break;
					}
					passenger.setEvent('concourse', 
						aviation.time.minutesToDecimalDay(val + (tt / securityCounters[0])));
					*/

					passenger.setEvent('concourse', rounded);

					break;

				default:

					break;
			};
		})

		//matrix.forEachItem(function(passenger) {
		//	console.log(passenger.getEvent('concourse').value == null)
		//})

		console.log(matrix);

		return filtered;
	};
	function getPassengers(filter) {

		var passengers = [];

		aviation._flights.forEach(function(flight) {
			flight.getPassengers().forEach(function(passenger) {
				if ( filter === undefined || JSON.stringify(passenger.attributes).match(filter)) {
					passengers.push(passenger);
				}
			});
		});

		return passengers;
	};
	function getPassengersWithinTimeFrame(from, to) {

		var passengers = getPassengers(),
			timeFrame = aviation.class.Interval(from, to);

		return passengers.filter(function(passenger) {

			return timeFrame.intersects(passenger.totalTimeInAirport);
		});
	};
	function getPassengersAtTimePadded(time, pad) {

		return getPassengersWithinTimeFrame(time - minutesToDecimalDay(pad),
			time + minutesToDecimalDay(pad));
	};
	function getFlights() {

		return aviation._flights;
	};
	function serializeObj(obj) {

		function serialize(obj, _tabs) {

			var tabs = _tabs+"\t";
			var str = "";

			if (obj instanceof Array) {
				obj.forEach((function(i) {
					str+="\r\n"+tabs+serialize(i, tabs);
				}).bind(this));
			} else if (obj instanceof Object ){
				for (var k in obj) {
					str+= "\r\n"+ tabs + k
					str+= serialize(obj[k], tabs);
				}
			} else {
				str+= "\t"+obj;
			}

			return str;
		}

		var serialized = serialize(obj, "");

		return serialized;
	};
	function serializeJSON(json, keys) {

		return json.reduce(function(a,b) {

			return a+(keys.map(function(key) {

				return '"'+b[key]+'"';

			}).join(',')+'\n');
		}, keys.join(',')+'\n');
	};
	function parseJSON(fileStr) {

		try {

			return JSON.parse(fileStr);

		} catch (e) {

			return null;
		}
	};
	function parseCSV(fileStr) {

		var parsed = fileStr.split('\n');
		var re = /[^\w\:\-]/gi;
		var keys = parsed[0].split(',').map(function(str) {

			return str.replace(re, "");

		});

		return parsed.slice(1).map(function(csvArray) {

			var flight = {};

			csvArray.split(',').map(function(str) {

				return str.replace(re, "");

			}).forEach(function(value, idx) {
				if (!isNaN(Number(value))) {
					flight[keys[idx]] =  Number(value);
				} else if (value.match(':')){
					flight[keys[idx]] = timeToDecimalDay(value);
				} else {
					flight[keys[idx]] = value;
				}
			});

			return flight;
		});
	};

	return aviation;

})(AVIATION || {});
