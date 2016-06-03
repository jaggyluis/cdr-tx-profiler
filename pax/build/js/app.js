var app = app || {};

(function() {

	app.init = function() {

		this._view = new this.View();
		this._view.init();
		this._gates = gatelayout;
		this._stash = null;
	}
	app.compute = function() {
		var flightBuilder = new this.FlightBuilder(designDay);
		var profileBuilder = new this.ProfileBuilder(
			p12.concat(p13)
			.concat(p14)
			.concat(p15));
		profileBuilder.run(undefined, (function() {

			this._profiles = profileBuilder.getProfiles();
			this._designDay = flightBuilder.getFlights();

			this._view.enableProfileRunButton();
			this._view.clearTables();
			this._view.buildTables(profileBuilder);
			this._view.profiles = this._profiles;

		}).bind(this));
	};
	app.run = function() {
		this.clear();

		AVIATION.set(
			this._gates,
			this._designDay,
			this._profiles,
			this._view.getLoadFactor(), 
			this._view.getFlightFilter(), 
			this._view.getTimeFrame());

		this._view.passengers = AVIATION.get.passengers(this._view.getPassengerFilter());
		this._view.flights = AVIATION.get.flights();
	};
	app.clear = function() {
		this._view.clear();
		AVIATION.clear();
	};

	app.init();

})();
