
//--------------------------------------------------------
// main view
//--------------------------------------------------------
'use strict';

function View() {

		this.table = document.getElementById("passenger-timing-table");
		this.header = document.querySelector("#passenger-timing-header").innerHTML;
		this.template = document.querySelector("#passenger-timing-template").innerHTML;
		this.data = null;
		this.keys = [ // Probably a better spot for this - passed in?
			'flightName', 
			'flightCode',
			'gate',
			'passengerType',
			'gender',
			'airport',
			'departureLounge',
			'boardingZone',
			'boarding',
			'departureTime'];


		this.runButton = document.getElementById("run");
		this.runButton.addEventListener('click', (function() {
			app.run();
		}).bind(this));
		this.runButton.addEventListener('mousedown',function() {
			var loading = document.getElementById("run-icn");
			loading.classList.toggle("hidden");
		});
		this.runButton.addEventListener('mouseup',function() {
			var loading = document.getElementById("run-icn");
			loading.classList.toggle("hidden");
		});

		this.downloadJSONButton = document.getElementById("downloadJSON");
		this.downloadJSONButton.addEventListener('click', (function() {
			this.downloadJSON();
		}).bind(this));
		this.downloadJSONButton.addEventListener('mousedown',function() {
			var loading = document.getElementById("json-icn");
			loading.classList.toggle("hidden");
		});
		this.downloadJSONButton.addEventListener('mouseup',function() {
			var loading = document.getElementById("json-icn");
			loading.classList.toggle("hidden");
		});

		this.downloadCSVButton = document.getElementById("downloadCSV");
		this.downloadCSVButton.addEventListener('click', (function() {
			this.downloadCSV();
		}).bind(this));
		this.downloadCSVButton.addEventListener('mousedown',function() {
			var loading = document.getElementById("csv-icn");
			loading.classList.toggle("hidden");
		});
		this.downloadCSVButton.addEventListener('mouseup',function() {
			var loading = document.getElementById("csv-icn");
			loading.classList.toggle("hidden");
		});

		this.showResultsButton = document.getElementById("showResults");
		this.showResultsButton.addEventListener('click', (function() {
			this.showResults();
		}).bind(this));
		this.showResultsButton.addEventListener('mousedown',function() {
			var loading = document.getElementById("show-icn");
			loading.classList.toggle("hidden");
		});
		this.showResultsButton.addEventListener('mouseup',function() {
			var loading = document.getElementById("show-icn");
			loading.classList.toggle("hidden");
		});
};
View.prototype = {

	init : function() {
		this.clearAll();
		this.initFileUploader();
	},

	enableDownloads : function() {
		document.getElementById("downloadJSON").disabled = false;
		document.getElementById("downloadCSV").disabled = false;
		document.getElementById("showResults").disabled = false;
	},

	showResults : function() {
		this.clearAll();
		this.displayTable();
	},

	clearAll : function() {
		this.table.innerHTML = this.header;
	},

	getFlightFilter : function() {
		return document.getElementById("filter-flights").value;
	},

	getPassengerFilter : function() {
		return document.getElementById("filter-passengers").value;
	},

	getTimeFrame : function() {
		var timeFrame = document.getElementById('timeFrame')
			.value.split(" to ")
			.map(function (str) {
			return Number(str);
		});
		if (timeFrame.length == 2 && 
			!isNaN(timeFrame[0] &&
			!isNaN(timeFrame[1]))) {
			return timeFrame;
		} else {
			return [0, 24];
		}
	},

	getLoadFactor : function () {
		var loadFactor = document.getElementById("loadFactor").value;
		if (loadFactor>0 && loadFactor<=1) {
			return loadFactor;
		} else {
			return 1;
		}
	},

	displayTable : function() {
		var innerString = "";
		this.data.forEach((function(passenger, idx) {
			var passengerString = this.template;
			this.keys.forEach(function(key) {
				passengerString = passengerString.replace('%'+key+'%', passenger[key]);
			})
			innerString+=passengerString;
		}).bind(this));
		this.table.innerHTML+=innerString;
	},

	downloadJSON : function() {
		/*
		 * modified from
		 * http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
		 */
		var a = document.createElement("a");
		var file = new Blob([JSON.stringify(this.data)], {type:'text/plain'});
		a.href = URL.createObjectURL(file);
		a.download = 'PassengerTimingProfiles.json';
		a.click();
	},

	readJSON : function(fileStr) {
		try {
			return JSON.parse(fileStr);
		} catch (e) {
			return null;
		}
	},

	serializeJSON : function(json) {
		return json.reduce((function(a,b) {
			return a+(this.keys.map(function(key) {
				return '"'+b[key]+'"';
			}).join(',')+'\n');
		}).bind(this), this.keys.join(',')+'\n');
	},

	downloadCSV : function() {
		var a = document.createElement("a");
		var file = new Blob([this.serializeJSON(this.data)], {type:'text/plain'});
		a.href = URL.createObjectURL(file);
		a.download = 'PassengerTimingProfiles.csv';
		a.click();
	},

	readCSV : function(fileStr) {
		var parsed = fileStr.split('\n');
		var re = /[^\w\:\-]/gi;
		var keys = parsed[0].split(',').map(function(str) {
			return str.replace(re, "");
		});
		return parsed.slice(1).map(function(csvArray) {
			var flight = {};
			csvArray.split(',').map(function(str) {
				return str.replace(re, "");
			}).forEach(function(value, idx) {
				if (!isNaN(Number(value))) {
					flight[keys[idx]] =  Number(value);
				} else if (value.match(':')){
					flight[keys[idx]] = timeToDecimalDay(value);
				} else {
					flight[keys[idx]] = value;
				}
			});
			return flight;
		});
	},

	initFileUploader : function() {
		/*
		 * modified from
		 * http://www.htmlgoodies.com
		 * /html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html#fbid=fCs8ypx8lEd
		 */
		var self = this;
		var drop = document.getElementById('drop');
		drop.addEventListener('dragover', function (e) {
			if (e.preventDefault) { e.preventDefault(); }
		})
		drop.addEventListener('dragenter', function (e) {
			if (e.preventDefault) { e.preventDefault(); }
		})
		drop.addEventListener('drop', function (e) {
			if (e.preventDefault) { e.preventDefault(); }
			var reader = new FileReader();
			var fileName = e.dataTransfer.files[0].name;
			reader.addEventListener('loadend', function(e, file) {
				if (fileName.split('.')[1] === 'json' ) {
					app.set(self.readJSON(this.result));
				} else if (fileName.split('.')[1] === 'csv' ) {
					app.set(self.readCSV(this.result));
				}
				document.getElementById('run').disabled = false;
			});
			reader.readAsText(e.dataTransfer.files[0]);
			drop.innerText = fileName.toUpperCase();
		})
	}
};