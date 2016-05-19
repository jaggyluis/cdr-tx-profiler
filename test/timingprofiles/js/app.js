

//--------------------------------------------------------
// main app
//--------------------------------------------------------
'use strict';

var app = app || {};

(function() {

	
	app.init = function() {

		//this.TEMP();
		this.getPassengerTypes();

		this._view = new this.View();
		this._view.init();
		this._data = null;
		this._gates = gatelayout;
		this._stash = null;
	}
	app.run = function() {
		this.clear();

		AVIATION.set(
			this._gates,
			this._data,
			this._view.getLoadFactor(), 
			this._view.getFlightFilter(), 
			this._view.getTimeFrame());

		this._view.data = AVIATION.get.passengers(this._view.getPassengerFilter());
		this._stash = AVIATION.stash.parse();
		this._view.enableDownloads();
	}
	app.set = function(data) {
		this._data = data;
	}
	app.clear = function() {
		this._view.clear();
		AVIATION.clear();
	}
	app.getPassengerTypes = function() {

		function getPassengersByType(pArr) {
			var types = {
				leisure : [2,3,5,6],
				assisted : [4,6,10],
				business : [1,5,11],
				unique : [12,13,7],
				family : [2,3,13]
			}
			var filtered = {
				leisure : [],
				assisted : [],
				business : [],
				unique : [],
				family : []
			}
			var Q8keys = [9,15,16,17,107];

			pArr.forEach(function(p) {
				for (var i=0; i<6; i++) {
					for (var type in types) {
						if (types[type].includes(p['Q2PURP'+i.toString()])) {
							filtered[type].push(p);
						}
					}
					if (Q8keys.includes(p['Q8COM'+i.toString()])) {
						filtered['assisted'].push(p);
					}
				}	
			})
			return filtered;
		}

		var passengers = p12.concat(p13).concat(p14).concat(p15);
		var len = passengers.length;
		var filtered = getPassengersByType(passengers);
		console.log(filtered);


		

	}
	app.TEMP = function() { //Separate App?

		function getArrivalDistribution(pArr) {

			var delta = [],
				dist;

			pArr.forEach(function(p) {

				var arrTime,
					depTime;

				if (AVIATION.time.isapTime(p.ARRTIME)) {
					arrTime = AVIATION.time.aptimeToDecimalDay(p.ARRTIME);
				} else if (!isNaN(p.ARRTIME)) {
					arrTime = p.ARRTIME;
				}
				if (AVIATION.time.isapTime(p.DEPTIME)) {
					depTime = AVIATION.time.aptimeToDecimalDay(p.DEPTIME);
				} else if (!isNaN(p.DEPTIME)) {
					depTime = p.DEPTIME;
				}
				if (arrTime && depTime) {
					var near = AVIATION.math.round(AVIATION.time.decimalDayToMinutes(depTime-arrTime),5)
					delta.push(near);
				}
			});
			dist = AVIATION.array.dist(delta);
			console.log(Object.keys(dist).map(function(o) {
				return dist[o];
			}).reduce(function(a,b) {
				return a+b;
			}))
			return dist;
			}

		var flights = [];
		var passengers = p13.concat(p14).concat(p15);
		var typeData = {};
		console.log('total passengers: ', passengers.length);

		var destinations = AVIATION.array.buildLib(passengers, 'DEST');
		Object.keys(destinations).map(function(dest) {
			var aLib = AVIATION.array.buildLib(destinations[dest], 'AIRLINE');
			for (var airline in aLib) {
				flights.push({
					passengers : aLib[airline],
					flight : aLib[airline][0].FLIGHT,
					destination : key.DESTINATION[dest],
					airline : key.AIRLINE[airline],
					aircraft : null,
				})
			}
		})
		console.log('total flight types: ', flights.length)
		var sorted = flights.sort(function(a,b) {
			return b.passengers.length - a.passengers.length
		});
		sorted.forEach((function(f) {

			var airport = AVIATION.get.airportByString(f.destination);
			var airline = AVIATION.get.airlineByCode(f.airline);
			
			if (airport !== undefined && airline !== undefined) {

				var matchedFlights = designDay.filter(function(flight) {
					return flight.OPERATOR == airline.IATA && 
						flight["DEST."] == airport.IATA
				});
				if (matchedFlights.length !== 0) {
					//console.log(airport.IATA, airline.IATA);
					//console.log(matchedFlights);
					var types = matchedFlights.map(function(m) {
						try {
							return AVIATION.get.aircraftByCode(m.AIRCRAFT).RFLW;
						} catch (e) {
							console.log('not in library: ', m.AIRCRAFT)
						}
					});
					var type = AVIATION.array.mode(types);
					if (type in typeData) {
						f.passengers.forEach(function(p) {
							typeData[type].push(p);
						})
					} else {
						typeData[type] = f.passengers;
					}
				} else {
					console.log('flight not matched');
				}
			}

		}).bind(this));

		console.log(typeData);
		console.log(getArrivalDistribution(typeData.C));
	}
	app.View = function() {
			this.table = document.getElementById("passenger-timing-table");
			this.header = document.querySelector("#passenger-timing-header").innerHTML;
			this.template = document.querySelector("#passenger-timing-template").innerHTML;
			this.data = null;
			this.keys = [ 
				'flightName', 
				'flightCode',
				'gate',
				'passengerType',
				'gender',
				'airport',
				'departureLounge',
				'boardingZone',
				'boarding',
				'departureTime'];

			this.runButton = document.getElementById("run");
			this.runButton.addEventListener('click', (function() {
				app.run();
			}).bind(this));
			this.runButton.addEventListener('mousedown',function() {
				var loading = document.getElementById("run-icn");
				loading.classList.toggle("hidden");
			});
			this.runButton.addEventListener('mouseup',function() {
				var loading = document.getElementById("run-icn");
				loading.classList.toggle("hidden");
			});
			this.saveButton = document.getElementById("save");
			this.saveButton.addEventListener('click', (function() {
				this.save();
			}).bind(this));
			this.saveButton.addEventListener('mousedown',function() {
				var loading = document.getElementById("save-icn");
				loading.classList.toggle("hidden");
			});
			this.saveButton.addEventListener('mouseup',function() {
				var loading = document.getElementById("save-icn");
				loading.classList.toggle("hidden");
			});
			this.showResultsButton = document.getElementById("showResults");
			this.showResultsButton.addEventListener('click', (function() {
				this.showResults();
			}).bind(this));
			this.showResultsButton.addEventListener('mousedown',function() {
				var loading = document.getElementById("show-icn");
				loading.classList.toggle("hidden");
			});
			this.showResultsButton.addEventListener('mouseup',function() {
				var loading = document.getElementById("show-icn");
				loading.classList.toggle("hidden");
			});
			this.checkboxes = Array.prototype.
				slice.call(document.getElementsByClassName("chk-toggle"));
			this.checkboxes.forEach((function(box) {
				box.addEventListener('click', (function() {
					this.checkboxes.forEach(function(other) {
						other.checked = false;
						box.checked = true;
					})
				}).bind(this));
			}).bind(this));
	};
	app.View.prototype = {
		init : function() {
			this.clear();
			this.initFileUploader();
		},
		enableDownloads : function() {
			document.getElementById("save").disabled = false;
			document.getElementById("showResults").disabled = false;
		},
		showResults : function() {
			this.clear();
			this.displayTable();
		},
		clear : function() {
			this.table.innerHTML = this.header;
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
		displayTable : function() {
			var innerString = "";


			this.data.forEach((function(passenger, idx) {
				var passengerString = this.template;
				this.keys.forEach(function(key) {
					passengerString = passengerString.replace('%'+key+'%', passenger[key]);
				})
				innerString+=passengerString;
			}).bind(this));
			this.table.innerHTML+=innerString;
		},
		save : function () {
			var type = this.checkboxes.filter(function(box) {
				return box.checked == true;
			})[0].id;
			switch (type) {
				case "json":
					this.downloadJSON();
					break;
				case "csv":
					this.downloadCSV();
					break;
				case "log":
					this.downloadJSON(app._stash, 'logFile.json');
					break;
				case "txt":
					this.downloadTXT(AVIATION.stash.parse(app._stash));
					break;
				default :
					break;
			};
		},
		downloadJSON : function(_data, _str) {
			/*
			 * modified from
			 * http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
			 */
			var data = _data || this.data;
			var a = document.createElement("a");
			var file = new Blob([JSON.stringify(data)], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = _str || 'PassengerTimingProfiles.json';
			a.click();
		},
		downloadTXT : function(_data, _str) {
			var data = _data || 'hello world';
			var a = document.createElement("a");
			var file = new Blob([data], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = _str || 'summary.txt';
			a.click();
		},
		downloadCSV : function() {
			var a = document.createElement("a");
			var file = new Blob([AVIATION.JSON.serialize(this.data, this.keys)], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = 'PassengerTimingProfiles.csv';
			a.click();
		},
		initFileUploader : function() {
			/*
			 * modified from
			 * http://www.htmlgoodies.com
			 * /html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html#fbid=fCs8ypx8lEd
			 */
			var self = this;
			var drop = document.getElementById('drop');
			drop.addEventListener('dragover', function (e) {
				if (e.preventDefault) { e.preventDefault(); }
			})
			drop.addEventListener('dragenter', function (e) {
				if (e.preventDefault) { e.preventDefault(); }
			})
			drop.addEventListener('drop', function (e) {
				if (e.preventDefault) { e.preventDefault(); }
				var reader = new FileReader();
				var fileName = e.dataTransfer.files[0].name;
				reader.addEventListener('loadend', function(e, file) {
					if (fileName.split('.')[1] === 'json' ) {
						app.set(AVIATION.JSON.parse(this.result));
					} else if (fileName.split('.')[1] === 'csv' ) {
						app.set(AVIATION.CSV.parse(this.result));
					}
					document.getElementById('run').disabled = false;
				});
				reader.readAsText(e.dataTransfer.files[0]);
				drop.innerText = fileName.toUpperCase();
			})
		}
	};

	app.init();
})();


