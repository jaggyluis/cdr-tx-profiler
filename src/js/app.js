var app = app || {};


(function() {
	'use strict';

	//--------------------------------------------------------
	// main app
	//--------------------------------------------------------

	app.init = function() {
		this._model = new AviationModel(airports, 
			airlines, 
			aircraft.concat(aircraftBis), 
			pax, 
			tt);
		this._view = new View();
		this._view.init();
		this._data = null;
		this._gates = gates;
	}
	app.run = function() {
		this.clear();

		this._model.setGates(this._gates);
		this._model.setFlights(this._data, 
			this._view.getLoadFactor(), 
			this._view.getFilter(), 
			this._view.getTimeFrame());
		
		this._view.data = this._model.getPassengers();
		this._view.enableDownloads();
	}
	app.set = function(data) {
		this._data = data;
	}

	app.clear = function() {
		this._view.clearAll();
		this._model.clearAll();
	}

	app.init();
})();