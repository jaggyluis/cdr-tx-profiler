var app = app || {};


(function() {
	'use strict';

	//--------------------------------------------------------
	// utility functions
	//--------------------------------------------------------

	function Interval(start, end) {
		this.start = start;
		this.end = end;
	}
	Interval.prototype.intersects = function(other) {
		return;
	}

	//--------------------------------------------------------
	// main app
	//--------------------------------------------------------

	app.Gate = function(name, isMARS) {
		this.name = name;
		this.isMARS = isMARS;
		this.seats = null;
		this.sf = {}
		this.group = {
			mars : null,
			default : null,
		}
		//this.shared = true // - maybe implement later
	}
	app.Gate.prototype.setGateArea = function(key, val) {
		this.sf[key] = val;
	}
	app.Gate.prototype.getGateArea = function(key){
		if (key === undefined ) {
			return Object.keys(this.sf).map((function(a) {
				return this.sf[a];
			}).bind(this)).reduce(function(a,b) {
				return a+b;
			})
		} else if (Object.keys(this.sf).includes(key)) {
			return this.sf[key];
		} else {
			return 0;
		}
	}
	app.Gate.prototype.setSeats = function(val) {
		this.seats = val;
	}
	app.Gate.prototype.getSeats = function(val) {
		return this.seats;
	}
	app.Gate.prototype.setGroup = function(group, mars, restricted) {
		if (mars && this.isMARS) {
			this.group.mars = group;
		} else {
			this.group.default = group;
		}
	}
	app.Gate.prototype.getGroup = function(mars) {
		if (mars && this.isMARS) {
			return this.group.mars;
		} else {
			return this.group.default;
		}
	}

})();