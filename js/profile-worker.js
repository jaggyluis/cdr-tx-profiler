importScripts('lib/aviation/aviation.airports.js',
	'lib/aviation/aviation.airlines.js',
	'lib/aviation/aviation.aircraft.js',
	'lib/aviation/aviation.tt.js',
	'lib/aviation/aviation.core.js',
	'lib/numeric/numeric-1.2.6.js');

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
			'am' : AVIATION.time.toDecimalDay(passenger['DEPTIME']) < 0.375 ? 
				'pre9AM' : 
				'post9AM',
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
function wranglePropensityData (propensityData) {

	var pts = propensityData.map(function(p) {

		return {
			x : p.buy,
			y : p.browse
		}

	});
	var order = 1;
	var xArr = pts.map(function(pt) {

	    return pt.x;
	})
	var yArr = pts.map(function(pt) {

	    return pt.y;
	})
	var xMatrix = [];
	var xTemp = [];
	var yMatrix = numeric.transpose([yArr]);

	for (j=0;j<xArr.length;j++) {
	    xTemp = [];
	    for(i=0;i<=order;i++)
	    {
	        xTemp.push(1*Math.pow(xArr[j],i));
	    }
	    xMatrix.push(xTemp);
	}
	var xMatrixT = numeric.transpose(xMatrix);
	var dot1 = numeric.dot(xMatrixT,xMatrix);
	var dotInv = numeric.inv(dot1);
	var dot2 = numeric.dot(xMatrixT,yMatrix);
	var solution = numeric.dot(dotInv,dot2);

	var fn = function(x) {

	    var y = 0;

	    for (var i=0; i<solution.length; i++) {
	      y+= solution[i] * Math.pow(x, i);
	    }

	    if (y < 0) {
	    	
	    	y =  0;
	    
	    } else if (y > 1) {

	    	y = 1;
	    }

	    return y;
	    
	}

	return fn;
}

var designDayFilePath = 'var/sfo/designday.json',
	designDayData;

var passengerFilePath = 'var/sfo/passengers/',
	passengerFiles = ['p13.json', 'p14.json', 'p15.json'],
	passengerData = [];

var lexiconFilePath = 'var/sfo/passengers/lexicon.json',
	lexiconData;

var propensityFilePath = 'var/dia/passengers/propensities.json',
	propensityData,
	propensityfunc;

var typeData = ['di', 'type', 'dt']; //, 'am', 'bags'


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

							});
			    			designDayData = wrangleDesignDayData(JSON.parse(responseText));
			    			propensityFunc = wranglePropensityData(propensityData);

			    			var timeSlice = e.data.timeSlice;

			   				profiler = AVIATION.class.Profiler(passengerData, designDayData, typeData, timeSlice, propensityFunc);

							self.postMessage({
								"flights" : designDayData.filter(function(f) { return (f.ba === 1 && f.dep === true); }),
								"passengerProfiles" : profiler.passengerProfiles.map(function(p) { return p.serialize(); }),
								"flightProfiles" : profiler.flightProfiles.map(function(f) { return f.serialize(); }),
							});

							close();
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


