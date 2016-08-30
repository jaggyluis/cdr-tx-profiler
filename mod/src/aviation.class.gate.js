aviation.class.Gate = function (gateObj) {
	return new Gate(gateObj);
};
aviation.class.Gate.deserialize = function (data) {	
	return Object.create(Gate.prototype, {
		'name' : {'value' : data.name },
		'num' : { 'value' : data.num },
		'isMARS' : {'value' : data.isMARS },
		'seats' : {'value' : data.seats },
		'padding' : {'value' : data.padding },
		'sf' : {'value' : data.sf },
		'ba' : {'value' : data.ba },
		'group' : {'value' : data.group },
		'flights' : {'value' : null }, // !!!!! TODO
		'carriers' : {'value' : data.carriers }
	});
};
function Gate (gateObj) {
	this.name = gateObj.name;
	this.num = gateObj.num;
	this.isMARS = gateObj.isMARS;
	this.seats = gateObj.seats;
	this.padding = [
		-aviation.core.time.timeToDecimalDay('00:05:00'),
		aviation.core.time.timeToDecimalDay('00:15:00')
		];
	this.sf = {};
	this.ba = gateObj.ba;
	this.group = {
		mars : null,
		default : null,
	};
	this.flights =  this.isMARS
		? gateObj.sub.reduce(function(obj, sub) {
			obj[sub] = [];
			return obj;
		},{}) 
		: [this.name+'a', this.name+'b'].reduce(function(obj, sub) {
			obj[sub] = [];
			return obj;
		},{});
	this.setArea('waiting', gateObj.waiting);
	this.setArea('boarding', gateObj.boarding);
	this.setDesignGroup(gateObj.designGroup);
	if (gateObj.designGroupMARS !== null) this.setDesignGroup(gateObj.designGroupMARS, true);
	this.carriers = gateObj.carrier !== null 
        ? new Set([gateObj.carrier])
        : new Set();
}
Gate.prototype = {};
Gate.prototype.setArea = function (key, val) {
	this.sf[key] = val;
};
Gate.prototype.getArea = function (key){
	if (key === undefined ) { 
		return Object.keys(this.sf)
			.map((function(a) { return this.sf[a];	})
			.bind(this))
			.reduce(function(a,b) {	return a + b; });
	} else if (Object.keys(this.sf).includes(key)) {
		return this.sf[key];
	} else {
		return 0;
	}
},
Gate.prototype.setSeats = function(val) {
	this.seats = val;
};
Gate.prototype.getSeats = function (val) {
	return this.seats;
};
Gate.prototype.setDesignGroup = function (group, mars) {
	if (mars && this.isMARS) this.group.mars = group;
	else this.group.default = group;
},
Gate.prototype.getDesignGroup = function (mars) {
	if (mars && this.isMARS) return this.group.mars;
	else return this.group.default;
};
Gate.prototype.matchDesignGroup = function (flight, mars) {
	return this.getDesignGroup(mars) >= flight.getDesignGroup();
};
Gate.prototype.setFlight = function (flight, sub) {
	if (sub && sub !== this.name  && this.isMARS) {
		this.flights[sub].push(flight);
	} else {
		for (var key in this.flights) this.flights[key].push(flight);
	}
	this.addCarrier(flight.airline);
},
Gate.prototype.getFlights = function (sub) {
	if (sub && this.isMARS) {
		return this.flights[sub];
	} else {
		var uniq= [];
		Object.keys(this.flights)
			.map((function(key) { return this.flights[key]; })
			.bind(this))
			.reduce(function(a, b) { return a.concat(b); }, [])
			.forEach(function(flight) {
				if (!uniq.includes(flight)) uniq.push(flight);
			});
		return uniq;
	}
};
Gate.prototype.getFlightsByCarrier = function (carrier) {
	return this.getFlights().filter(function(flight) { return flight.airline === carrier; });
};
Gate.prototype.fit = function (flight, cb) {
	var data = {'response' : null,	'gate' : null };
	if (this.matchDesignGroup(flight)) {
		if (this.isMARS && this.matchDesignGroup(flight, this.isMARS)) {
			for (var sub in this.flights) {
				if (this.tap(flight, this.getFlights(sub))) {
					data.response = true;
					data.gate = sub;
					data.num = this.num;
					break;
				}
			}
		} else {
			if (this.tap(flight, this.getFlights())) {
				data.response = true;
				data.gate = this.name;
				data.num = this.num;
			}
		}
	}
	return cb(data, flight);
};
Gate.prototype.tap = function (flight, farr) {
	return !farr
		.some((function(f) {
			return f.ival.padded(this.padding[0], this.padding[1])
				.intersects(flight.ival.padded(this.padding[0], this.padding[1]));
		})
		.bind(this));
};
Gate.prototype.addCarrier = function(airline) {
	if (!this.hasCarrier(airline)) this.carriers.add(airline.IATA);
};
Gate.prototype.hasCarrier = function (airline) {
	return this.carriers.has(airline.IATA);
};
Gate.prototype.getCarriers = function () {
	return Array.from(this.carriers);
};
Gate.prototype.serialize = function (cycle) {
	return {
		'class' : 'Gate',
		'data' : {
			'name' : this.name,
			'num' : this.num,
			'isMARS' : this.isMARS,
			'seats' : this.seats,
			'padding' : this.padding,
			'sf' : this.sf,
			'ba' : this.ba,
			'group' : this.group,
			'flights' :  null, // !!!!! TODO
			'carriers' : this.carriers
		}
	};
};
