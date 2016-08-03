importScripts('lib/aviation.js', 'lib/d3.v3.min.js');

function isNull(obj) {

	var is = true;

	for (var key in obj) {
		if (obj[key] !== null) is = false;
	}

	return is;
}

function parse(obj) {
	return Object.keys(obj).reduce(function(o, k) {
			if(Number(obj[k])) {
				o[k] = Number(obj[k]);
			} else if (obj[k].toLowerCase().match(/false|true/)) {
				o[k] = obj[k].toLowerCase().match(/false/)
					? false
					: true;
			} else if (obj[k].length === 0) {
				o[k] = null;
			} else {
				o[k] = obj[k];
			}

			return o;

		}, {});
}

function wrangleGateLayoutData (gateLayoutData) {

	return gateLayoutData.reduce(function(arr, gate) {

		gate = parse(gate);

		if (isNull(gate)) return arr;

		var g = {

			'name' : gate['NAME'],
			'isMARS' : gate['MARS'],
			'seats' : gate['SEATS'],
			'waiting' : gate['SFWAIT'],
			'boarding' : gate['SFBOARD'],
			'designGroup' : gate['GR'],
			'designGroupMARS' : gate['GRMARS'] ? gate['GRMARS'] : null,
			'sub' : gate['MARS'] ? [gate['SUBA'], gate['SUBB']] : null,
		};

		arr.push(g);

		return arr;
		
	}, []);
}

var gateLayoutFilePath = '../doc/gatelayout.csv',
	gateLayout;

self.addEventListener('message', function(e) {

	d3.csv(gateLayoutFilePath, function(responseText) {

		gateLayout = wrangleGateLayoutData(responseText);

		e.data.gates = gateLayout;

		aviation.clear();
		aviation.set(e.data, function() {

			self.postMessage({
				"passengers" : aviation.get.passengers().map(function(p) { return p.serialize(); }),
				"flights" : aviation.get.flights().map(function(f) { return f.serialize(); })
			});
		});
	});

}, false);