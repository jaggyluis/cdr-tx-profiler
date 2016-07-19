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

		AVIATION.clear();

		var self = this,
			worker = new Worker('js/timing-worker.js');

		worker.addEventListener('message', function(e) {

			cb(e.data);

		}, false);

		worker.postMessage({
			"gates" : this._gates,
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
