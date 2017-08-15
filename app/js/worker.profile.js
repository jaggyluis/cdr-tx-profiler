importScripts('lib/aviation.min.js', 'lib/numeric.js', 'lib/d3.v3.min.js');

function loadFile(filePath, done) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () { return done(this.responseText); };
    xhr.open("GET", filePath, true);
    xhr.send();
}

function wrangleDesignDayData (designDayData) {

	//
	// SFO specific turnaround time calculator
    //

	function calcTT(flight) {

		var minTurnaroundTime = 35; // min

		var tt = flight['TT'],
			nt,
			gt = [],
			st = [],
			curr = [],
			i;

		Object.keys(flight).forEach(function(key) {
			if (!isNaN(Number(key))) gt.push(Number(flight[key]));
		})
		
		for (i=0; i<gt.length; i++) {
			if (gt[i] !== 0){
				curr.push(gt[i])
			} else {
				if (gt[i-1] !== 0 && gt[i-1] !== undefined) {
					st.push(curr.slice());
					curr = [];
				}
			}
		}

		nt = st.pop();

		if (nt === undefined) {
			nt = null;
		} else {
			nt = (nt.length * 5) - 20;
			nt = nt > minTurnaroundTime //
				? aviation.core.time.minutesToDecimalDay(nt)
				: null;
		}
		if (!tt) {
			tt = null;
		}
		else {
			tt = aviation.core.time.toDecimalDay(tt);
		}

		tt = tt !== null && nt !== null
			? tt <= nt
				? tt
				: nt
			: tt !== null
				? tt
				: nt !== null
					? nt
					: null

		return tt;
	}

	return designDayData.reduce(function(arr, flight) {

		flight = aviation.core.obj.parse(flight);

		if (aviation.core.obj.isNull(flight)) return arr;

		var f = {

			'airline' : flight['OPERATOR'],
			'aircraft' : flight['AIRCRAFT'],
			'seats' : flight['SEAT CONFIG.'],
			'tt' :  calcTT(flight),
			'time' : flight['D TIME'] ? aviation.core.time.toDecimalDay(flight['D TIME']) : null,
			'di' : flight['D D/I'] === 'D' ? 'domestic' : 'international',
			'flight' : flight['D FLIGHT #'],
			'destination' : flight['DEST.'],
			'ba' : flight['Analysis Boarding Area'],
			'dep' : flight['DEP'] === 1 ? true : false

		};

		arr.push(f);

		return arr;

	}, []);
}

function wranglePassengerData(passengerData, lexicon) {

    function getAirline(passenger) {
        return lexicon['AIRLINE'][passenger['AIRLINE']]; // TODO - BROKEN!!!
    }

    function getDestination(passenger) {
        return lexicon['DEST'][passenger['DEST']]; // TODO - BROKEN!!!
    }

    function getArrival(passenger) {
        return aviation.core.time.toDecimalDay(passenger['ARRTIME']);
    }

    function getDeparture(passenger) {
        return aviation.core.time.toDecimalDay(passenger['DEPTIME']);
    }

    function getPurpose(passenger) {

        var purps = [passenger['PURP1'], passenger['PURP2'], passenger['PURP3']];
        var vals = purps.map(function (p) {
            return lexicon['PURP'][p];
        })
        return vals[0] || 'other';
    }

    function getAMPM(passenger) {
        return aviation.core.time.toDecimalDay(passenger['DEPTIME']) < 0.375 ? 'pre9AM' : 'post9AM'
    }

    function getDomesticInternational(passenger) {
        return lexicon['DESTGEO'][passenger['DESTGEO']];
    }

    function getDepartingTransfer(passenger) {
        var gettos = [passenger['GETTO1'], passenger['GETTO2'], passenger['GETTO3']];
        var vals = gettos.map(function (g) {
            return g === 3 ? 'transfer' : 'departing'; // TODO - replace with lexicon
        })
        return vals.includes('transfer') ? 'transfer' : 'departing';
    }

    function getGender(passenger) {
        return lexicon['GENDER'][passenger['GENDER']];
    }

    function getTerminal(passenger) {

        if (passenger["TERMINAL"] != undefined) {
            return "terminal-" + passenger["TERMINAL"];
        }

        if (passenger["BAREA"] != undefined) {
            return "terminal-" + lexicon["BAREA"][passenger["BAREA"]];
        }

        var gateRanges = Object.keys(lexicon["GATE"]);
        var gateRange = null;

        gateRanges.forEach(function (range) {
            
            var domain = range.split('-');

            if (Number(domain[0]) < passenger["GATE"] && Number(domain[1]) > passenger["GATE"]) {
                gateRange = range;
            }
        })

        return "terminal-" + lexicon["BAREA"][lexicon["GATE"][gateRange]];
    }

    function getWeight(passenger) {
        return passenger['WEIGHT'] ? passenger['WEIGHT'] : 1;
    }

    function getGate(passenger) {
        return passenger['GATE'];
    }

    function getBags(passenger) {
        return lexicon['BAGS'][passenger['BAGS']];
    }

    function getShop(passenger) {
        return lexicon['SHOP'][passenger['SHOP']];
    }

    function getFood(passenger) {
        return lexicon['FOOD'][passenger['FOOD']];
    }

    function getPreCheck(passenger) {
        return lexicon['TSAPRE'][passenger['TSAPRE']];
    }

    function getAge(passenger) {

        if (passenger['AGE'] === null) {
            return null;
        }

        var ageRange = lexicon['AGE'][passenger['AGE']];

        if (ageRange != undefined) {
            return Number(ageRange.split(/[-<]/)[0]);
        } else {
            return Number(passenger['AGE'].split(/[-<]/)[0]);
        }
    }

    function getPet(passenger) {
        return lexicon['PET'][passenger['PET']];
    }

	return passengerData.reduce(function(arr, passenger) {

		passenger = aviation.core.obj.parse(passenger);

		if (aviation.core.obj.isNull(passenger)) return arr;

		var p =  {

		    'airline': getAirline(passenger),
		    'destination' : getDestination(passenger),
		    'arrival' : getArrival(passenger),
		    'departure' : getDeparture(passenger),
		    'am': getAMPM(passenger) ,
		    'di': getDomesticInternational(passenger),
		    'dt' : getDepartingTransfer(passenger),
		    'type' : getPurpose(passenger),
		    'gender' : getGender(passenger),
			'weight' : getWeight(passenger),
			'gate' : getGate(passenger),
			'bags': getBags(passenger),
			'shop': getShop(passenger),
			'brshop' : null,
			'food': getFood(passenger),
			'brfood': null,
			'terminal': getTerminal(passenger),
			'tsapre': getPreCheck(passenger),
            'age': getAge(passenger),
            'home' : null,
			'pet':  getPet(passenger),
            'frequent' : null,
		};

		arr.push(p);

		return arr;

	}, []);
}

function wranglePropensityData (propensityData) {

	var pts = propensityData.reduce(function(arr, passenger) {

		passenger = aviation.core.obj.parse(passenger);

		if (aviation.core.obj.isNull(passenger)) return arr;

		var p =  {
			x : passenger.buy,
			y : passenger.browse
		};

		arr.push(p);

		return arr;

	}, []);

	//
	// From somewhere on stackOverflow - not sure
    //

	var order = 1;
	var xArr = pts.map(function(pt) {

	    return pt.x;
	});
	var yArr = pts.map(function(pt) {

	    return pt.y;
	});
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
	    
	};

	return fn;
}

var designDayFilePath = '../doc/designday.csv',
	designDayData;

var passengerFilePath = '../doc/passengerdata/sfo/',
	passengerFiles = [/*'p11.csv', 'p12.csv', 'p13.csv', 'p14.csv', 'p15.csv', */'p16.csv'],
	passengerData = [];

var lexiconFilePath = '../doc/passengerdata/sfo/lexicon.json',
	lexiconData;

var propensityFilePath = '../doc/passengerdata/dia/propensities.csv',
	propensityData,
	propensityfunc;

var typeData = ['di', 'type', 'dt', 'am' /*,'bags'*/],
	timeSlice;

self.addEventListener('message', function(e) {

    passengerFiles.forEach(function (file, i) {

        console.log(file);

	    d3.csv(passengerFilePath+file, function (responseText) {
	        
	        passengerData = passengerData.concat(responseText);

	        if (i === passengerFiles.length-1) {

		    	loadFile(lexiconFilePath, function(responseText) {

		    		lexiconData = JSON.parse(responseText);

		    		d3.csv(propensityFilePath, function(responseText) {

		    			propensityData = responseText;

		    			d3.csv(designDayFilePath, function (responseText) {

		    			    console.log("passenger count : " + passengerData.length);

		    				passengerData = wranglePassengerData(passengerData, lexiconData);
		    				passengerData = passengerData.filter(function(passenger) {

								if (passenger.arrival && passenger.departure) {

									var t = passenger.departure - passenger.arrival;

									//
									// 	Passenger cleanup - valid passenger data for analysis is between
									//	30 min and 6 hours in the airport.
									//

									if (t < (6/24) && t > (0.5/24)) {
										
										return true;
									}
								}

								return false;

		    				});

			    			designDayData = wrangleDesignDayData(responseText);
			    			propensityFunc = wranglePropensityData(propensityData);
			    			timeSlice = e.data.timeSlice;
			   				profiler = aviation.profiles.Profiler(passengerData, designDayData, typeData, timeSlice, propensityFunc);
			   				profiler.buildProfiles();

			   				designDayData = designDayData.filter(function(flight) {

			   					//
			   					//	Flight cleanup - Boarding Area 1 / departing
			   					//	Delta - BAC / Other - BAB
			   					//

			    				if (flight.ba === 1 && flight.dep === true) {

			    					flight.ba = flight.airline === 'DL' ? 'C' : 'B';

			    					return true;
			    				}

			    				return false;
			    			})

							self.postMessage({
								"flights" : designDayData,
								"passengerProfiles" : profiler.passengerProfiles.map(function(p) { return p.serialize(); }),
								"flightProfiles" : profiler.flightProfiles.map(function(f) { return f.serialize(); }),
							});

							close();
			    		});
		    		});
		    	});
	    	}
	    });
	});
}, false);



