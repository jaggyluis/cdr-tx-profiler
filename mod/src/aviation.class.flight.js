aviation.class.Flight = function (flightObj, destination, airline, aircraft, loadFactor) {
	return new Flight(flightObj, destination, airline, aircraft, loadFactor);
};
aviation.class.Flight.deserialize = function (data) {
	return Object.create(Flight.prototype, {
		'flight' : {'value' : data.flight },
		'destination' : {'value' : data.destination },
		'airline' : {'value' : data.airline },
		'aircraft' : {'value' : data.aircraft },
		'loadFactor' : {'value' : data.loadFactor },
		'id' : {'value' : data.id },
		'gate' : {'value' : data.gate },
		'ival' : {'value' : aviation.class.Interval.deserialize(data.ival.data) },
		'seats' : {'value' : data.seats },
		'passengers' : {'value' : data.passengers.map(function(p) { return aviation.class.Passenger.deserialize(p.data);}) },
		'passengerCount' : { 'value' : data.passengerCount}
	});
};
function Flight (flightObj, destination, airline, aircraft, loadFactor) {
	this.flight = flightObj;
	this.destination = destination;
	this.airline = airline;
	this.aircraft = aircraft;
	this.loadFactor = loadFactor;
	this.id = aviation.core.string.generateUUID();
	this.gate = null;
	this.ival = null;
	this.seats = this.flight.seats !== undefined
		? this.flight.seats*this.loadFactor
		: this.aircraft.seats !== null
			? this.aircraft.seats*this.loadFactor
			: 0;
	this.seats = Math.round(this.seats);
	this.passengers = [];
	this.passengerCount = 0;
	if (this.seats === 0) console.warn('seats not available: ', this);
	if (this.aircraft.RFLW === null || this.aircraft.ARC === null){
		console.error('category not assigned: ', 
			this.aircraft);
	}
}
Flight.prototype = {};
Flight.prototype.getTime = function () {
	return this.flight.time;
};
Flight.prototype.getDI = function () {
	return this.flight.di;
};
Flight.prototype.getBA = function (){
	return this.flight.ba;
};
Flight.prototype.setTurnaroundTime = function (turnaroundTimes) {
	var tt = 0,
		t1 = this.aircraft.IATA,
		t2 = this.airline.IATA,
		length,
		sum;
	if (this.flight.tt !== null) tt = this.flight.tt;
	else {
		if (t1 in turnaroundTimes) {
			if (t2 in turnaroundTimes[t1]) {
				length = turnaroundTimes[t1][t2].length;
				sum = turnaroundTimes[t1][t2].reduce(function(a,b) { return a+b; });
				tt = sum/length;
			} else {
				length = 0;
				sum = Object.keys(turnaroundTimes[t1]).map((function(a){ return turnaroundTimes[t1][a];	})
					.bind(this))
					.reduce(function(a,b) { return a.concat(b); }, [])
					.reduce(function(a,b) { length++; return a+b; });
				tt = sum/length;
			}
		} else {
			console.error('tt not assigned: ', 
				this, 
				this.getFlightName(), 
				aviation.core.time.decimalDayToTime(this.getTime()));
		}
	}
	tt = tt === 0 || tt === Infinity ? 0.125 : tt;
	this.ival = aviation.class.Interval(this.getTime()-tt, this.getTime());
},
Flight.prototype.getDesignGroup = function () {
	return aviation.core.time.romanToNumber(this.aircraft.ARC.split('-')[1]);
};
Flight.prototype.getCategory = function () {
	return aviation.core.time.romanToLetter(this.aircraft.ARC.split('-')[1]);
};
Flight.prototype.setGate = function (gate) {
	this.gate = gate;
};
Flight.prototype.getGate = function () {
	return this.gate;
};
Flight.prototype.findGate = function (gates, cluster) {
	var self = this,
		hasCarrier = [],
		notHasCarrier = [],
		drift = [],
		sorted = [],
		min,
		dist,
		count,
		gate,
		i,
		j,
		k;
	if (self.ival.getLength() === 0) {
		self.setGate('*');
		console.error('invalid ival: ', 
			self, 
			self.getFlightName(), 
			aviation.core.time.decimalDayToTime(self.getTime()));
		return;
	}
	gates = gates.filter(function(g) { return g.ba === self.getBA(); });
	if (cluster === true) {	
		for (i=0; i<gates.length; i++) {
			if (gates[i].hasCarrier(self.airline)) hasCarrier.push(gates[i]);
			else notHasCarrier.push(gates[i]);
		}
		for (i=0; i<notHasCarrier.length; i++) {
            count = notHasCarrier[i].getCarriers().length;
			min = Infinity;
			if (hasCarrier.length !== 0) {
				for (j=0; j<hasCarrier.length; j++) {
					dist = Math.abs(hasCarrier[j].num - notHasCarrier[i].num);
					if (dist < min) min = dist;
				}
				for (k=0; k<drift.length; k++) {
					if (min < drift[k]) {
						break;
					}
				}
			} else {
                dist = 0;
				for (j=0; j<notHasCarrier.length; j++) {
					dist += Math.abs(notHasCarrier[j].num - notHasCarrier[i].num);	
				}
                if (!count) min = dist;
				for (k=0; k<drift.length; k++) {
					if (min < drift[k]) {
						break;
					}
				}					
			}
			sorted.splice(k,0, notHasCarrier[i]);
			drift.splice(k,0, min);
		}
		hasCarrier.sort(function(ga,gb) {
			return gb.getFlightsByCarrier(self.airline).length - ga.getFlightsByCarrier(self.airline).length;
		});
		gates = hasCarrier.concat(sorted);
	}
	for (i=0; i<gates.length; i++) {
		gate = gates[i];
		if (gate.fit(self, function(data, flight) {
			if (data.response) {
				self.setGate(data.gate);
				gate.setFlight(self, data.gate);
				return true;
			} else {
				return false;
			}
		})) { return; }
	}
	console.error('gate not assigned: ', 
		self, 
		self.getFlightName(), 
		aviation.core.time.decimalDayToTime(self.getTime()));
};
Flight.prototype.getFlightName = function () {
	return '%airline% to %municipality%, %plane%'
		.replace('%municipality%', this.destination.municipality)
		.replace('%airline%', this.airline.name)
		.replace('%plane%', this.aircraft.manufacturer+' '+this.aircraft.name);
};
Flight.prototype.setPassengers = function (passengers) {
	this.passengers = passengers;
	this.passengerCount = passengers.length;
};
Flight.prototype.getPassengers = function () {
	return this.passengers;
};
Flight.prototype.wrangle = function () {
	return {
		'name' : this.getFlightName(),
		'code' : this.airline.IATA,
		'gate' : this.gate,
		'flightID' : this.id,
		'loadFactor' : this.loadFactor,
		'seats' : this.flight.seats,
		'count' : this.passengerCount,
		'arrival' : this.getTime() - this.ival.getLength(),
		'departure' : this.getTime(),
		'delta.arrival' : this.ival.getLength()
	};
};
Flight.prototype.serialize = function (cycle) {
	return {
		'class' : 'Flight',
		'data' : {
			'flight' : this.flight,
			'destination' : this.destination,
			'airline' : this.airline,
			'aircraft' : this.aircraft,
			'loadFactor' : this.loadFactor,
			'id' : this.id,
			'gate' : this.gate,
			'ival' : this.ival.serialize(),
			'seats' : this.seats,
			'passengers' : cycle ? this.passengers.map(function(p) { return p.serialize(); }) : [],
			'passengerCount' : this.passengerCount
		}
	};
};

	