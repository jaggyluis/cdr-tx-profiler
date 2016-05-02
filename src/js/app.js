var app = app || {};

(function() {
	'use strict';

	app.init = function() {
		this.designDay = designDay;
		this.model = new this.Model(airports, airlines, aircraft);
		this.passengers = [];
		this.view = new this.View();
	}
	app.run = function() {
		for (var d=0; d<designDay.length; d++) {
			var passengers = new this.Flight(this.designDay[d], 0.90).getPassengers()
			for (var p=0; p<passengers.length; p++) {
				this.passengers.push(passengers[p]);
			}
		}
		console.log('simulation complete'); // control time
	}
	app.display = function() {
		this.view.displayTable();
	}
	app.View = function() {
		this.table = document.getElementById("passenger-timing-table");
		this.template = document.querySelector("#passenger-timing-template").innerHTML;
		this.downloadJSONButton = document.getElementById("downloadJSON");
		this.downloadJSONButton.addEventListener('click', (function() {
			this.downloadJSON();
		}).bind(this));
		this.downloadTSVButton = document.getElementById("downloadTSV");
		this.downloadTSVButton.addEventListener('click', (function() {
			this.downloadTSV();
		}).bind(this));

		this.displayTable = function() {
			var innerString = "";
			app.passengers.forEach((function(passenger, idx) {
				var string = this.template.replace('%flightName%', passenger.flightName)
					.replace('%flightCode%', passenger.flightCode)
					.replace('%gate%', passenger.gate)
					.replace('%passengerType%', passenger.passengerType)
					.replace('%airport%', passenger.airport)
					.replace('%departureLounge%', passenger.departureLounge)
					.replace('%boardingZone%', passenger.boardingZone)
					.replace('%boarding%', passenger.boarding)
					.replace('%departure%', passenger.departureTime);
				innerString+=string;
			}).bind(this));
			this.table.innerHTML+=innerString;
		}
		this.downloadJSON = function() {
			/*
			 * modified from
			 * http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
			 */
			var a = document.createElement("a");
			var file = new Blob([JSON.stringify(app.passengers)], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = 'passengerProfiles.json';
			a.click();
			console.log('download json:', file);
		}
		this.serializeJSON = function(json) {
			return json.reduce(function(a,b) {
				return a+(Object.keys(b).map(function(key) {
					return b[key];
				}).join('\t')+'\n');
			}, Object.keys(json[0]).join('\t')+'\n')
		}
		this.downloadTSV  = function() {
			var a = document.createElement("a");
			var file = new Blob([this.serializeJSON(app.passengers)], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = 'passengerProfiles.tsv';
			a.click();
			console.log('download tsv', file);
		}
	}
	app.Model = function(airports, airlines, aircraft, pax) {
		this.airports = airports;
		this.airlines = airlines;
		this.aircraft = aircraft;
		this.pax = {
			'time':[180,0,5],
			'legend':[
				'airport',
				'departureLounge',
				'boardingZone',
				'boarding'
			],
			'C': [
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			],
			'D': [ // this needs to be swapped out
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			],
			'E': [ // this needs to be swapped out
					[6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,1,2,3,4,5,6,6,7,7,8,9,10,9,7,5,3,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,3,4,4,4,35,25,8,2,1,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,20,25,30,15,2,0,0]
			]
		};
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
		};
	}
	app.Flight = function(flight, loadFactor) {
		this.flight = flight;
		this.destination = app.model.getAirportByCode(this.flight.destination);
		this.airline = app.model.getAirlineByCode(this.flight.airline);
		this.aircraft = app.model.getAircraftByCode(this.flight.aircraft)
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
				arrTimes.push(this.minutesToDecimalDay(i));
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
					this.decimalDayToTime(this.flight.time)));
			}
			return pArray;
		}
		this.getPassengers = function() {
			if (this.destination && this.airline && this.aircraft && this.profile) {

				var passengers = this.getPassengerArray();
				var passengerArrivalTimes = this.getArrivalTimes(app.model.pax.time);
				var passengerMatrix = this.getMovementMatrix();

				this.getMovementMatrix().forEach((function(arr, index) {
					var count=0;
					for (var i=0; i<=arr.length; i++) {
						for (var j=0; j<arr[i]; j++) {
							if (passengers[count] !== undefined && count < passengers.length) {
								var time = this.decimalDayToTime(this.flight.time-passengerArrivalTimes[i])
								passengers[count][app.model.pax.legend[index]] = time;
								count++;
							}
						}
					}
				}).bind(this));
				return passengers;
			}
			return [];
		}
		this.decimalDayToTime = function(dday) {
			dday = dday>=0 ? dday : 1 + dday;
			var hours = (dday*24).toString().split('.')[0];
			var minutes = (dday*24).toString().split('.')[1]
			minutes = minutes ? (Number("." + minutes)*60).toString().split('.')[0] : "00";
			minutes = minutes.length > 1 ? minutes  : "0"+minutes;
			return hours + ':' + minutes;
		}
		this.minutesToDecimalDay = function(minutes) {
			var hours = minutes/60;
			var dday = hours/24;
			return dday;
		}
	}
	app.Passenger = function(flightName, flightCode, departureTime) {

		var percentages = { // Pull this from spreadsheet?
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
		this.gate = 0;
	}
	app.init();
	app.run();
	app.display();

})();