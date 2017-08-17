aviation.profiles.Profiler = function(passengerData, flightData, attributeData, timeSlice, func) {
	return new Profiler(passengerData, flightData, attributeData, timeSlice, func);
};

function Profiler(passengerData, flightData, attributeData, timeSlice) {

	this.passengers = passengerData;
	this.attributes = attributeData;
	this.flights = flightData;
	this.timeSlice = timeSlice;

	this._cluster;
}

Profiler.prototype = {};

Profiler.prototype.__defineGetter__('passengerProfiles', function () {

    var self = this,
        profile,
		profiles = [],
		pax;

	for (var key in self._cluster.passengerClusters) {

	    var classified = false;

	    pax = self._cluster.passengerClusters[key];
	    profile = aviation.profiles.PassengerProfile(key, self.formatPassengerProfileData(pax, true));

	    if (profile.data.count.value > 0 && profile.data.percentage.value > 0) {
	        classified = true;
	    }

	    for (var i = 0; i < self.attributes.length; i++) {
	        if (!(self.attributes[i] in profile.data)) {
	            classified = false;
	            break;
	        }
	    }

	    console.log(key, classified);

	    if (classified) {
	        profiles.push(profile);
	    }
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

    for (var k in self._cluster.flightClusters) {

        pax = self._cluster.flightClusters[k];
		diDist = aviation.core.array.mapElementsToObjByKey(pax, 'di');

		Object.keys(diDist).forEach(function (d) {

			di = diDist[d];
			amDist = aviation.core.array.mapElementsToObjByKey(di, 'am');

			Object.keys(amDist).forEach(function (a) {

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
 	this._cluster.flightClusters = this.matchFlights(this._cluster.flightClusters, this.flights);
};

Profiler.prototype.clusterPassengersByAttribute = function (passengers, attributes) {

    var passengerClusters = {},
		passengerAttributes = attributes,
		flightClusters = {},
		flightAttributes = ['airline', 'destination'],
		type,
		flight,
		i,
		j;

	for (i=0; i<passengers.length; i++) {

	    type = [],
		flight = [];

	    for (j = 0; j < passengerAttributes.length; j++) type.push(passengers[i][passengerAttributes[j]]);

	    type = type.join('.');

	    if (!(type in passengerClusters)) passengerClusters[type] = [];

	    passengerClusters[type].push(passengers[i]);

	    for (var k = 0; k < flightAttributes.length; k++) flight.push(passengers[i][flightAttributes[k]]);

	    flight = flight.join('.');

	    if (!(flight in flightClusters)) flightClusters[flight] = [];

	    flightClusters[flight].push(passengers[i]);
		passengers[i].flightType = flight;
		passengers[i].passengerType = type;
	}

	return {
	    'passengerClusters': passengerClusters,
		'flightClusters': flightClusters
	};
};

Profiler.prototype.matchFlights = function (flightTypes, flights) {

    var typeCluster = {};

    Object.keys(flightTypes).forEach(function (flight) {

		var params = flight.split('.'),
			airline = aviation.get.airlineByCode(params[0]),
			destination = aviation.get.airportByString(params[1]),
			type,
			i,
			j;

		if (airline && destination) {

		    for (i = 0; i < flights.length; i++) {

		        if (flights[i].airline == airline.IATA && flights[i].destination == destination.IATA) {

					aircraft = aviation.get.aircraftByCode(flights[i].aircraft),
					type = aircraft ? aviation.core.time.romanToLetter(aircraft.ARC.split('-')[1]) : undefined; 

					if (aircraft === undefined) break;
					if (!(type in typeCluster)) typeCluster[type] = [];

					typeCluster[type] = typeCluster[type].concat(flightTypes[flight]);

					for (j = 0; j < flightTypes[flight].length; j++) flightTypes[flight][j].flightType = type;

					break;
				}
			}
		}
	});
	return typeCluster;
};

Profiler.prototype.formatPassengerProfileData = function (passengers, weighted) {

    var self = this,
		weightedCount = 0,
        weight,
		attributes = {},
        types = {},
        formatted = {},
		arrival,
		departure,
        deltas = [],
		delta,
		i,
		j;

    weighted = weighted || false;

    for (i = 0; i < passengers.length; i++) {

        arrival = passengers[i].arrival;
        departure = passengers[i].departure;
        delta = aviation.core.math.round(aviation.core.time.decimalDayToMinutes(departure - arrival), self.timeSlice);
        weight = weighted ? passengers[i].weight * 100 : 100;
        weightedCount += weight;

        for (j = 0; j < weight ; j++) deltas.push(delta);

        for (var key in passengers[i]) {

            if (passengers[i][key] !== null) {
                attributes[key] = null;
                types[key] = typeof passengers[i][key];
            }
        }
    }
    Object.keys(attributes).forEach(function (attribute) {

        var hasAttributeCount = 0,
            hasAttributeCountBooleanTrue = 0,
            typeDistribution = {},
            k;

        if (types[attribute] == 'boolean') {

            for (k = 0; k < passengers.length; k++) {

                if (passengers[k][attribute] !== undefined && passengers[k][attribute] !== null) {

                    weight = weighted ? passengers[k].weight * 100 : 100;
                    hasAttributeCount += weight;            

                    if (passengers[k][attribute] === true) {
                        hasAttributeCountBooleanTrue += weight;
                    }
                }
            }

            var value = hasAttributeCountBooleanTrue === 0 
                ? 0
                : Math.round((hasAttributeCountBooleanTrue / hasAttributeCount) * 100);

            formatted[attribute] = {
                'value': value,
                'valueType': 'percentage',
                'attributeType' : types[attribute]
            };

        } else if (types[attribute] == 'string' || types[attribute] == 'number') {

            for (k = 0; k < passengers.length; k++) {

                if (passengers[k][attribute] !== undefined && passengers[k][attribute] !== null) {

                    weight = weighted ? passengers[k].weight * 100 : 100;
                    hasAttributeCount += weight;

                    if (!(passengers[k][attribute] in typeDistribution)) typeDistribution[passengers[k][attribute]] = 0;
                    typeDistribution[passengers[k][attribute]] += weight;
                }
            }

            if (Object.keys(typeDistribution).length == 1) {

                formatted[attribute] = {
                    'value': Object.keys(typeDistribution)[0],
                    'valueType': types[attribute],
                    'attributeType': types[attribute]
                };
            }
            else {
                
                Object.keys(typeDistribution).forEach(function (key) {
                    typeDistribution[key] /= hasAttributeCount / 100;
                });

                formatted[attribute] = {
                    'value': typeDistribution,
                    'valueType': 'distribution',
                    'attributeType' : types[attribute]
                };
            }

        } else if (types[attribute] == 'object') {

            console.log(attribute, types[attribute]);

        } else {

            console.log(attribute, types[attribute]);
        }
    });

    //
    // Non optional attributes
    //

    formatted.count = {
        'value': Math.round(weightedCount / 100),
        'valueType': 'number',
        'attributeType' : 'number'
    };

    formatted.weighed = {
        'value': weighted,
        'valueType': 'boolean',
        'attributeType' : 'boolean'
    };

    formatted.percentage = {
        'value': Math.round(passengers.length / self.passengers.length * 100),
        'valueType': 'percentage',
        'attributeType' : 'number'
    };

    formatted.arrivalDistribution = {
        'value': aviation.core.array.mapElementsToObjByPercentile(deltas, true),
        'valueType': 'distribution',
        'attributeType' : 'number'
    };

    return formatted;
};