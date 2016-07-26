var app = app || {};

(function() {

	app.View = function() {

			this.passengers = null;
			this.flights = null;
			this.keys = [ 
				'flightID',
				'passengerType',
				'gender',
				'bags',
				'isPreCheck',
				'arrival',
				'security',
				'concourse',
				'gate',
				'boarding',
				'departure'];

			this.hexColors = {

				'domestic.business.departing' 		: '#211463',
				'domestic.business.transfer' 		: '#35277D',
				'international.business.departing' 	: '#685BA9',
				'international.business.transfer' 	: '#4B3D92',
				'domestic.leisure.departing' 		: '#8F600D',
				'domestic.leisure.transfer' 		: '#B58126',
				'international.leisure.departing' 	: '#F5C673',
				'international.leisure.transfer' 	: '#D3A047',
				'domestic.other.departing' 			: '#2D8677',
				'domestic.other.transfer' 			: '#085B4D',
				'international.other.departing' 	: '#187263',
				'international.other.transfer' 		: '#499B8D',
			}

			this._passengers=[];
			this._flights = [];

			this._passengerProfiles = [];
			this._flightProfiles = [];

			var self = this;

			this.runButtons = Array.prototype.slice.call(document.getElementsByClassName('run-btn'));
			this.runButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {

					btn.disabled = true;
					btn.parentNode.children[1].classList.toggle('hidden');

					if (btn.id == 'timing-btn') {
						app.run(function(data) {

							self.clearPassengerTimingSimulationTables();
							btn.parentNode.children[1].classList.toggle('hidden');
							btn.disabled = false;

							self.passengers = data.passengers.filter(function(passenger) {
								//this.getPassengerFilter();
								return true;
							});

							self.flights = data.flights;

							self.buildPassengerTimingSimulationTables();
							self.enableDownloads('#timing-box')
						});

					}
					else if (btn.id == 'profile-btn') {
						app.compute(function(data) {

							self.clearPassengerProfileSimulationTables();
							btn.parentNode.children[1].classList.toggle('hidden');
							btn.disabled = false;

							self._passengerProfiles = data.passengerProfiles;
							self._flightProfiles = data.flightProfiles;
							
							self.buildPassengerProfileSimulationTables(data);							
							self.enableDownloads('#profile-box');

							self.enableProfileRunButton();
						});
					}

				})
			});

			this.checkButtons = Array.prototype.slice.call(document.getElementsByClassName('chk-btn'));
			this.checkButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {
					var cls ='#'+btn.parentNode.parentNode.parentNode.parentNode
						.id+' .chk-btn';
					Array.prototype.slice.call(document.querySelectorAll(cls)).forEach(function(b){
						b.checked = false;
					})
					btn.checked = true;
				});
			});

			this.saveButtons = Array.prototype.slice.call(document.getElementsByClassName('save-btn'));
			this.saveButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {
					var checked = Array.prototype.slice.call(this.parentNode.children)
						.filter(function(elem) {

							return elem.children.length !== 0 &&
								elem.children[0].checked == true;
						})[0].children[0];

					self.save(btn.id, checked.classList[1]);
				})
			});

			this.showButtons = Array.prototype.slice.call(document.getElementsByClassName('show-btn'));
			this.showButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {
					btn.innerText = btn.innerText === 'Hide Results' ? 
						'Show Results' : 'Hide Results';
					btn.parentNode.parentNode.parentNode
						.children[1].classList.toggle('collapsed');
				});
			});
	};
	app.View.prototype = {

		//
		//	General Functions
		//
		
		init : function() {

			this.clearPassengerTimingSimulationTables();
		},
		enableDownloads : function(id) {

			Array.prototype.slice.call(document.querySelectorAll(id+' .show-btn')).forEach(function(b){
				b.disabled = false;
			});
		},
		enableProfileRunButton : function() {

			document.querySelectorAll("#timing-box .run-btn")[0].disabled = false;
		},
		getTerminalFilter : function() {

			return document.getElementById("filter-terminal").value;
		},
		getFlightFilter : function() {

			return document.getElementById("filter-flights").value;
		},
		getPassengerFilter : function() {

			return document.getElementById("filter-passengers").value;
		},
		getTimeFrame : function() {

			var timeFrame = document.getElementById('timeFrame')
				.value.split(" to ")
				.map(function (str) {

				return Number(str);
			});
			if (timeFrame.length == 2 && 
				!isNaN(timeFrame[0] &&
				!isNaN(timeFrame[1]))) {

				return timeFrame;

			} else {

				return [0, 24];
			}
		},
		getLoadFactor : function () {
			var loadFactor = document.getElementById("loadFactor").value;

			if (loadFactor>0 && loadFactor<=1) {

				return loadFactor;
			} else {

				return 1;
			}
		},
		save : function (id, type) {
						
			switch (type) {

				case "json":
					this.downloadJSON(this['_'+id], id);

					break;

				case "csv":

					var keys = Object.keys(this['_'+id][0]) 

					this.downloadCSV(AVIATION.string.serializeJSON(this['_'+id], keys), id);

					break;

				default :

					break;
			};
		},
		downloadJSON : function(data, name) {
			/*
			 * modified from
			 * http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
			 */
			var a = document.createElement("a");
			var file = new Blob([JSON.stringify(data)], {type:'text/plain'});

			a.href = URL.createObjectURL(file);
			a.download = name+'.json';
			a.click();
		},
		downloadTXT : function(data, name) {

			var a = document.createElement("a");
			var file = new Blob([data], {type:'text/plain'});

			a.href = URL.createObjectURL(file);
			a.download = name+'.txt';
			a.click();
		},
		downloadCSV : function(data, name) {

			var a = document.createElement("a");
			var file = new Blob([data], {type:'text/plain'});

			a.href = URL.createObjectURL(file);
			a.download = name+'.csv';
			a.click();
		},


		//
		//	Passenger Profile simulation view updates
		//

		buildPassengerProfileSimulationTables : function (data) {

			this.buildPassengerProfilesTable(data.passengerProfiles);
			this.buildFlightProfilesTable(data.flightProfiles);

		},
		clearPassengerProfileSimulationTables : function() {

			document.getElementById('passenger-profile-parcoords').innerHTML = '';
			document.getElementById('passenger-profile-table').innerHTML = '';

			this._passengerProfiles = [];
			this._flightProfiles = [];

		},
		buildPassengerProfilesTable : function (passengerProfiles) {

			var self = this,
				color = function(d) {return self.hexColors[d.name]; };

			var parcoords = d3.parcoords()("#passenger-profile-parcoords")
			    .data(passengerProfiles.map(function(d) {return d.wrangle(); }))
			    .hideAxis([])
			    .color(color)
			    .alpha(0.5)
			    .composite("darken")
			    .margin({ top: 20, left: 100, bottom: 10, right: 0 })
			    .mode("queue")
			    .render()
			    //.reorderable();
			    .brushMode("1D-axes");  // enable brushing

			var grid = d3.divgrid();

			d3.select("#passenger-profile-table")
			    .datum(passengerProfiles.slice(0,10).map(function(d) {return d.wrangle(); }))
			    .call(grid)
			    .selectAll(".row")
			    .on({
			    	"mouseover": function(d) { parcoords.highlight([d]) },
			    	"mouseout": parcoords.unhighlight
			    });

			parcoords.on("brush", function(d) {
			    d3.select("#passenger-profile-table")
			    	.datum(d.slice(0,10))
			    	.call(grid)
			    	.selectAll(".row")
			    	.on({
			        	"mouseover": function(d) { parcoords.highlight([d]) },
			        	"mouseout": parcoords.unhighlight
			      });
			  });


		},
		buildFlightProfilesTable : function (flightProfiles) {

			console.log(flightProfiles);
		},

		//
		//	Passenger Timing simulation view updates
		//

		buildPassengerTimingSimulationTables : function() {

			this.buildPassengersTable();
			this.buildFlightsTable();
		},
		clearPassengerTimingSimulationTables : function() {

			var pTable = document.getElementById("passenger-timing-table"),
				pHeader = document.getElementById("passenger-timing-header").innerHTML,
				fTable = document.getElementById("flight-table"),
				fHeader = document.getElementById("flight-table-header").innerHTML;
			
			pTable.innerHTML = pHeader;
			fTable.innerHTML = fHeader;

			this._passengers=[];
			this._flights = [];
		},
		buildPassengersTable : function() {

			var table = document.getElementById('passenger-timing-table'),
				template = document.getElementById('passenger-timing-template').innerHTML,
				innerString = '',
				count = 0;
			
			this.passengers.forEach((function(passenger, idx) {

				var _ret = {};
				var passengerString = template;

				if (passenger.getEvent('security').value < passenger.getEvent('arrival').value || 
					passenger.getEvent('concourse').value < passenger.getEvent('security').value) {
					count++;
					return;
				}

				this.keys.forEach(function(key) {

					var event = passenger.getEvent(key);

					if (event) {
						_ret[key] = event.value;
						passengerString = passengerString.replace('%'+key+'%', 
							AVIATION.time.decimalDayToTime(_ret[key]));
					} else {
						_ret[key] = passenger.attributes[key];
						passengerString = passengerString.replace('%'+key+'%', _ret[key]);

					}
				})


				//
				//	Additional visualisation variables
				//

				_ret['category'] = passenger.flight.getCategory();
				_ret['color'] = this.hexColors[passenger.attributes.passengerType.split('.').slice(1).join('.')]

				var delta = passenger.delta;

				Object.keys(delta).forEach(function(key) {
					_ret['delta.'+key] = delta[key];
				})	

				this._passengers.push(_ret);
				innerString+=passengerString;
				
			}).bind(this));

			console.error('passengers broken : ', count);
			
			table.innerHTML+=innerString;
		},
		buildFlightsTable : function () {

			var table = document.getElementById('flight-table'),
				template = document.querySelector('#flight-table-template').innerHTML,
				innerString = '',
				self = this;

			this.flights.forEach(function(flight, idx) {

				self._flights.push({
					'name' : flight.getFlightName(),
					'code' : flight.airline.IATA,
					'id' : flight.id,
					'loadFactor' : flight.loadFactor,
					'seats' : flight.flight.seats,
					'count' : flight.passengers.length,
					'gate' : flight.gate,
					'time' : AVIATION.time.decimalDayToTime(flight.getTime()),
					'arrival' : AVIATION.time.decimalDayToTime(flight.getTime() - flight.ival.getLength()),
					'delta.arrival' : flight.ival.getLength()
				});

				var flightString = template.replace('%name%', flight.getFlightName())
							.replace('%code%', flight.airline.IATA)
							.replace('%id%', flight.id)
							.replace('%loadFactor%', flight.loadFactor)
							.replace('%seats%', flight.flight.seats)
							.replace('%count%', flight.passengers.length)
							.replace('%gate%', flight.gate)
							.replace('%time%', AVIATION.time.decimalDayToTime(flight.getTime()));
				innerString+=flightString;
			});
			table.innerHTML+=innerString;
		}
	};

})();
