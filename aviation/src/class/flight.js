var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Flight = function(flight, 
			destination, 
			airline, 
			aircraft, 
			loadFactor) {
		
		return new Flight(flight, 
			destination, 
			airline, 
			aircraft, 
			loadFactor);
	}

	function Flight(flight, destination, airline, aircraft, loadFactor) {
		this.flight = flight;
		this.destination = destination;
		this.airline = airline;
		this.aircraft = aircraft;
		this.ival = this.getTurnaroundTime();
		this.loadFactor = loadFactor;
		this.id = aviation.generate.guid();
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
				if (t1 in aviation._tt) {
					if (t2 in aviation._tt[t1]) {
						var length = aviation._tt[t1][t2].length;
						var sum = aviation._tt[t1][t2].reduce(function(a,b) {
							return a+b;
						})
						tt = sum/length;
					} else {
						var length = 0;
						var sum = Object.keys(aviation._tt[t1]).map((function(a){
							return aviation._tt[t1][a];
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
			return aviation.class.Interval(this.getTime()-tt, this.getTime())
		},
		getDesignGroup : function() {
			//console.log(this);
			return aviation.time.romanToNumber(this.aircraft.ARC.split('-')[1]);
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
			for (var i=0; i<aviation._gates.length; i++) {
				var gate = aviation._gates[i];
				if (aviation._gates[i].fit(this, (function(data, flight) {
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
				aviation.time.decimalDayToTime(this.getTime()));
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
				arrTimes.push(aviation.time.minutesToDecimalDay(i));
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
			var pArray = [],
				profile = aviation.get.profileByAircraftType(this.aircraft.RFLW),
				percs = profile._getPerc()[this.flight.di],
				dArray = profile._getPercArray(percs);

			for (var i=0; i<this.seats; i++) {
				pArray.push(aviation.class.Passenger(this.getFlightName(), 
					this.airline.IATA,
					dArray[Math.floor(Math.random()*(dArray.length-1-0+1)+0)],
					aviation.time.decimalDayToTime(this.flight.time),
					this.gate,
					this.id));
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
							var interp = aviation.time.decimalDayToTime(this.flight.time -
								passengerArrivalTimes[index] +
								i * aviation.time.minutesToDecimalDay(time[2] / numPeople));

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
		parseStash : function () {
			return {
				name : this.getFlightName(),
				info : {
					gate: this.gate,
					time : aviation.time.decimalDayToTime(this.getTime()),
					loadFactor : this.loadFactor,
					seats : {
						filled : this.seats,
						total : this.flight.seats
					}
				},
				// turn this on for full list
				//
				//passengers : this.passengers.map(function(p) {
				//	return p.parseStash();
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

	return aviation;

})(AVIATION || {});