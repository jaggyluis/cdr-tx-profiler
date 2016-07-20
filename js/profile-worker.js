importScripts('lib/aviation/airports.js',
	'lib/aviation/airlines.js',
	'lib/aviation/aircraft.js',
	'lib/aviation/tt.js',
	'lib/aviation/aviation.js');

function wrangleDesignDayData (flightArray) {

	return flightArray.map(function(flight) {

		return  {

			'airline' : flight['OPERATOR'],
			'aircraft' : flight['AIRCRAFT'],
			'seats' : flight['SEAT CONFIG.'],
			'tt' : flight['TT'],
			'time' : flight['D TIME'],
			'di' : flight['D D/I'] === 'D' ? 'domestic' : 'international',
			'flight' : flight['D FLIGHT #'],
			'destination' : flight['DEST.'],
			'ba' : flight['Analysis Boarding Area'],
			'dep' : flight['DEP'] === 1 ? true : false

		};

	}).filter(function(flight) {

		return (flight.ba === 1 && flight.dep === true);
	});
};
function wranglePassengerData (passengerArray, flightArray, lexicon) {

	return passengerArray.map(function(passenger) {

		var p =  {

			'airline' : lexicon['AIRLINE'][passenger['AIRLINE']],
			'destination' : lexicon['DESTINATION'][passenger['DEST']],
			'arrival' : AVIATION.time.toDecimalDay(passenger['ARRTIME']),
			'departure' : AVIATION.time.toDecimalDay(passenger['DEPTIME']),
			'di' : passenger['DESTGEO'] < 4 ? 'domestic' : 'international',
			'type' : null,
			'isTransfer' : false,
			'weight' : passenger['WEIGHT'],
			//'ba' : passenger['BAREA'],
			'gate' : passenger['GATE'],
			'bags' : passenger['Q4BAGS'] === 1 ? true : false,
			'shop' : passenger['Q4STORE'] === 1 ? true : false,
			'food' : passenger['Q4FOOD'] === 1 ? true : false,
		}

		for (var i=1; i<=3; i++) {
			
			var type = p['Q2PURP'+i.toString()];

			if (type === 1){
				p['type'] = 'business';
			} else if (type === 2 || type === 3 || type === 4 || type === 5 || type === 6) {
				p['type'] = 'leisure';
			} else {
				p['type'] = 'other';
			}
		}

		for (var i=0; i<3; i++) {

			var arr = p['Q3GETTO'+i.toString()];

			if (arr === 3) p['isTransfer'] = true;
		}

		return p;

	}).filter(function(passenger) {

		if (passenger.arrival && passenger.departure) {

			var t = passenger.departure - passenger.arrival;

			if (t < (6/24) && t > (0.5/24)) {
				
				/*
				return passenger.ba == 'B' || (passenger.gate >= 20 && passenger.gate <= 39) ||
						passenger.ba == 'C' || (passenger.gate >= 40 && passenger.gate <= 48);
				*/

				return true;
			}
		}

		return false;

	})
}

var designDayFilePath = 'var/sfo/designday.json',
	designDay;

var passengerFilePath = 'var/sfo/passengers/',
	passengerFiles = ['p13.json', 'p14.json', 'p15.json'],
	passengerData = [];

var lexiconFilePath = 'var/sfo/passengers/lexicon.json',
	lexicon;

var propensityFilePath = 'var/dia/passengers/propensities.json',
	propensities;


self.addEventListener('message', function(e) {

	passengerFiles.forEach(function (file, i) {

	    loadFile(passengerFilePath+file, function (responseText) {
	        
	        passengerData = passengerData.concat(JSON.parse(responseText));

	        if (i === passengerFiles.length-1) {

		    	loadFile(lexiconFilePath, function(responseText) {

		    		lexicon = JSON.parse(responseText);

		    		loadFile(propensityFilePath, function(responseText) {

		    			propensities = JSON.parse(responseText);

		    			loadFile(designDayFilePath, function(responseText) {

			    			designday = wrangleDesignDayData(JSON.parse(responseText));
			    			passengerData = wranglePassengerData(passengerData, designday, lexicon);

			    			console.log(passengerData);

							var	profileBuilder = new ProfileBuilder(passengerData, designDay);

							profileBuilder.run(e.data.terminalFilter, e.data.timeSlice, function(data) {

								self.postMessage({
									"profiles" : profileBuilder.getProfiles(),
									"flights" : designDay,
									"types" : profileBuilder.getTypes(),
									"gates" : gateLayout
								});

							});

			    		})
		    		})
		    	});
	    	}
	    });
	});
}, false);

function loadFile(filePath, done) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () { return done(this.responseText) }
    xhr.open("GET", filePath, true);
    xhr.send();
}


