var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Gate = function (gateObj) {
		
		return new Gate(gateObj);
	}
	
	function Gate (gateObj) {

		this.name = gateObj[0];
		this.isMARS = gateObj[1];
		this.seats = gateObj[2];
		this.padding = [
			-aviation.time.timeToDecimalDay('00:15:00'),
			aviation.time.timeToDecimalDay('00:15:00')
			];
		this.sf = {};
		this.group = {
			mars : null,
			default : null,
		};
		this.flights =  this.isMARS ?
			gateObj[7].reduce(function(obj, sub) {

				obj[sub] = [];

				return obj;

			},{}) : {
				[this.name+'a'] : [],
				[this.name+'b'] : []
			};
		this.setArea('waiting', gateObj[3]);
		this.setArea('boarding', gateObj[4]);
		this.setDesignGroup(gateObj[5]);
		if (gateObj[6] !== null) {
			this.setDesignGroup(gateObj[6], true);
		};
		this.carriers = new Set();
	};
	Gate.prototype = {

		get num () {

			var n = parseInt(this.name.split('').reduce(function(numStr, str) {

				if (isNaN(parseInt(str))) return numStr;
				
				return numStr+str;

			}, ''));

			return isNaN(n) ? 0 : n;
		},
		setArea : function (key, val) {

			this.sf[key] = val;
		},
		getArea : function (key){

			if (key === undefined ) {

				return Object.keys(this.sf).map((function(a) {

					return this.sf[a];

				}).bind(this)).reduce(function(a,b) {

					return a + b;

				})

			} else if (Object.keys(this.sf).includes(key)) {

				return this.sf[key];

			} else {

				return 0;
			};
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
			this.carriers.add(flight.airline);
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
		getFlightsByCarrier : function (carrier) {

			return this.getFlights().filter(function(flight) {

				return flight.airline === carrier;
			});
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
		},
		hasCarrier : function (airline) {

			return this.carriers.has(airline);

		},
	}

	return aviation;

})(AVIATION || {});
