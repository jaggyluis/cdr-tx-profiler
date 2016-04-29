var app = app || {};

(function() {
	'use strict';

	app.init = function() {
		this.csv = "FLight Name,Flight code,Gate,Passenger Type,Airport,Departure lounge,Barding zone,Boarding,Departure/n";
		this.out = [];
		this.designDay = designDay;
		
		this.model = {
			'airports': airports,
			'airlines': airlines,
			'aircraft': aircraft
		}
		this.model.getAirportByCode = function(code) {
			return this.airports.filter(function(obj) {
				return obj.IATA == code;
			})[0];
		};
		this.model.getAirlineByCode = function(code) {
			return this.airlines.filter(function(obj) {
				return obj.IATA == code;
			})[0];
		};
		this.model.getAircraftByCode = function(code) {
			return this.aircraft.filter(function(obj) {
				return obj.IATA == code;
			})[0];
		};
	}
	app.run = function() {
		this.flightBuilder(this.designDay[0]);

	}
	app.flightBuilder = function(flight) {
		var destination = this.model.getAirportByCode(flight.destination);
		var airline = this.model.getAirlineByCode(flight.airline);
		var aircraft = this.model.getAircraftByCode(flight.aircraft)

		var flightString = '%airline% to %municipality%, %plane%'
			.replace('%municipality%', destination.municipality)
			.replace('%airline%', airline.name)
			.replace('%plane%', aircraft.name);

		console.log(destination);
		console.log(airline);
		console.log(aircraft);
		console.log(flightString)
	}

	app.init();
	app.run();
})();