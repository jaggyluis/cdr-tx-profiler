aviation.profiles.Profiler = function(passengerData, flightData, attributeData, timeSlice, func) {
	return new Profiler(passengerData, flightData, attributeData, timeSlice, func);
};
function Profiler(passengerData, flightData, attributeData, timeSlice, func) {
	this.passengers = passengerData;
	this.attributes = attributeData;
	this.flights = flightData;
	this.timeSlice = timeSlice;
	if (func !== undefined) this.func = func;
	this._cluster;
}
Profiler.prototype = {};
Profiler.prototype.__defineGetter__('passengerProfiles', function () {
	var self = this,
		profiles = [],
		pax,
		len;
	for (var key in self._cluster.passengerTypes) {
		pax = self._cluster.passengerTypes[key];
		len = self.passengers.length;
		profiles.push(aviation.profiles.PassengerProfile(key, self.percentile(pax, len, true)));
	}
	return profiles;
});
Profiler.prototype.__defineGetter__('flightProfiles', function () {
	var self = this,
		profiles  = [],
		pax,
		diDist,
		di,
		amDist,
		len,
		name;
	for (var k in self._cluster.flightTypes) {
		pax = self._cluster.flightTypes[k];
		diDist = aviation.core.array.mapElementsToObjByKey(pax, 'di');
		Object.keys(diDist).forEach(function(d) {
			di = diDist[d];
			amDist = aviation.core.array.mapElementsToObjByKey(di, 'am');
			Object.keys(amDist).forEach(function(a) {
				len = amDist[a].length;
				name = [k,d,a].join('.');
				amDist[a] = aviation.core.array.mapElementsToObjByKey(amDist[a], 'passengerType');
				for (var type in amDist[a]) {
					amDist[a][type] = {
						'count' : amDist[a][type].length,
						'percentage' : Math.round((amDist[a][type].length / len) * 100)
					};
				}
			});
			diDist[d] = amDist;
		});
		profiles.push(aviation.profiles.FlightProfile(k, diDist));
	}
	return profiles;
});
Profiler.prototype.buildProfiles = function() {
 	this._cluster = this.clusterPassengersByAttribute(this.passengers, this.attributes);
	this._cluster.flightTypes = this.matchFlights(this._cluster.flightTypes, this.flights);
};
Profiler.prototype.clusterPassengersByAttribute = function (passengers, attributes) {
	var typeCluster = {},
		typeAttibutes = attributes,
		flightCluster = {},
		flightAttributes = ['airline', 'destination'],
		type,
		flight,
		i,
		j;
	for (i=0; i<passengers.length; i++) {
		type = [],
		flight = [];
		for (j=0; j<typeAttibutes.length; j++) type.push(passengers[i][typeAttibutes[j]]);
		type = type.join('.');
		if (!(type in typeCluster)) typeCluster[type] = [];
		typeCluster[type].push(passengers[i]);
		for (var k=0; k<flightAttributes.length; k++) flight.push(passengers[i][flightAttributes[k]]);
		flight = flight.join('.');
		if (!(flight in flightCluster)) flightCluster[flight] = [];
		flightCluster[flight].push(passengers[i]);
		passengers[i].flightType = flight;
		passengers[i].passengerType = type;
	}
	return {
		'passengerTypes' : typeCluster,
		'flightTypes' : flightCluster
	};
};
Profiler.prototype.matchFlights = function (flightTypes, flights) {
	var typeCluster = {};
	Object.keys(flightTypes).forEach(function(flight) {
		var params = flight.split('.'),
			airline = aviation.get.airlineByCode(params[0]),
			destination = aviation.get.airportByString(params[1]),
			type,
			i,
			j;
		if (airline && destination) {
			for (i=0; i<flights.length; i++) {
				if (flights[i].airline == airline.IATA && flights[i].destination == destination.IATA) {
					aircraft = aviation.get.aircraftByCode(flights[i].aircraft),
					type = aircraft ? aviation.core.time.romanToLetter(aircraft.ARC.split('-')[1]) : undefined; 
					if (aircraft === undefined) break;
					if (!(type in typeCluster)) typeCluster[type] = [];
					typeCluster[type] = typeCluster[type].concat(flightTypes[flight]);
					for (j=0; j<flightTypes[flight].length; j++) flightTypes[flight][j].flightType = type;
					break;
				}
			}
		}
	});
	return typeCluster;
};
Profiler.prototype.percentile = function (passengers, total, weighted) {
	var self = this,
		count = 0,
		weightedCount = 0,
		deltas = [],
		percentiles = {},
		arrival,
		departure,
		delta,
		i,
		j;
	weighted = weighted || false;
	for (i=0; i<passengers.length; i++) {
		arrival = passengers[i].arrival;
		departure = passengers[i].departure;
		delta = aviation.core.math.round(aviation.core.time.decimalDayToMinutes(departure - arrival), self.timeSlice);
		for (var key in passengers[i]) {
			if (!(key in percentiles)) percentiles[key] = 0;
			if (passengers[i][key]) percentiles[key] += weighted ? passengers[i].weight : 1;
		}
		if (weighted) {
			weightedCount += passengers[i].weight;
			for (j=0; j<Math.round(passengers[i].weight); j++) deltas.push(delta);			
		} else {
			weightedCount += 1;
			deltas.push(delta);
		}
		count++;
	}
	return Object.keys(percentiles).reduce(function(obj, attribute) {
		if ('br'+attribute.toString() in percentiles) {
			if (self.func !== undefined) {
				obj['br'+attribute.toString()] = Math.round(self.func(percentiles[attribute] / weightedCount) * 100);
			}
		}
		if (attribute.match(/br/) === null) {
			obj[attribute] = Math.round((percentiles[attribute] / weightedCount) * 100);
		}
		return obj;
	}, {
		'count' : count,
		'weighted' : weighted,
		'percentage' : Math.round(count / total * 100),
		'arrivalDistribution' : aviation.core.array.mapElementsToObjByPercentile(deltas, true)
	});
},
Profiler.prototype.permute = function (attributes) {
	var permuted = [[]],
		curr = [],
		i,
		j,
		k;
	for (i=0; i<nestedArray.length; i++) {
		for (j=0; j<nestedArray[i].length; j++) {
			for (k=0; k<permuted.length; k++) {
				curr.push(permuted[k].slice().concat([nestedArray[i][j]]));
			}
		}
		permuted = curr;
		curr = [];
	}
	return permuted;
};