aviation.get = {

    passengers: function (filter) {

        var passengers = [];

        aviation._flights.forEach(function (flight) {

            flight.getPassengers().forEach(function (passenger) {

				if ( filter === undefined || JSON.stringify(passenger.attributes).match(filter)) {
					passengers.push(passenger);
				}
			});
		});

		return passengers;
	},

	flights: function () {
		return aviation._flights;
	},

	gates: function () {
		return aviation._gates;
	},

	gateByName: function (name) {
		return aviation._gates.find(function(obj) { return obj.name == name; });
	},

	turnaroundTimes: function () {
		return aviation._tt;
	},

	passengerProfiles: function () {
		return aviation._passengerProfiles;
	},

	airportByCode: function (code) {
		return aviation._airports.find(function(obj) { return obj.IATA == code;	});
	},

	airlineByCode: function (code) {
		return aviation._airlines.find(function(obj) { return obj.IATA == code;	});
	},

	aircraftByCode: function (code) {
		return aviation._aircraft.find(function(obj) { return obj.IATA == code;	});
	},

	airportByString: function (str) {

	    var airports = aviation.core.array.filterStrict(aviation._airports, str);

		if (airports === undefined || airports.length === 0) airports = aviation.core.array.filterLoose(aviation._airports, str);

		return aviation.core.array.getBestMatch(airports, str);
	},

	flightProfileByAircraftType: function (type) {
		return aviation._flightProfiles.find(function(p) { return p.name === type; });
	},

	passengerProfileByType: function (type) {
		return aviation._passengerProfiles.find(function(p) { return p.name === type; });
	}
};