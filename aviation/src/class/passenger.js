var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Passenger = function(flightName, 
			flightCode, 
			type,
			arrivalTime,
			departureTime, 
			gate, 
			flightID) {
		
		return new Passenger(flightName, 
			flightCode, 
			type,
			arrivalTime,
			departureTime, 
			gate, 
			flightID);
	}

	function Passenger(flightName, flightCode, type, arrivalTime, departureTime, gate, flightID) {
		
		this.flightName = flightName;
		this.flightCode = flightCode;
		this.flightID = flightID;
		
		this.passengerType = type;
		this.gate = gate;
		this.gender = ['M', 'F'][Math.round(Math.random())];

		this._events = [
			{
				name : 'arrivalTime',
				value : null
			},
			{
				name : 'departureLounge',
				value : null
			},
			{
				name : 'boardingZone',
				value : null
			},
			{
				name : 'boarding',
				value : null
			},
			{
				name : 'departureTime',
				value : null
			}
		];

		this.setEvent('arrivalTime', arrivalTime);
		this.setEvent('departureTime', departureTime);
	};
	Passenger.prototype = {

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

			return aviation.class.Interval(this.getEvent('arrivalTime'), 
				this.getEvent('departureTime'));
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