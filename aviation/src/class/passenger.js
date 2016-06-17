var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Passenger = function(flight, passengerProfile) {
		
		return new Passenger(flight, passengerProfile);
	}

	function Passenger(flight, passengerProfile) {

		this.flight = flight;
		this.profile = passengerProfile;

		this._attributes = {

			'gender' : ['M', 'F'][Math.round(Math.random())],

			'bags' : [false,true][aviation.math.getRandomBinaryWithProbablity(this.profile._data.bags / 100)],

			'isPreCheck' : [false,true][aviation.math.getRandomBinaryWithProbablity(0.2)],

			'isTransfer' : this.profile._name.match(/transfer/) ? true : false,

			'passengerID' : aviation.generate.guid(),

			'passengerType' : this.profile._name,

			'flightID' : this.flight.id,

			'flightName' : this.flight.getFlightName()
		};
		this._events = [
			{
				name : 'arrival',
				value : null
			},
			{
				name : 'security',
				value : null
			},
			{
				name : 'concourse',
				value : null
			},
			{
				name : 'gate',
				value : null
			},
			{
				name : 'boarding',
				value : null
			},
			{
				name : 'departure',
				value : null
			}
		];
	};
	Passenger.prototype = {

		get attributes() {

			return this._attributes;
		},
		setAttribute : function(name, value) {

			this._attributes[name] = value;
		},
		get events() {

			return this._events;
		},
		getEvent : function(name) {

			return this.events.find(function(event) {

				return event.name === name;
			});
		},
		setEvent : function(name, value) {

			this.getEvent(name).value = value;

		},
		getTotalTimeInAirport : function() {

			return aviation.class.Interval(this.getEvent('arrival'), 
				this.getEvent('departure'));
		},
		getActivityAtTime : function(dday) {

			for (var i=0, events=this.events; i<events.length; i++) {
				if (events[i].value < dday && events[i+1].value > dday){

					return events[i].name;
				}
			}
		},

	}

	return aviation;

})(AVIATION || {});