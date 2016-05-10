
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
		console.warn('number not in dict: ', str);
		return 3; // for now
	}
}
	

//--------------------------------------------------------
// core Aviation module classes
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

	setFlights : function(data, loadFactor, filter, timeFrame) {
		data.forEach((function(_flight) {
			if (decimalDayToTime(_flight.time).split(':')[0] > timeFrame[0] &&
				decimalDayToTime(_flight.time).split(':')[0] < timeFrame[1]) {

				var flight = new Flight(_flight,
					this.getAirportByCode(_flight.destination),
					this.getAirlineByCode(_flight.airline),
					this.getAircraftByCode(_flight.aircraft),
					_flight.tt || this.getTurnaroundTime(_flight),
					loadFactor
					);

				this.assignGate(flight);

				// this is currnently assigning all flights and only 
				// displaying filtered flights. It could be swtiched to 
				// calc gate for only filtered flights
				//
				//

				if (JSON.stringify(flight).match(filter)) {
					this.flights.push(flight);
				}
			}
		}).bind(this));
	},

	setGates : function(gates) {
		gates.forEach((function(gArr) {

			var gate = new Gate(gArr[0], gArr[1]);
			gate.setSeats(gArr[2]);
			gate.setArea('waiting', gArr[3]);
			gate.setArea('boarding', gArr[4]);
			gate.setGroup(gArr[5]);
			if (gArr[6] !== null) {
				gate.setGroup(gArr[6], true);
			}
			this.gates.push(gate);
		}).bind(this));
	},

	clearAll : function () {
		this.flights = [];
		this.gates = [];
	},

	assignGate : function(flight) {
		if (flight.tt === 0) {
			flight.setGate('__');
			return;
		}
		for (var i=0; i<this.gates.length; i++) {
			var gate = this.gates[i];
			if (gate.canFit(flight)) {
				gate.addFlight(flight);
				flight.setGate(gate.name);
				return;
			}
		}
		console.warn('gate not assigned: ', 
			flight, flight.getFlightName(), decimalDayToTime(flight.tt));
	},

	getPassengers : function() {
		var passengers = [];
		this.flights.forEach((function(flight) {
			var profile = this.pax[flight.getCategory()];
			var legend = this.pax.legend;
			var time = this.pax.time;
			if (profile !== undefined) {
				flight.getPassengers(profile, legend, time).forEach(function(passenger) {
					passengers.push(passenger);
				});
			}
		}).bind(this));
		return passengers;
	},

	getTurnaroundTime : function(flight) { // this should be in a flight... not here
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
	}
}


function Gate(name, isMARS) {
	this.name = name;
	this.isMARS = isMARS;
	this.seats = null;
	this.sf = {}
	this.group = {
		mars : null,
		default : null,
	}
	this.flights = [];
	//this.shared = true // - maybe implement later
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

	setGroup : function(group, mars, restricted) {
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

	addFlight : function (flight) {
		this.flights.push(flight);
	},

	canFit : function (flight) {
		if (this.getDesignGroup() >= flight.getDesignGroup()) {
			// this does not double up yet
			for (var i=0; i<this.flights.length; i++) {
				var ival1 = new Interval(flight.getTime()-flight.tt, flight.getTime()),
					ival2 = new Interval(this.flights[i].getTime()-this.flights[i].tt, this.flights[i].getTime())
				if (ival1.intersects(ival2)) {
					return false;
				};
			}
			return true;
		} else {
			return false;
		}
	}
}



function Flight(flight, destination, airline, aircraft, tt, profile, loadFactor) {
	this.flight = flight;
	this.destination = destination;
	this.airline = airline;
	this.aircraft = aircraft;
	this.tt = tt;
	this.loadFactor = loadFactor;
	this.seats = this.flight.seats !== undefined ?
		this.flight.seats*this.loadFactor :
		this.aircraft.seats !== null ?
		this.aircraft.seats*this.loadFactor :
		0;
	this.aircraft.seats = 100;
	this.gate = null;

	if (this.seats === 0) console.warn('seats not available: ', this);

};	
Flight.prototype = {

	getTime : function() {
		return this.flight.time;
	},

	getDesignGroup : function() {
		console.log(this);
		return romanToNumber(this.aircraft.ARC.split('-')[1]);
	},

	getCategory : function() {
		return this.aircraft.ARC.split('-')[0];
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
			var seats = this.aircraft.seats;
			var mArray = [];
			arr.forEach((function(num) {
				var count = 0;
				for (var i=0; i< Math.ceil(this.aircraft.seats*num/100); i++) {
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
		for (var i=0; i<this.aircraft.seats; i++) {
			pArray.push(new Passenger(this.getFlightName(), 
				this.airline.IATA, 
				decimalDayToTime(this.flight.time),
				this.gate));
		}
		return pArray;
	},

	getPassengers : function(profile, legend, time) {
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
			return passengers;
		}
		return [];
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


function Interval(start, end) {
	this.start = start;
	this.end = end;
};
Interval.prototype = {
	
	intersects : function(other) {
		return ((this.start <= other.start && this.end >= other.end) || 
			(this.start <= other.start && this.end <= other.end) || 
			(this.start >= other.start && this.end >= other.end) ||
			(this.start >= other.start && this.end <= other.end)) &&
		 	(this.start <= other.end && this.end >= other.start);
	},

	includes : function (num) {
		return;
	}
};
