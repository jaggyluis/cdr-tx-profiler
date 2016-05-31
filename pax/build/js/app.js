var app = app || {};

(function() {

	app.init = function() {

		this._view = new this.View();
		this._view.init();
		this._gates = gatelayout;
		this._stash = null;
		this._profiles = this.initTypeBuilder(
			p12.concat(p13)
			.concat(p14)
			.concat(p15));
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
