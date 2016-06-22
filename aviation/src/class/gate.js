var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Gate = function(name, isMARS) {
		
		return new Gate(name, isMARS);
	}
	
	function Gate (name, isMARS) {

		this.name = name;
		this.isMARS = isMARS;
		this.seats = null;
		this.padding = [
			-aviation.time.timeToDecimalDay('00:15:00'),
			aviation.time.timeToDecimalDay('00:15:00')
			];
		this.sf = {}
		this.group = {
			mars : null,
			default : null,
		}
		this.flights = {
			[this.name+'a'] : [],
			[this.name+'b'] : []
		};
	};
	Gate.prototype = {

		setArea : function (key, val) {

			this.sf[key] = val;
		},
		getArea : function (key){

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
		},
		setSeats : function(val) {
			
			this.seats = val;
		},

		getSeats : function (val) {

			return this.seats;
		},
		setDesignGroup : function (group, mars) {

			if (mars && this.isMARS) {
				this.group.mars = group;
			} else {
				this.group.default = group;
			}
		},
		getDesignGroup : function (mars) {

			if (mars && this.isMARS) {

				return this.group.mars;
				
			} else {

				return this.group.default;
			}
		},
		matchDesignGroup : function (flight, mars) {

			return this.getDesignGroup(mars) >= flight.getDesignGroup();
		},
		setFlight : function (flight, sub) {

			if (sub && sub !== this.name  && this.isMARS) { // blehhhh
				this.flights[sub].push(flight);
			} else {
				for (var key in this.flights) {
					this.flights[key].push(flight);
				}
			}
		},
		getFlights : function (sub) {

			if (sub && this.isMARS) {

				return this.flights[sub];
			} else {

				var uniq= [];
				
				Object.keys(this.flights).map((function(key) {

					return this.flights[key]

				}).bind(this)).reduce(function(a, b) {

					return a.concat(b);

				}, []).forEach(function(flight) {
					if (!uniq.includes(flight)) {
						uniq.push(flight);
					}
				});

				return uniq;
			}
		},
		fit : function (flight, cb) {

			var data = {
				response : null,
				gate : null
			}

			if (this.matchDesignGroup(flight)) {
				if (this.isMARS && this.matchDesignGroup(flight, this.isMARS)) {
					for (var sub in this.flights) {
						if (this.tap(flight, this.getFlights(sub))) {
							data.response = true;
							data.gate = sub;

							break;
						}
					}
				} else {
					if (this.tap(flight, this.getFlights())) {
						data.response = true;
						data.gate = this.name;
					}
				}
			}
			return cb(data, flight);
		},
		tap : function (flight, fArr) {

			return !fArr.some((function(f) {

				return f.ival.padded(this.padding[0], this.padding[1])
					.intersects(flight.ival.padded(this.padding[0], this.padding[1]));

			}).bind(this));
		}
	}

	return aviation;

})(AVIATION || {});
