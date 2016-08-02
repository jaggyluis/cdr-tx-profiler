importScripts('lib/aviation.airports.js',
	'lib/aviation.airlines.js',
	'lib/aviation.aircraft.js',
	'lib/aviation.tt.js',
	'lib/aviation.core.js');

var gateLayoutFilePath = 'var/sfo/gatelayout.json',
	gateLayout;

self.addEventListener('message', function(e) {

	loadFile(gateLayoutFilePath, function(responseText) {

		gateLayout = JSON.parse(responseText);

		e.data.gates = gateLayout;

		AVIATION.clear();

		AVIATION.set(e.data, function() {

			self.postMessage({
				"passengers" : AVIATION.get.passengers().map(function(p) { return p.serialize(); }),
				"flights" : AVIATION.get.flights().map(function(f) { return f.serialize(); })
			});
		});
	});

}, false);

function loadFile(filePath, done) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () { return done(this.responseText); };
    xhr.open("GET", filePath, true);
    xhr.send();
}
