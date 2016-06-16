var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Flight = function(flightObj, 
			destination, 
			airline, 
			aircraft, 
			loadFactor) {
		
		return new Flight(flightObj, 
			destination, 
			airline, 
			aircraft, 
			loadFactor);
	}

	function Flight(flightObj, destination, airline, aircraft, loadFactor) {

		this.flight = flightObj;
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
		getDI : function() {
			
			return this.flight.di;
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
						aviation.time.decimalDayToTime(this.getTime()));
				}
			}
			tt = tt === 0 || tt === Infinity ? 0.125 : tt;

			return aviation.class.Interval(this.getTime()-tt, this.getTime())
		},
		getDesignGroup : function() {

			return aviation.time.romanToNumber(this.aircraft.ARC.split('-')[1]);
		},
		getCategory : function() {

			//
			//	Used to return this.aircraft.RFLW
			//
			
			return aviation.time.romanToLetter(this.aircraft.ARC.split('-')[1]);
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
		setPassengers : function(passengers) {

			this.passengers = passengers;
		},
		getPassengers : function () {

			return this.passengers;
		}
	}

	return aviation;

})(AVIATION || {});