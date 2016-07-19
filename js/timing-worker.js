importScripts('lib/aviation/airports.js',
	'lib/aviation/airlines.js',
	'lib/aviation/aircraft.js',
	'lib/aviation/tt.js',
	'lib/aviation/aviation.js');

self.addEventListener('message', function(e) {

	AVIATION.set(e.data, function() {

		self.postMessage({
			"passengers" : AVIATION.get.passengers(),
			"flights" : AVIATION.get.flights()
		});
	})

})