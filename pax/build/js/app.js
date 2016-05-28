var app = app || {};

(function() {

	app.init = function(profiles) {

		this._view = new this.View();
		this._view.init();
		this._data = null;
		this._gates = gatelayout;
		this._stash = null;
		this._profiles = profiles;
	}
	app.run = function() {
		this.clear();

		AVIATION.set(
			this._gates,
			this._data,
			this._profiles,
			this._view.getLoadFactor(), 
			this._view.getFlightFilter(), 
			this._view.getTimeFrame());

		this._view.data = AVIATION.get.passengers(this._view.getPassengerFilter());
		this._stash = AVIATION.stash.parse();
		this._view.enableDownloads();
	};
	app.set = function(data) {
		this._data = data;
	};
	app.clear = function() {
		this._view.clear();
		AVIATION.clear();
	};

	app.initTypeBuilder(p12.concat(p13).concat(p14).concat(p15));

})();
