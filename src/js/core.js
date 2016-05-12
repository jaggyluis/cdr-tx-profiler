


//--------------------------------------------------------
// utility functions
//--------------------------------------------------------
'use strict';

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
}





//--------------------------------------------------------
// core aviation module
//--------------------------------------------------------

function AviationModel(airports, airlines, aircraft, pax, tt) {
	this.airports = airports; 	// these should probably be jsons - AJAX?
	this.airlines = airlines;	//
	this.aircraft = aircraft;	//
	this.pax = pax;				//
	this.tt = tt
	this.flights = [];
	this.gates = [];
};
AviationModel.prototype = {
	getAirportByCode : function(code) {
		return this.airports.filter(function(obj) {
			return obj.IATA == code;
		})[0];
	},
	getAirlineByCode : function(code) {
		return this.airlines.filter(function(obj) {
			return obj.IATA == code;
		})[0];
	},
	getAircraftByCode : function(code) {
		return this.aircraft.filter(function(obj) {
			return obj.IATA == code;
		})[0];
	},
	setGates : function(data) {
		data.forEach((function(_gate) {
			var gate = new Gate(_gate[0], _gate[1]);
			gate.setSeats(_gate[2]);
			gate.setArea('waiting', _gate[3]);
			gate.setArea('boarding', _gate[4]);
			gate.setDesignGroup(_gate[5]);
			if (_gate[6] !== null) {
				gate.setDesignGroup(_gate[6], true);
			}
			this.gates.push(gate);
		}).bind(this));
	},
	setFlights : function(data, loadFactor, filter, timeFrame) {
		data.forEach((function(_flight) {
			if (decimalDayToTime(_flight.time).split(':')[0] > timeFrame[0] &&
				decimalDayToTime(_flight.time).split(':')[0] < timeFrame[1]) {
				var flight = new Flight(_flight,
					this.getAirportByCode(_flight.destination),
					this.getAirlineByCode(_flight.airline),
					this.getAircraftByCode(_flight.aircraft),
					_flight.tt || this.getTurnaroundTime(_flight),
					loadFactor);
				var profile = this.pax[flight.getCategory()];
				var legend = this.pax.legend;
				var time = this.pax.time;
				this.assignGate(flight);
				if (profile !== undefined) {
					flight.setPassengers(profile, legend, time)	
				}
				if (flight.passengers.length === 0) {
					console.error('passengers not assigned: ', 
						flight, flight.getFlightName(), decimalDayToTime(flight.getTime()));
				}
				if (JSON.stringify(flight).match(filter)) {
					this.flights.push(flight);
				}
			}
		}).bind(this));
	},
	clearAll : function () {
		this.gates = [];
		this.flights = [];	
	},
	assignGate : function(flight) {
		if (flight.tt === 0) {
			flight.setGate('*');
			return;
		}
		for (var i=0; i<this.gates.length; i++) {
			var gate = this.gates[i];
			if (this.gates[i].fit(flight, (function(data, flight) {
				if (data.response) {
					flight.setGate(data.gate);
					gate.setFlight(flight, data.gate);
					return true;
				} else {
					return false;
				}
			}).bind(this))) {
				return;
			}
		}
		console.error('gate not assigned: ', 
			flight, flight.getFlightName(), decimalDayToTime(flight.getTime()));
	},
	getPassengers : function(filter) {
		var passengers = [];
		this.flights.forEach(function(flight) {
			flight.getPassengers().forEach(function(passenger) {
				if (JSON.stringify(passenger).match(filter)) {
					passengers.push(passenger);
				}
			});
		});
		return passengers;
	},
	getTurnaroundTime : function(flight) {
		if (flight.aircraft in this.tt) {
			if (flight.airline in this.tt[flight.aircraft]) { // do average for now
				var length = this.tt[flight.aircraft][flight.airline].length;
				var sum = this.tt[flight.aircraft][flight.airline].reduce(function(a,b) {
					return a+b;
				})
				return sum/length;
			} else {
				var length = 0;
				var sum = Object.keys(this.tt[flight.aircraft]).map((function(a){
					return this.tt[flight.aircraft][a];
				}).bind(this)).reduce(function(a,b) {
					return a.concat(b)
				},[]).reduce(function(a,b) {
					length++;
					return a+b;
				});
				return sum/length;
			}
		} else {
			return 0;
		}
	},
	toStash : function() {
		return {
			info : {
				totalFlights: this.flights.length
			},
			gates : this.gates.map(function(g) {
				return g.toStash();
			})
		}
	}
}


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
						mars.push([fi.getFlightName()+' '+decimalDayToTime(fi.getTime()),
							fj.getFlightName()+' '+decimalDayToTime(fj.getTime())]);
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


function Flight(flight, destination, airline, aircraft, tt, loadFactor) {
	this.flight = flight;
	this.destination = destination;
	this.airline = airline;
	this.aircraft = aircraft;
	this.ival = new Interval(this.getTime()-tt, this.getTime());
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
			passengers : this.passengers.map(function(p) {
				return p.toStash();
			})
		};
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
