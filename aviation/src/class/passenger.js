var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Passenger = function(flightName, 
			flightCode, 
			type, 
			departureTime, 
			gate, 
			flightID) {
		
		return new Passenger(flightName, 
			flightCode, 
			type, 
			departureTime, 
			gate, 
			flightID);
	}

	function Passenger(flightName, flightCode, type, departureTime, gate, flightID) {
		
		this.flightName = flightName;
		this.flightCode = flightCode;
		this.flightID = flightID;
		
		this.passengerType = type;
		this.gate = gate;
		this.gender = ['M', 'F'][Math.round(Math.random())];

	};
	Passenger.prototype = {

		_events : [
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
				name : 'arrivalTime',
				value : departureTime
			}
		],

		get events() {
			return this._events;
		}

		setEvent : function(event, value) {
			this.events
		},
		getTotalTimeInAirport : function() {

			return aviation.class.Interval(this.arrivalTime, this.departureTime);
		},
		getActivityAtTime : function(dday) {

			return 

		},

	}

	return aviation;

})(AVIATION || {});