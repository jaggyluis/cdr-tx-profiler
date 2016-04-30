var app = app || {};

(function() {
	'use strict';

	app.init = function() {
		this.designDay = designDay;
		this.model = new this.Model(airports, airlines, aircraft);
		this.passengers = []
	}
	app.run = function() {
		for (var d=0; d<designDay.length; d++) {
			this.passengers.push(new this.Flight(this.designDay[d], 0.90).getPassengers());
		}
	}
	app.display = function() {
		this.view = new this.View();
	}

	app.View = function() {
		this.table = document.getElementById("passenger-timing-table");
		this.innerString = ""
		this.template = document.querySelector("#passenger-timing-template").innerHTML;
		this.elements = app.passengers.reduce(function(a,b) {
			return a.concat(b);
		},[])
		this.elements.forEach((function(element) {
			var string = this.template.replace('%flightName%', element.flightName)
				.replace('%flightCode%', element.flightCode)
				.replace('%gate%', element.gate)
				.replace('%passengerType%', element.passengerType)
				.replace('%airport%', element.airport)
				.replace('%departureLounge%', element.departureLounge)
				.replace('%boardingZone%', element.boardingZone)
				.replace('%boarding%', element.boarding)
				.replace('%departure%', element.departureTime);
			this.innerString+=string;
		}).bind(this));
		this.table.innerHTML+=this.innerString;
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
			for (var i=0; i<this.profile.length; i++) {
				matrix.push(this.profile[i].map((function(percentage) {
					return Math.round(this.aircraft.seats*percentage/100);
				}).bind(this)));
			}
			return matrix;
		}
		this.getPassengerArray = function() {
			var pArray = []
			for (var i=0; i<=this.aircraft.seats; i++) {
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