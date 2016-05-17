var AVIATION = (function (aviation) {

	aviation.flights = [];
	aviation.gates = [];

	aviation.readJSON = readJSON;
	aviation.readCSV = readCSV;

	aviation.serializeJSON = serializeJSON;

	aviation.toStash = toStash;
	aviation.parseStash = parseStash;

	aviation.set = set;
	aviation.clear = clear;

	aviation.getPassengers = getPassengers;
	

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
	function minutesToDecimalDay(minutes) {
		var hours = minutes/60;
		var dday = hours/24;
		return dday;
	};
	function timeToDecimalDay(time) {
		var splitStr = time.split(':');
		var hours = Number(splitStr[0]);
		var minutes = Number(splitStr[1]);
		var seconds = null // not needed in current simulation
		return minutesToDecimalDay(hours*60+minutes);
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
	function getAirportByCode(code) {
		return aviation.airports.filter(function(obj) {
			return obj.IATA == code;
		})[0];
	};
	function getAirlineByCode(code) {
		return aviation.airlines.filter(function(obj) {
			return obj.IATA == code;
		})[0];
	};
	function getAircraftByCode(code) {
		return aviation.aircraft.filter(function(obj) {
			return obj.IATA == code;
		})[0];
	};
	function set(gates, flights, loadFactor, filter, timeFrame) {
		aviation.gates = setGates(gates);
		aviation.flights = setFlights(
			flights, 
			loadFactor, 
			filter, 
			timeFrame);
	}
	function clear() {
		aviation.gates = [];
		aviation.flights = [];	
	};
	function setGates(data) {

		var gates = [];

		data.forEach(function(_gate) {

			var gate = new Gate(_gate[0], _gate[1]);
			gate.setSeats(_gate[2]);
			gate.setArea('waiting', _gate[3]);
			gate.setArea('boarding', _gate[4]);
			gate.setDesignGroup(_gate[5]);
			if (_gate[6] !== null) {
				gate.setDesignGroup(_gate[6], true);
			}
			gates.push(gate);
		});

		return gates;
	};
	function setFlights(data, loadFactor, filter, timeFrame) {

		var flights = [];

		data.forEach(function(_flight) {
			if (decimalDayToTime(_flight.time).split(':')[0] > timeFrame[0] &&
				decimalDayToTime(_flight.time).split(':')[0] < timeFrame[1]) {

				var flight = new Flight(_flight,
						getAirportByCode(_flight.destination),
						getAirlineByCode(_flight.airline),
						getAircraftByCode(_flight.aircraft),
						loadFactor),

					profile = aviation.pax[flight.getCategory()],
					legend = aviation.pax.legend,
					time = aviation.pax.time;

				flight.findGate();

				if (profile !== undefined) {
					flight.setPassengers(profile, legend, time)	
				}
				if (flight.passengers.length === 0) {
					console.error('passengers not assigned: ', 
						flight, 
						flight.getFlightName(), 
						decimalDayToTime(flight.getTime()));
				}
				if (JSON.stringify(flight).match(filter)) {
					flights.push(flight);
				}
			}
		});

		return flights;
	};
	function getPassengers(filter) {
		var passengers = [];
		aviation.flights.forEach(function(flight) {
			flight.getPassengers().forEach(function(passenger) {
				if (JSON.stringify(passenger).match(filter)) {
					passengers.push(passenger);
				}
			});
		});
		return passengers;
	};
	function toStash() {
		return {
			info : {
				totalFlights: aviation.flights.length
			},
			gates : aviation.gates.map(function(g) {
				return g.toStash();
			})
		}
	};
	function parseStash(data) {
		function parse(obj, _tabs) {
			var tabs = _tabs+"\t";
			var str = "";
			if (obj instanceof Array) {
				obj.forEach((function(i) {
					str+="\r\n"+tabs+parse(i, tabs);
				}).bind(this));
			} else if (obj instanceof Object ){
				for (var k in obj) {
					str+= "\r\n"+ tabs + k
					str+= parse(obj[k], tabs);
				}
			} else {
				str+= "\t"+obj;
			}
			return str;
		}
		var parsed = parse(data, "");
		return parsed;
	};
	function readCSV(fileStr) {
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
	function readJSON(fileStr) {
		try {
			return JSON.parse(fileStr);
		} catch (e) {
			return null;
		}
	};
	function serializeJSON(json) {

		var keys = [ 
			'flightName', 
			'flightCode',
			'gate',
			'passengerType',
			'gender',
			'airport',
			'departureLounge',
			'boardingZone',
			'boarding',
			'departureTime'];

		return json.reduce(function(a,b) {
			return a+(keys.map(function(key) {
				return '"'+b[key]+'"';
			}).join(',')+'\n');
		}, keys.join(',')+'\n');
	};


	function Gate(name, isMARS) {
		this.name = name;
		this.isMARS = isMARS;
		this.seats = null;
		this.padding = timeToDecimalDay('00:15:00');
		this.sf = {}
		this.group = {
			mars : null,
			default : null,
		}
		this.flights = {
			[this.name+'a'] : [],
			[this.name+'b'] : []
		};
	};
	Gate.prototype = {
		setArea : function(key, val) {
			this.sf[key] = val;
		},
		getArea : function(key){
			if (key === undefined ) {
				return Object.keys(this.sf).map((function(a) {
					return this.sf[a];
				}).bind(this)).reduce(function(a,b) {
					return a+b;
				})
			} else if (Object.keys(this.sf).includes(key)) {
				return this.sf[key];
			} else {
				return 0;
			}
		},
		setSeats : function(val) {
			this.seats = val;
		},

		getSeats : function(val) {
			return this.seats;
		},
		setDesignGroup : function(group, mars) {
			if (mars && this.isMARS) {
				this.group.mars = group;
			} else {
				this.group.default = group;
			}
		},
		getDesignGroup : function(mars) {
			if (mars && this.isMARS) {
				return this.group.mars;
			} else {
				return this.group.default;
			}
		},
		matchDesignGroup : function (flight, mars) {
			return this.getDesignGroup(mars) >= flight.getDesignGroup();
		},
		setFlight : function (flight, sub) {
			if (sub && sub !== this.name  && this.isMARS) { // blehhhh
				this.flights[sub].push(flight);
			} else {
				for (var key in this.flights) {
					this.flights[key].push(flight);
				}
			}
		},
		getFlights : function(sub) {
			if (sub && this.isMARS) {
				return this.flights[sub];
			} else {
				var uniq= [];
				Object.keys(this.flights).map((function(key) {
					return this.flights[key]
				}).bind(this)).reduce(function(a, b) {
					return a.concat(b);
				}, []).forEach(function(flight) {
					if (!uniq.includes(flight)) {
						uniq.push(flight);
					}
				});
				return uniq;
			}
		},
		fit : function(flight, cb) {
			var data = {
				response : null,
				gate : null
			}
			if (this.matchDesignGroup(flight)) {
				if (this.isMARS && this.matchDesignGroup(flight, this.isMARS)) {
					for (var sub in this.flights) {
						if (this.tap(flight, this.getFlights(sub))) {
							data.response = true;
							data.gate = sub;
							break;
						}
					}
				} else {
					if (this.tap(flight, this.getFlights())) {
						data.response = true;
						data.gate = this.name;
					}
				}
			}
			return cb(data, flight);
		},
		tap : function(flight, fArr) {
			return !fArr.some((function(f) {
				return f.ival.padded(this.padding)
					.intersects(flight.ival.padded(this.padding));
			}).bind(this));
		},
		getMARS : function() {
			var mars = [];
			for (var i=0; i<this.flights[this.name+'a'].length; i++) {
				for (var j=0; j<this.flights[this.name+'b'].length; j++) {
					var fi = this.flights[this.name+'a'][i],
						fj = this.flights[this.name+'b'][j]
					if (fi !== fj) {
						if (fi.ival.intersects(fj.ival)) {
							mars.push([fi.gate+' '+fi.getFlightName()+' '+decimalDayToTime(fi.getTime()),
								fj.gate+' '+fj.getFlightName()+' '+decimalDayToTime(fj.getTime())]);
						}
					}
				}
			}
			return mars;
		},
		getXS : function() {
			var xs = [];
			for (var sub in this.flights) {
				for (var i=0; i<this.flights[sub].length; i++) {
					for (var j=0; j<this.flights[sub].length; j++) {
						if (j !== i) {
							var fi = this.flights[sub][i],
								fj = this.flights[sub][j];
							if (fi.ival.intersects(fj.ival)) {
								mars.push([fi.getFlightName()+' '+decimalDayToTime(fi.getTime()),
									fj.getFlightName()+' '+decimalDayToTime(fj.getTime())]);
							}
						}
					}
				}
			}
			return xs;
		},
		toStash : function() {
			return {
				name : this.name,
				info : {
					isMARS : this.isMARS,
					seats : this.seats,
					sf : this.sf,
					group : this.group,
					mars : this.getMARS(),
					intersections : this.getXS()
				},
				flights : this.getFlights().map(function(f) {
					return f.toStash();
				})
			};	
		}

	}
	function Flight(flight, destination, airline, aircraft, loadFactor) {
		this.flight = flight;
		this.destination = destination;
		this.airline = airline;
		this.aircraft = aircraft;
		this.ival = this.getTurnaroundTime();
		this.loadFactor = loadFactor;
		this.gate = null;
		this.seats = this.flight.seats !== undefined ?
			this.flight.seats*this.loadFactor :
			this.aircraft.seats !== null ?
			this.aircraft.seats*this.loadFactor :
			0;
		this.seats = Math.round(this.seats);
		this.passengers = [];
		if (this.seats === 0) console.warn('seats not available: ', this);
		if (this.aircraft.RFLW == null || this.aircraft.ARC == null){
			console.warn('null reference needed', this.aircraft);
		}

	};	
	Flight.prototype = {
		getTime : function() {
			return this.flight.time;
		},
		getTurnaroundTime : function() {
			
			var tt = 0;
			var t1 = this.aircraft.IATA;
			var t2 = this.airline.IATA;

			if (this.flight.tt !== 0) {
				tt = this.flight.tt;
			} else {
				if (t1 in aviation.tt) {
					if (t2 in aviation.tt[t1]) {
						var length = aviation.tt[t1][t2].length;
						var sum = aviation.tt[t1][t2].reduce(function(a,b) {
							return a+b;
						})
						tt = sum/length;
					} else {
						var length = 0;
						var sum = Object.keys(aviation.tt[t1]).map((function(a){
							return aviation.tt[t1][a];
						}).bind(this)).reduce(function(a,b) {
							return a.concat(b)
						},[]).reduce(function(a,b) {
							length++;
							return a+b;
						});
						tt = sum/length;
					}
				} else {
					console.error('tt not assigned: ', 
						this, 
						this.getFlightName(), 
						decimalDayToTime(this.getTime()));
					tt = 0.125;
				}
			}
			return new Interval(this.getTime()-tt, this.getTime())
		},
		getDesignGroup : function() {
			//console.log(this);
			return romanToNumber(this.aircraft.ARC.split('-')[1]);
		},
		getCategory : function() {
			return this.aircraft.RFLW;
		},
		setGate : function(gate) {
			this.gate = gate;
		},
		getGate : function() {
			return this.gate;
		},
		findGate : function() {
			if (this.ival.getLength() === 0) {
				this.setGate('*');
				return;
			}
			for (var i=0; i<aviation.gates.length; i++) {
				var gate = aviation.gates[i];
				if (aviation.gates[i].fit(this, (function(data, flight) {
					if (data.response) {
						this.setGate(data.gate);
						gate.setFlight(this, data.gate);
						return true;
					} else {
						return false;
					}
				}).bind(this))) {
					return;
				}
			}
			console.error('gate not assigned: ', 
				this, 
				this.getFlightName(), 
				decimalDayToTime(this.getTime()));
		},
		getFlightName : function() {
			return '%airline% to %municipality%, %plane%'
				.replace('%municipality%', this.destination.municipality)
				.replace('%airline%', this.airline.name)
				.replace('%plane%', this.aircraft.manufacturer+' '+this.aircraft.name);
		},
		getArrivalTimes : function(arr) {
			var arrTimes = []
			for (var i=arr[0]; i>=arr[1]; i-=arr[2]) {
				arrTimes.push(minutesToDecimalDay(i));
			}
			return arrTimes;
		},
		getMovementMatrix : function(profile) {
			var matrix = [];
			profile.forEach((function(arr, index) {
				var seats = this.seats;
				var mArray = [];
				arr.forEach((function(num) {
					var count = 0;
					for (var i=0; i< Math.ceil(this.seats*num/100); i++) {
						if (seats >0 ) {
							seats--;
							count++;
						} else break;
					}
					mArray.push(count);
				}).bind(this));
				matrix.push(mArray);
			}).bind(this));
			return matrix;
		},
		getPassengerArray : function() {
			var pArray = [];
			for (var i=0; i<this.seats; i++) {
				pArray.push(new Passenger(this.getFlightName(), 
					this.airline.IATA, 
					decimalDayToTime(this.flight.time),
					this.gate));
			}
			return pArray;
		},
		setPassengers : function(profile, legend, time) {
			if (this.destination && this.airline && this.aircraft) {
				var passengers = this.getPassengerArray();
				var passengerArrivalTimes = this.getArrivalTimes(time);
				this.getMovementMatrix(profile).forEach((function(paxTimes, lindex) {
					var count = 0;
					paxTimes.forEach((function(numPeople, index) {
						for (var i=0; i<numPeople; i++) {
							var interp = decimalDayToTime(this.flight.time -
								passengerArrivalTimes[index] +
								i * minutesToDecimalDay(time[2] / numPeople));

							passengers[count][legend[lindex]] = interp;
							count++;
						}
					}).bind(this));
				}).bind(this));
				this.passengers = passengers;
			} else {
				this.passengers = [];
			}
		},
		getPassengers : function () {
			return this.passengers;
		},
		toStash : function () {
			return {
				name : this.getFlightName(),
				info : {
					gate: this.gate,
					time : decimalDayToTime(this.getTime()),
					loadFactor : this.loadFactor,
					seats : {
						filled : this.seats,
						total : this.flight.seats
					}
				},
				// turn this on for full list
				//
				//passengers : this.passengers.map(function(p) {
				//	return p.toStash();
				//})
				passengers : this.passengers.reduce(function(obj , p) {
						if (Object.keys(obj).includes(p.passengerType)) {
							obj[p.passengerType]++;
						} else {
							obj[p.passengerType] = 1;
						}
						return obj;
					}, {})
			}
		}
	}
	function Passenger(flightName, flightCode, departureTime, gate) {
		var percentages = { // Pull this from spreadsheet? - passed in?
			"Leisure": 30,
			"Assisted": 5,
			"Business": 25,
			"Unique": 20,
			"Family": 20
		}
		var types = [];
		for (var type in percentages) {
			for (var i = 0; i <=percentages[type]; i++) {
				types.push(type);
			}
		}
		this.flightName = flightName;
		this.flightCode = flightCode;
		this.departureTime = departureTime;
		this.passengerType = types[Math.floor(Math.random() * (100 - 0 + 1)) + 0];
		this.gate = gate;
		this.gender = ['M', 'F'][Math.round(Math.random())];
	};
	Passenger.prototype = {
		toStash : function() {
			return {
				info : {
					type : this.passengerType,
					gender : this.gender
				},
				profile : {
					airport : this['airport'],
					lounge : this['departureLounge'],
					boardingZone : this['boardingZone'],
					boarding: this['boarding']
				}
			};
		}
	}
	function Interval(start, end) {
		this.start = start;
		this.end = end;
	};
	Interval.prototype = {
		intersects : function(other) {
			return this.includes(other.start) ||
				this.includes(other.end) ||
				other.includes(this.start) ||
				other.includes(this.end);
		},
		getLength : function() {
			return this.end-this.start;
		},
		contains : function(other) {
			return this.includes(other.start) && this.includes(other.end);
		},
		includes : function(num) {
			return num >= this.start && num <= this.end;
		},
		padded : function(val) {
			return new Interval(this.start-val, this.end+val);
		}
	};

	return aviation;

})(AVIATION || {});
