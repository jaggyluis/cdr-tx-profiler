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
		this.departureTime = departureTime;
		this.passengerType = type;
		this.gate = gate;
		this.gender = ['M', 'F'][Math.round(Math.random())];
	};
	Passenger.prototype = {
	}

	return aviation;

})(AVIATION || {});