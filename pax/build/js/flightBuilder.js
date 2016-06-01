var app = app || {};

(function() {

	app.FlightBuilder = function(designDay) {

		this.designDay = designDay;
		this.flights = this.filterFlightsByTerminal(this.designDay, '1');
		this.flights = this.filterFlightsByDeparture(this.flights);
		this.flights = this.formatFlights(this.flights);
	}
	app.FlightBuilder.prototype = {

		filterFlightsByTerminal : function(flights, terminal) {
			return flights.filter(function(flight) {
				return flight['Analysis Boarding Area'] === 1;
			});
		},
		filterFlightsByDeparture : function(flights){
			return flights.filter(function(flight) {
				return flight['DEP'] === 1;
			});
		},
		formatFlights : function (flights)  {
			return flights.map((function(flight) {
				return this.formatFlight(flight);
			}).bind(this));
		},
		formatFlight : function (flight) {

			return {
				airline : flight['OPERATOR'],
				aircraft : flight['AIRCRAFT'],
				seats : flight['SEAT CONFIG.'],
				tt : flight['TT'],
				time : flight['D TIME'],
				di : flight['D D/I'] === 'D' ? 'domestic' : 'international',
				flight : flight['D FLIGHT #'],
				destination : flight['DEST.']
			}
		},
		getFlights : function() {
			return this.flights;
		}
	}
	
})();