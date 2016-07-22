importScripts('lib/aviation/airports.js',
	'lib/aviation/airlines.js',
	'lib/aviation/aircraft.js',
	'lib/aviation/tt.js',
	'lib/aviation/aviation.js',
	'profiler.js');

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
			'dep' : flight['DEP'] === 1 ?true : false

		};

	});
};
function wranglePassengerData (passengerArray, lexicon) {

	return passengerArray.map(function(passenger) {

		var p =  {

			'airline' : lexicon['AIRLINE'][passenger['AIRLINE']],
			'destination' : lexicon['DESTINATION'][passenger['DEST']],
			'arrival' : AVIATION.time.toDecimalDay(passenger['ARRTIME']),
			'departure' : AVIATION.time.toDecimalDay(passenger['DEPTIME']),
			'di' : passenger['DESTGEO'] < 4 ? 'domestic' : 'international',
			'dt' : [passenger['Q3GETTO1'],passenger['Q3GETTO2'],passenger['Q3GETTO3']].includes(3) ? 
				'transfer' : 
				'departing',
			'type' : [passenger['Q2PURP1'],passenger['Q2PURP2'],passenger['Q2PURP3']].includes(1) ? 
				'business' : [passenger['Q2PURP1'],passenger['Q2PURP2'],passenger['Q2PURP3']].includes(2) ? 
				'leisure' : 
				'other',
			'weight' : passenger['WEIGHT'] ? passenger['WEIGHT'] : 1,
			'gate' : passenger['GATE'],
			'bags' : passenger['Q4BAGS'] === 1 ? true : false,
			'shop' : passenger['Q4STORE'] === 1 ? true : false,
			'brshop' : null,
			'food' : passenger['Q4FOOD'] === 1 ? true : false,
			'brfood' : null,
		}

		return p;

	});
}

var designDayFilePath = 'var/sfo/designday.json',
	designDayData;

var passengerFilePath = 'var/sfo/passengers/',
	passengerFiles = ['p13.json', 'p14.json', 'p15.json'],
	passengerData = [];

var lexiconFilePath = 'var/sfo/passengers/lexicon.json',
	lexiconData;

var propensityFilePath = 'var/dia/passengers/propensities.json',
	propensityData;


self.addEventListener('message', function(e) {

	passengerFiles.forEach(function (file, i) {

	    loadFile(passengerFilePath+file, function (responseText) {
	        
	        passengerData = passengerData.concat(JSON.parse(responseText));

	        if (i === passengerFiles.length-1) {

		    	loadFile(lexiconFilePath, function(responseText) {

		    		lexiconData = JSON.parse(responseText);

		    		loadFile(propensityFilePath, function(responseText) {

		    			propensityData = JSON.parse(responseText);

		    			loadFile(designDayFilePath, function(responseText) {

		    				passengerData = wranglePassengerData(passengerData, lexiconData);
		    				passengerData = passengerData.filter(function(passenger) {

								if (passenger.arrival && passenger.departure) {

									var t = passenger.departure - passenger.arrival;

									if (t < (6/24) && t > (0.5/24)) {
										
										return true;
									}
								}

								return false;

							})

			    			designDayData = wrangleDesignDayData(JSON.parse(responseText));

			    			var typeData = ['di', 'type', 'dt'],
			   					profiler = new Profiler(passengerData, designDayData, typeData);


							designDayData = designDayData.filter(function(flight) {

								return (flight.ba === 1 && flight.dep === true);

							});
							
							//console.log(profiler);

							close();

							/*
							profileBuilder.run(e.data.terminalFilter, e.data.timeSlice, function(data) {

								self.postMessage({
									"profiles" : profileBuilder.getProfiles(),
									"flights" : designDay,
									"types" : profileBuilder.getTypes(),
									"gates" : gateLayout
								});

							});
							*/

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


