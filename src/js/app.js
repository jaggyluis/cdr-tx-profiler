var app = app || {};

(function() {
	'use strict';

	app.init = function() {
		this.designDay = designDay;
		this.model = new this.Model(airports, airlines, aircraft);
		this.passengers = []
	}
	app.run = function() {
		for (var d=0; d<2; d++) {
			this.passengers.push(new this.Flight(this.designDay[d], 0.90).getPassengers());
		}
	}
	app.display = function() {
		this.view = new this.View();
	}

	app.View = function() {
		this.table = document.getElementById("passenger-timing-table");
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
			this.table.innerHTML+=string;
			console.log(element);
		}).bind(this));
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
		this.destination = app.model.getAirportByCode(flight.destination);
		this.airline = app.model.getAirlineByCode(flight.airline);
		this.aircraft = app.model.getAircraftByCode(flight.aircraft)
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
				arrTimes.push(i/100);
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
				pArray.push(new app.Passenger(this.getFlightName(), this.airline.IATA, flight.time));
			}
			return pArray;
		}
		this.getPassengers = function() {
			if (this.destination && this.airline && this.aircraft && this.profile) {

				var passengers = this.getPassengerArray();
				var passengerArrivalTimes = this.getArrivalTimes(app.model.pax.time);
				var passengerMatrix = this.getMovementMatrix();

				this.getMovementMatrix().forEach(function(arr, index) {
					var count=0;
					for (var i=0; i<=arr.length; i++) {
						for (var j=0; j<arr[i]; j++) {
							passengers[count][app.model.pax.legend[index]] = passengers[count].departureTime-passengerArrivalTimes[i];
							count++;
						}
					}
				})
				return passengers;
			}
			return [];
		}
	}

	app.Passenger = function(flightName, flightCode, departureTime) {

		var types = ["Leisure", "Assisted", "Business", "Unique", "Family"]

		this.flightName = flightName;
		this.flightCode = flightCode;
		this.departureTime = departureTime;
		this.passengerType = types[Math.floor(Math.random() * (4 - 0 + 1)) + 0];
		this.gate = 0;
	}

	app.init();
	app.run();
	app.display();

})();