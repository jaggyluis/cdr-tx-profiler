aviation.class.Passenger = function(flight, passengerProfile) {
	return new Passenger(flight, passengerProfile);
};
aviation.class.Passenger.deserialize = function (data) {	
	return Object.create(Passenger.prototype, {
		'flight' : {'value' : aviation.class.Flight.deserialize(data.flight.data) },
		'profile' : {'value' : aviation.profiles.PassengerProfile.deserialize(data.profile.data) },
		'_attributes' : { 'value' : data._attributes },
		'_events' : {'value' : data._events }
	});
};
aviation.class.Passenger.null = function () {
	return Object.create(Passenger.prototype, { _attributes : { value : { 'isNull' : true } } });
};
function Passenger (flight, passengerProfile) {
	this.flight = flight;
	this.profile = passengerProfile;
	this._attributes = {
		'passengerType' : this.profile.name,
		'gender': ['M', 'F'][aviation.core.math.getRandomBinaryWithProbablity(this.profile.data.gender / 100)],
		'bags' : [false,true][aviation.core.math.getRandomBinaryWithProbablity(this.profile.data.bags / 100)],
		'isPreCheck' : [false,true][aviation.core.math.getRandomBinaryWithProbablity(0.2)], //verify
		'isTransfer' : this.profile.name.match(/transfer/) ? true : false,
		'isBusiness' : [false,true][aviation.core.math.getRandomBinaryWithProbablity(0.1)], // verify
		'isGateHog' : [false,true][aviation.core.math.getRandomBinaryWithProbablity(0.17)], // verify
		'passengerID' : aviation.core.string.generateUUID(),
		'flightID' : this.flight.id,
		'flightName' : this.flight.getFlightName(),
		'category' : this.flight.getCategory()
	};
	this._events = [
		{ 'name' : 'arrival', 'value' : null },
		{ 'name' : 'security', 'value' : null },
		{ 'name' : 'concourse', 'value' : null },
		{ 'name' : 'gate', 'value' : null },
		{ 'name' : 'boarding', 'value' : null },
		{ 'name' : 'departure', 'value' : null }
	];
}
Passenger.prototype = {};
Passenger.prototype.__defineGetter__('attributes', function () {
	return this._attributes;
});
Passenger.prototype.__defineGetter__('events', function () {
	return this._events;
});
Passenger.prototype.__defineGetter__('delta', function () {
	return {
		'arrival' : aviation.core.time.decimalDayDelta(this.getEvent('arrival').value, this.getEvent('departure').value),
		'checkIn': aviation.core.time.decimalDayDelta(this.getEvent('arrival').value, this.getEvent('security').value),
		'security': aviation.core.time.decimalDayDelta(this.getEvent('security').value, this.getEvent('concourse').value),
	};
});
Passenger.prototype.setAttribute = function (name, value) {
	this._attributes[name] = value;
};
Passenger.prototype.getEvent = function (name) {
	return this.events.find(function(event) { return event.name === name; });
};
Passenger.prototype.setEvent = function (name, value) {
	this.getEvent(name).value = value;
};
Passenger.prototype.getTotalTimeInAirport = function () {
	return aviation.class.Interval(this.getEvent('arrival').value, this.getEvent('departure').value);
};
Passenger.prototype.wrangle = function () {
	var data = {},
		attributes = this.attributes,
		events = this.events,
		deltas = this.delta,
		keys,
		i;
	for (keys=Object.keys(attributes), i=0; i<keys.length; i++) {
		if (typeof attributes[keys[i]] !== 'object') {
			if (typeof attributes[keys[i]] == 'boolean') data[keys[i]] = attributes[keys[i]].toString();
			else data[keys[i]] = attributes[keys[i]];
		}
	}
	for (i=0; i<events.length; i++) {
		data[events[i].name] = events[i].value;
	}
	for (keys=Object.keys(deltas), i=0; i<keys.length; i++) {
		data[['delta',keys[i]].join('.')] = aviation.core.time.decimalDayToMinutes(deltas[keys[i]]);
	}
	return data;
};
Passenger.prototype.serialize = function (cycle) {
	return {
		'class' : 'Passenger',
		'data' : {

			'flight' : this.flight.serialize(false),
			'profile' : this.profile.serialize(),
			'_attributes' : this._attributes,
			'_events' : this._events
		}
	};
};
