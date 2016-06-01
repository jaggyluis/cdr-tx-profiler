var app = app || {};

(function() {

	app.init = function() {

		this._view = new this.View();
		this._view.init();
		this._gates = gatelayout;
		this._stash = null;
		
		var flightBuilder = new this.FlightBuilder(designDay);
		var profileBuilder = new this.ProfileBuilder(
			p12.concat(p13)
			.concat(p14)
			.concat(p15));
		profileBuilder.run(undefined, (function() {
			this._view.enableRunButton();
			this._view.buildTables(profileBuilder);

			this._profiles = profileBuilder.getProfiles();
			this._designDay = flightBuilder.getFlights();

		}).bind(this));
	}
	app.run = function() {
		this.clear();

		AVIATION.set(
			this._gates,
			this._designDay,
			this._profiles,
			this._view.getLoadFactor(), 
			this._view.getFlightFilter(), 
			this._view.getTimeFrame());

		this._view.data = AVIATION.get.passengers(this._view.getPassengerFilter());
		this._stash = AVIATION.stash.parse();
		this._view.enableDownloads();
	};
	app.clear = function() {
		this._view.clear();
		AVIATION.clear();
	};

	app.init();

})();
