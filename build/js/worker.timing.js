importScripts('lib/aviation.min.js');

var gateLayoutFilePath = 'var/sfo/gatelayout.json',
	gateLayout;

self.addEventListener('message', function(e) {

	loadFile(gateLayoutFilePath, function(responseText) {

		gateLayout = JSON.parse(responseText);

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

function loadFile(filePath, done) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () { return done(this.responseText); };
    xhr.open("GET", filePath, true);
    xhr.send();
}
