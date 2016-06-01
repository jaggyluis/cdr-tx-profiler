var app = app || {};

(function() {

	app.View = function() {
			this.table = document.getElementById("passenger-timing-table");
			this.header = document.querySelector("#passenger-timing-header").innerHTML;
			this.template = document.querySelector("#passenger-timing-template").innerHTML;
			this.data = null;
			this.keys = [ 
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
			this.saveButton = document.getElementById("save");
			this.saveButton.addEventListener('click', (function() {
				this.save();
			}).bind(this));
			this.saveButton.addEventListener('mousedown',function() {
				var loading = document.getElementById("save-icn");
				loading.classList.toggle("hidden");
			});
			this.saveButton.addEventListener('mouseup',function() {
				var loading = document.getElementById("save-icn");
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
			this.checkboxes = Array.prototype.
				slice.call(document.getElementsByClassName("chk-toggle"));
			this.checkboxes.forEach((function(box) {
				box.addEventListener('click', (function() {
					this.checkboxes.forEach(function(other) {
						other.checked = false;
						box.checked = true;
					})
				}).bind(this));
			}).bind(this));
	};
	app.View.prototype = {
		init : function() {
			this.clear();
		},
		enableDownloads : function() {
			document.getElementById("save").disabled = false;
			document.getElementById("showResults").disabled = false;
		},
		enableRunButton : function() {
			document.getElementById("run").disabled = false;
		},
		showResults : function() {
			this.clear();
			this.displayTable();
		},
		clear : function() {
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
		save : function () {
			var type = this.checkboxes.filter(function(box) {
				return box.checked == true;
			})[0].id;
			switch (type) {
				case "json":
					this.downloadJSON();
					break;
				case "csv":
					this.downloadCSV();
					break;
				case "sum":
					this.downloadJSON(app._stash, 'logFile.json');
					break;
				case "txt":
					this.downloadTXT(AVIATION.stash.serialize(app._stash));
					break;
				default :
					break;
			};
		},
		downloadJSON : function(_data, _str) {
			/*
			 * modified from
			 * http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
			 */
			var data = _data || this.data;
			var a = document.createElement("a");
			var file = new Blob([JSON.stringify(data)], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = _str || 'PassengerTimingProfiles.json';
			a.click();
		},
		downloadTXT : function(_data, _str) {
			var data = _data || 'hello world';
			var a = document.createElement("a");
			var file = new Blob([data], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = _str || 'summary.txt';
			a.click();
		},
		downloadCSV : function() {
			var a = document.createElement("a");
			var file = new Blob([AVIATION.JSON.serialize(this.data, this.keys)], {type:'text/plain'});
			a.href = URL.createObjectURL(file);
			a.download = 'PassengerTimingProfiles.csv';
			a.click();
		},
		buildTables : function (typeBuilder) {

			var typeTable = document.getElementById('passenger-profile-table'),
				profileBox = document.getElementById('aircraft-profile-box'),
				totalBox = document.getElementById('total-box');

			totalBox.appendChild(this.buildTypeTable(typeBuilder.typeClass, []));
			typeBuilder.getTypes().forEach((function (type) {
				typeTable.appendChild(this.buildTypeTableRow(type));
			}).bind(this));
			typeBuilder.getProfiles().forEach((function (profile) {
				profileBox.appendChild(this.buildFlightTable(profile));
			}).bind(this));
		},
		buildTypeTable : function (typeObj, parents, weighted) {
			
			var template = document.getElementById('passenger-box-template').innerHTML,
				div = document.createElement('div');
				trace = parents.slice();

			div.innerHTML = template;

			var container = div.children[0],
				table = container.children[0],
				collapsed = container.children[2],
				expand = container.children[1],
				img = expand.children[0];

			table.appendChild(this.buildTypeTableRow(typeObj));
			
			var parent = table.children[1].children[0];
			var sub = [];

			typeObj._getTypes().forEach((function(type) {
				sub.push(this.buildTypeTable(typeObj[type], trace.concat([parent])));
			}).bind(this));

			if (sub.length !== 0) {
				expand.addEventListener('click', function() {
					collapsed.classList.toggle('collapsed');
					collapsed.classList.add('outlined-left')

					if (collapsed.classList.contains('collapsed')) {
						img.src = 'img/expand.png';
					} else {
						img.src = 'img/collapse.png';
					}
				});
				for (var s in sub ) collapsed.appendChild(sub[s]);
			} else {
				container.removeChild(expand);
				container.removeChild(collapsed);
			};
			table.addEventListener('mouseenter', function() {
				for (var i=0; i<parents.length; i++) {
					parents[i].classList.add('sel');
					parent.classList.add('sel');
				}
			});
			table.addEventListener('mouseleave', function() {
				for (var i=0; i<parents.length; i++) {
					parents[i].classList.remove('sel');
					parent.classList.remove('sel');
				}
			});

			return container;
		},
		buildTypeTableRow : function (typeObj, weighted) {

			var template = document.getElementById("passenger-type-template").innerHTML,
				row = document.createElement('tr');

			row.innerHTML += template.replace('%name%', typeObj._name)
								.replace('%name%', typeObj._name)
								.replace('%count%', typeObj._data.count)
								.replace('%percent%', typeObj._data.percentage)
								.replace('%food%', typeObj._data.food)
								.replace('%bags%', typeObj._data.bags)
								.replace('%shop%', typeObj._data.shop)
								.replace('%weighted%', typeObj._data.weighted);
			return row;
		},
		buildFlightTable : function (flightObj, weighted) {

			function insert(s, l, str) {
				return [str.slice(0, str.indexOf(l)), s, str.slice(str.indexOf(l))].join('');
			};
			function addClickEvent(nodeArray) {
				for (var i=0; i<nodeArray.length; i++) {
					if (nodeArray[i].id.match(/hook/)) {
						nodeArray[i].addEventListener('click', (function(a,b) {
							b.classList.toggle('collapsed');
							if (b.classList.contains('collapsed')) {
								a.children[0].src = 'img/expand.png';
							} else {
								a.children[0].src = 'img/collapse.png'
							}
						}).bind(undefined, nodeArray[i], nodeArray[i+1]))
					}
					addClickEvent(nodeArray[i].children);
				}
			};

			var boxTemplate = document.getElementById('flight-box-template').innerHTML,
				typeTemplate = document.getElementById('flight-type-template').innerHTML,
				flightTemplate = document.getElementById('flight-info-template').innerHTML,
				div = document.createElement('div'),
				weighted = weighted === undefined ? false : weighted,
				top = boxTemplate.replace(/%name%/g, flightObj._name),
				percs = flightObj._getPerc();

			for (var type in percs) {
				var rep = typeTemplate.replace(/%type%/g, flightObj._name+'.'+type)
									.replace(/%name%/g, flightObj._name)
									.replace(/%count%/, Object.keys(percs[type]).map(function(k) {
										return percs[type][k].count
									}).reduce(function(a,b) {
										return a+b;
									}, 0));
				for (var p in percs[type]) {
					var f = percs[type][p],
						st =  JSON.stringify(f.dist).replace(/[{}]/g, '');
						flight = flightTemplate.replace(/%name%/g, [flightObj._name, 
													p.split('.').slice(1)].join('.'))
										.replace(/%count%/g, f.count)
										.replace(/%percent%/g, f.percentage)
										.replace(/%weighted%/g, weighted)
										.replace(/%dist%/g, '--');
					rep = insert(flight, '<tl>', rep);
				}
				top = insert(rep, '<tt>', top);
			}
			div.innerHTML = top;
			addClickEvent(div.children[0].children);
			
			return div;
		}
	};

})();