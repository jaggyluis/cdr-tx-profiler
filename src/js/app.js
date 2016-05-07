var app = app || {};


(function() {
	'use strict';


	// utility functions
	//

	function decimalDayToTime(dday) {
		dday = dday>=0 ? dday : 1 + dday;
		var hours = Number((dday*24).toString().split('.')[0]);
		var minutes = Number((dday*24*60 - hours*60).toString().split('.')[0]);
		var seconds = Number((dday*24*60*60 - hours*60*60 - minutes*60).toString().split('.')[0]);
		hours = hours > 0 ? hours.toString() : '00';
		minutes = minutes > 0 ? minutes.toString() : '00';
		seconds = seconds > 0 ? seconds.toString() : '00';
		hours = hours.length > 1 ? hours : "0"+hours;
		minutes = minutes.length > 1 ? minutes: "0"+minutes;
		seconds = seconds.length > 1 ? seconds: "0"+seconds;
		return hours+':'+minutes+':'+seconds;
	}

	function minutesToDecimalDay(minutes) {
		var hours = minutes/60;
		var dday = hours/24;
		return dday;
	}

	 function timeToDecimalDay(time) {
	 	var splitStr = time.split(':');
	 	var hours = Number(splitStr[0]);
	 	var minutes = Number(splitStr[1]);
	 	var seconds = null // not needed in current simulation
	 	return minutesToDecimalDay(hours*60+minutes);
	 }

	// main app
	//

	app.init = function() {
		this.model = new this.Model(airports, 
			airlines, 
			aircraft.concat(aircraftSup), 
			pax, 
			tt);
		this.view = new this.View();
		this.view.init();
		this.data = null;
	}
	app.run = function() {
		this.clear();
		this.model.setFlights(this.data, 
			this.view.getLoadFactor(), 
			this.view.getFilter(), 
			this.view.getTimeFrame());
		this.model.setGates();
		this.view.enableDownloads();
	}
	app.set = function(data) {
		this.data = data;
	}
	app.clear = function() {
		this.view.clearAll();
		this.model.clearAll();
	}


	app.View = function() {
		this.table = document.getElementById("passenger-timing-table");
		this.header = document.querySelector("#passenger-timing-header").innerHTML;
		this.template = document.querySelector("#passenger-timing-template").innerHTML;

		this.downloadJSONButton = document.getElementById("downloadJSON");
		this.downloadJSONButton.addEventListener('click', (function() {
			this.downloadJSON();
		}).bind(this));
		this.downloadJSONButton.addEventListener('mousedown',function() {
			var loading = document.getElementById("json-icn");
			loading.classList.toggle("hidden");
		});
		this.downloadJSONButton.addEventListener('mouseup',function() {
			var loading = document.getElementById("json-icn");
			loading.classList.toggle("hidden");
		});

		this.downloadCSVButton = document.getElementById("downloadCSV");
		this.downloadCSVButton.addEventListener('click', (function() {
			this.downloadCSV();
		}).bind(this));
		this.downloadCSVButton.addEventListener('mousedown',function() {
			var loading = document.getElementById("csv-icn");
			loading.classList.toggle("hidden");
		});
		this.downloadCSVButton.addEventListener('mouseup',function() {
			var loading = document.getElementById("csv-icn");
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

		this.keys = [ // Probably a better spot for this - passed in?
				'flightName', 
				'flightCode',
				'gate',
				'passengerType',
				'airport',
				'departureLounge',
				'boardingZone',
				'boarding',
				'departureTime'];

		this.init = function() {
			this.clearAll();
			this.initFileUploader();
		}
		this.enableDownloads = function() {
			document.getElementById("downloadJSON").disabled = false;
			document.getElementById("downloadCSV").disabled = false;
			document.getElementById("showResults").disabled = false;
		}
		this.showResults = function() {
			this.clearAll();
			this.displayTable();
		}
		this.clearAll = function() {
			this.table.innerHTML = this.header;
		}
		this.getFilter = function() {
			return document.getElementById("filter").value;
		}
		this.getTimeFrame = function() {
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
		}
		this.getLoadFactor = function () {
			var loadFactor = document.getElementById("loadFactor").value;
			if (loadFactor>0 && loadFactor<=1) {
				return loadFactor;
			} else {
				return 1;
			}
		}
		this.displayTable = function() {
			var innerString = "";
			app.model.getPassengers().forEach((function(passenger, idx) {
				var passengerString = this.template;
				this.keys.forEach(function(key) {
					passengerString = passengerString.replace('%'+key+'%', passenger[key]);
				})
				innerString+=passengerString;
			}).bind(this));
			this.table.innerHTML+=innerString;
		}
		this.downloadJSON = function() {
			/*
			 * modified from
			 * http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
			 */
			var a = document.createElement("a");
			var file = new Blob([JSON.stringify(app.model.getPassengers())], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = 'PassengerTimingProfiles.json';
			a.click();
		}
		this.readJSON = function(fileStr) {
			try {
				return JSON.parse(fileStr);
			} catch (e) {
				return null;
			}
		}
		this.serializeJSON = function(json) {
			return json.reduce((function(a,b) {
				return a+(this.keys.map(function(key) {
					return '"'+b[key]+'"';
				}).join(',')+'\n');
			}).bind(this), this.keys.join(',')+'\n');
		}
		this.downloadCSV  = function() {
			var a = document.createElement("a");
			var file = new Blob([this.serializeJSON(app.model.getPassengers())], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = 'PassengerTimingProfiles.csv';
			a.click();
		}
		this.readCSV = function(fileStr) {
			var parsed = fileStr.split('\n');
			var re = /[^\w\:\-]/gi;
			var keys = parsed[0].split(',').map(function(str) {
				return str.replace(re, "");
			});
			return parsed.slice(1).map(function(csvArray) {
				var flight = {};
				csvArray.split(',').map(function(str) {
					return str.replace(re, "");
				}).forEach(function(value, idx) {
					if (!isNaN(Number(value))) {
						flight[keys[idx]] =  Number(value);
					} else if (value.match(':')){
						flight[keys[idx]] = timeToDecimalDay(value);
					} else {
						flight[keys[idx]] = value;
					}
				});
				return flight;
			});
		}
		this.initFileUploader= function() {
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
						app.set(self.readJSON(this.result));
					} else if (fileName.split('.')[1] === 'csv' ) {
						app.set(self.readCSV(this.result));
					}
					document.getElementById('run').disabled = false;
					//drop.classList.toggle('hidden');

				});
				reader.readAsText(e.dataTransfer.files[0]);
				drop.innerText = fileName.toUpperCase();
			})
		}
	}


	app.Model = function(airports, airlines, aircraft, pax, tt) {
		this.airports = airports; 	// these should probably be jsons - AJAX?
		this.airlines = airlines;	//
		this.aircraft = aircraft;	//
		this.pax = pax;				//
		this.tt = tt
		this.flights = [];
		this.gates = {};
		for (var i=0; i<25; i++) {
			this.gates['B'+ i] = [];
		}

		// these should probably be moved to the model files if they stay as .js
		//
		this.getAirportByCode = function(code) {
			return this.airports.filter(function(obj) {
				return obj.IATA == code;
			})[0];
		};
		this.getAirlineByCode = function(code) {
			return this.airlines.filter(function(obj) {
				return obj.IATA == code;
			})[0];
		};
		this.getAircraftByCode = function(code) {
			return this.aircraft.filter(function(obj) {
				return obj.IATA == code;
			})[0];
		}
		this.setFlights = function(data, loadFactor, filter, timeFrame) {
			data.forEach((function(_flight) {
				if (decimalDayToTime(_flight.time).split(':')[0] > timeFrame[0] &&
					decimalDayToTime(_flight.time).split(':')[0] < timeFrame[1]) {
					var flight = new app.Flight(_flight, loadFactor)
					if (JSON.stringify(flight).match(filter)) {
						this.flights.push(flight);
					}
				}
			}).bind(this));
		}
		this.setGates = function() {
			this.flights.forEach((function(flight, idx) {
				flight.gate = this.findGate(flight);
			}).bind(this));
		}
		this.clearAll = function () {
			this.flights = [];
			for (var gate in this.gates) {
				this.gates[gate] = [];
			}
		}
		this.findGate = function(flight) {
			if (flight.tt === 0) return '__'; 
			for (var gate in this.gates) {
				if (this.gates[gate].some(function(t) {
					var a = [t.flight.time - t.tt, t.flight.time];
					var b = [flight.flight.time - flight.tt, flight.flight.time];		
					return ((a[0] <= b[0] && a[1] >= b[1] && a[0] <= b[1] && a[1] >= b[0]) || 
						(a[0] <= b[0] && a[1] <= b[1] && a[0] <= b[1] && a[1] >= b[0]) || 
						(a[0] >= b[0] && a[1] >= b[1] && a[0] <= b[1] && a[1] >= b[0]) ||
						(a[0] >= b[0] && a[1] <= b[1] && a[0] <= b[1] && a[1] >= b[0]));
				})) {
					continue;
				} else {
					this.gates[gate].push(flight);
					return gate;
				}		
			}
			console.log(flight.getFlightName(), decimalDayToTime(flight.tt));
			return null;
		}
		this.getPassengers = function() {
			var passengers = [];
			this.flights.forEach(function(flight) {
				flight.getPassengers().forEach(function(passenger) {
					passengers.push(passenger);
				});
			})
			return passengers;
		}
		this.getTurnaroundTime = function(flight) {
			if (flight.aircraft in this.tt) {
				if (flight.airline in this.tt[flight.aircraft]) { // do average for now
					var length = this.tt[flight.aircraft][flight.airline].length;
					var sum = this.tt[flight.aircraft][flight.airline].reduce(function(a,b) {
						return a+b;
					})
					return sum/length;
				} else {
					var length = 0;
					var sum = Object.keys(this.tt[flight.aircraft]).map((function(a){
						return this.tt[flight.aircraft][a];
					}).bind(this)).reduce(function(a,b) {
						return a.concat(b)
					},[]).reduce(function(a,b) {
						length++;
						return a+b;
					});
					return sum/length;
				}
			} else {
				return 0;
			}
		}
	}


	app.Flight = function(flight, loadFactor) {
		this.flight = flight;
		this.destination = app.model.getAirportByCode(this.flight.destination);
		this.airline = app.model.getAirlineByCode(this.flight.airline);
		this.aircraft = app.model.getAircraftByCode(this.flight.aircraft)
		this.tt = this.flight.tt !== 0 ? this.flight.tt : app.model.getTurnaroundTime(this.flight);
		this.aircraft.seats = this.flight.seats !== undefined ? this.flight.seats*loadFactor : this.aircraft.seats*loadFactor;
		this.gate = null;
		this.profile = app.model.pax[this.aircraft.ARC.split('-')[0]];

		this.getFlightName = function() {
			return '%airline% to %municipality%, %plane%'
				.replace('%municipality%', this.destination.municipality)
				.replace('%airline%', this.airline.name)
				.replace('%plane%', this.aircraft.name);
		}
		this.getArrivalTimes = function(arr) {
			var arrTimes = []
			for (var i=arr[0]; i>=arr[1]; i-=arr[2]) {
				arrTimes.push(minutesToDecimalDay(i));
			}
			return arrTimes;
		}
		this.getMovementMatrix = function() {
			var matrix = []
			this.profile.forEach((function(arr, index) {
				var seats = this.aircraft.seats;
				var mArray = [];
				arr.forEach((function(num) {
					var count = 0;
					for (var i=0; i< Math.ceil(this.aircraft.seats*num/100); i++) {
						if (seats >0 ) {
							seats--;
							count++;
						} else break;
					}
					mArray.push(count);
				}).bind(this));
				matrix.push(mArray);
			}).bind(this));
			return matrix;
		}
		this.getPassengerArray = function() {
			var pArray = []
			for (var i=0; i<this.aircraft.seats; i++) {
				pArray.push(new app.Passenger(this.getFlightName(), 
					this.airline.IATA, 
					decimalDayToTime(this.flight.time),
					this.gate));
			}
			return pArray;
		}
		this.getPassengers = function() {
			if (this.destination && this.airline && this.aircraft && this.profile) {

				var passengers = this.getPassengerArray();
				var passengerArrivalTimes = this.getArrivalTimes(app.model.pax.time);

				this.getMovementMatrix().forEach((function(paxTimes, legend) {
					var count = 0;
					paxTimes.forEach((function(numPeople, index) {
						for (var i=0; i<numPeople; i++) {
							var interp = decimalDayToTime(this.flight.time -
								passengerArrivalTimes[index] +
								i * minutesToDecimalDay(app.model.pax.time[2] / numPeople));

							passengers[count][app.model.pax.legend[legend]] = interp;
							count++;
						}
					}).bind(this));
				}).bind(this));
				return passengers;
			}
			return [];
		}
	}


	app.Passenger = function(flightName, flightCode, departureTime, gate) {

		var percentages = { // Pull this from spreadsheet? - passed in?
			"Leisure": 30,
			"Assisted": 5,
			"Business": 25,
			"Unique": 20,
			"Family": 20
		}
		var types = [];
		for (var type in percentages) {
			for (var i = 0; i <=percentages[type]; i++) {
				types.push(type);
			}
		}
		this.flightName = flightName;
		this.flightCode = flightCode;
		this.departureTime = departureTime;
		this.passengerType = types[Math.floor(Math.random() * (100 - 0 + 1)) + 0];
		this.gate = gate;
	}

	app.init();
})();