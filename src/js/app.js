var app = app || {};


(function() {
	'use strict';

	app.init = function() {
		this.model = new this.Model(airports, airlines, aircraft, pax, tt);
		this.view = new this.View();
		this.view.init();
	}
	app.run = function(designDay) {
		this.clearAll();
		this.model.setFlights(designDay, 
			this.view.getLoadFactor(), 
			this.view.getFilter(), 
			this.view.getTimeFrame());
		this.model.setGates();
		this.view.enableDownloads();
	}
	app.display = function() {
		this.view.displayTable();
	}
	app.clearAll = function() {
		this.view.clearAll();
		this.model.clearAll();
	}


	app.View = function() {
		this.table = document.getElementById("passenger-timing-table");
		this.header = document.querySelector("#passenger-timing-header").innerHTML;
		this.template = document.querySelector("#passenger-timing-template").innerHTML;
		
		this.trigger = document.getElementById("fileUpload");
		this.trigger.addEventListener('change', (function(val) {
			//console.log(val.target.value);
			//console.log(this.loadJSON(val.target.value))
		}).bind(this));

		this.uploadJSONButton = document.getElementById("uploadJSON");
		this.uploadJSONButton.addEventListener('click', (function() {
			this.trigger.click();
		}).bind(this));

		this.downloadJSONButton = document.getElementById("downloadJSON");
		this.downloadJSONButton.addEventListener('click', (function() {
			this.downloadJSON();
		}).bind(this));

		this.downloadCSVButton = document.getElementById("downloadCSV");
		this.downloadCSVButton.addEventListener('click', (function() {
			this.downloadCSV();
		}).bind(this));

		this.showResultsButton = document.getElementById("showResults");
		this.showResultsButton.addEventListener('click', (function() {
			this.showResults();
		}).bind(this));
		this.showResultsButton.addEventListener('mousedown',function() {
			var loading = document.getElementById("loading");
			loading.classList.toggle("hidden");
		});
		this.showResultsButton.addEventListener('mouseup',function() {
			var loading = document.getElementById("loading");
			loading.classList.toggle("hidden");
		});

		this.runButton = document.getElementById("run");
		this.runButton.addEventListener('click', (function() {
			app.run(designDay);
		}).bind(this));

		this.inputs = document.getElementsByTagName("input");
		for (var i=0; i<this.inputs.length; i++) {
			this.inputs[i].addEventListener('click', function() {
				//app.clearAll();
			});
		}

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
		}
		this.enableDownloads = function() {
			document.getElementById("downloadJSON").disabled = false;
			document.getElementById("downloadCSV").disabled = false;
			document.getElementById("showResults").disabled = false;
		}
		this.showResults = function() {
			app.display();
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
		this.loadJSON = function(filePath) {

		    var startIndex = filePath.indexOf('\\') >= 0 ? filePath.lastIndexOf('\\') : filePath.lastIndexOf('/');
		    var filename = filePath.substring(startIndex);
		    if(filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
		        filename = filename.substring(1);
		    }
			return $.ajax({
				url: filename,
				success: function(data) {
					fileContent = data;
					return data;
				}
			});
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
		this.setFlights = function(designDay, loadFactor, filter, timeFrame) {
			designDay.forEach((function(_flight) {
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
		this.profile = app.model.pax[this.aircraft.code];

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

	// utility functions
	//


	function decimalDayToTime(dday) {
		dday = dday>=0 ? dday : 1 + dday;
		var hours = (dday*24).toString().split('.')[0];
		var minutes = (dday*24).toString().split('.')[1]
		minutes = minutes ? (Number("." + minutes)*60).toString().split('.')[0] : "00";
		minutes = minutes.length > 1 ? minutes  : "0"+minutes;
		return hours + ':' + minutes;
	}

	function minutesToDecimalDay(minutes) {
		var hours = minutes/60;
		var dday = hours/24;
		return dday;
	}

})();