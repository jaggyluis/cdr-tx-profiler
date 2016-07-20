


function Profiler(passengerArray, attributes) {

	this.passengers = passengerArray;
	this.attributes = attributes;

	console.log(attributes);

	this.filter();
	this.permute();


}
Profiler.prototype = {

	filter : function() {

		var attributes = this.attributes.reduce(function(dict, attr) {

			dict[attr] = new Set();

			return dict;

		}, {});

		var flights = {};

		for (var i=0; i<this.passengers.length; i++) {
			for (var attr in attributes) {
				attributes[attr].add(this.passengers[i][attr]);
			}
		}
		this.attributes = attributes;

	},
	cluster : function () {

	},
	permute : function () {

		var self = this,
			attributes = Object.keys(this.attributes).map(function(key) {

			return Array.from(self.attributes[key]);
		})

		var nList = [];

		for (var i=attributes.length-1; i>0; i--) {
			for (var j=0; j<attributes[i].length; j++) {
				for (var k=0; k<attributes[i-1].length; k++) {
					console.log(attributes[i][j], attributes[i-1][k]);
				}
			}
		}
		console.log(nList);	

	}


}