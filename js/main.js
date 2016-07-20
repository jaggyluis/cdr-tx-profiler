var app = app || {};

(function() {

	app.init = function() {

		this._view = new this.View();
		this._view.init();
		this._timeSlice = 1;
	}
	app.compute = function(cb) {

		var self = this,
			worker  = new Worker('js/profile-worker.js');

		worker.addEventListener('message', function(e) {
	
			self._profiles = e.data.profiles;
			self._types = e.data.types;
			self._designDay = e.data.flights;
			self._gates = e.data.gates;

			cb(e.data);

		}, false);

		worker.postMessage({
			"terminalFilter" : self._view.getTerminalFilter(), 
			"timeSlice" : self._timeSlice
		});
	};
	app.run = function(cb) {

		var self = this,
			worker = new Worker('js/timing-worker.js');

		worker.addEventListener('message', function(e) {

			e.data.passengers = e.data.passengers.map(function(p) { return AVIATION.class.Passenger.deserialize(p.data); })
			e.data.flights = e.data.flights.map(function(f) { return AVIATION.class.Flight.deserialize(f.data); })

			console.log(e.data);

			cb(e.data);

		}, false);

		worker.postMessage({
			"designDay" : this._designDay,
			"flightProfiles" : this._profiles,
			"passengerProfiles" : this._types,
			"loadFactor" : this._view.getLoadFactor(),
			"filter" : this._view.getFlightFilter(),
			"timeFrame" : this._view.getTimeFrame(),
			"timeSlice" : this._timeSlice
		});
	};

	app.init();

})();
