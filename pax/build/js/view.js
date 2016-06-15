var app = app || {};

(function() {

	app.View = function() {

			this.passengers = null;
			this.flights = null;
			this.profiles = null;
			this.keys = [ 
				'flightID',
				'passengerType',
				'gender',
				'arrivalTime',
				'departureLounge',
				'boardingZone',
				'boarding',
				'departureTime'];

			this._passengers=[];
			this._flights = [];
			this._profiles = [];
			this._aircraft = {};

			var self = this;

			this.runButtons = Array.prototype.slice.call(document.getElementsByClassName('run-btn'));
			this.runButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {

					btn.parentNode.children[1].classList.toggle('hidden');

					setTimeout(function() {
						if (btn.id == 'timing-btn') {
							app.run();
							self.buildResults();
							self.enableDownloads('#timing-box')
						}
						else if (btn.id == 'profile-btn') {
							app.compute();
							self.enableDownloads('#profile-box')
						}
						btn.parentNode.children[1].classList.toggle('hidden');
					},10);

				})
			});

			this.checkButtons = Array.prototype.slice.call(document.getElementsByClassName('chk-btn'));
			this.checkButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {
					var cls ='#'+btn.parentNode.parentNode.parentNode.parentNode
						.id+' .chk-btn';
					Array.prototype.slice.call(document.querySelectorAll(cls)).forEach(function(b){
						b.checked = false;
					})
					btn.checked = true;
				});
			});

			this.saveButtons = Array.prototype.slice.call(document.getElementsByClassName('save-btn'));
			this.saveButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {
					//this.save();
					var checked = Array.prototype.slice.call(this.parentNode.children)
						.filter(function(elem) {

							return elem.children.length !== 0 &&
								elem.children[0].checked == true;
						})[0].children[0];

					self.save(btn.id, checked.classList[1]);
				})
			});

			this.showButtons = Array.prototype.slice.call(document.getElementsByClassName('show-btn'));
			this.showButtons.forEach(function(btn) {
				btn.addEventListener('click', function() {
					btn.innerText = btn.innerText === 'Hide Results' ? 
						'Show Results' : 'Hide Results';
					btn.parentNode.parentNode.parentNode
						.children[1].classList.toggle('collapsed');
				});
				btn.addEventListener('mousedown', function(){
				});
				btn.addEventListener('mousedown', function(){
				});
			});
	};
	app.View.prototype = {
		
		init : function() {

			this.clear();
		},
		enableDownloads : function(id) {

			Array.prototype.slice.call(document.querySelectorAll(id+' .show-btn')).forEach(function(b){
				b.disabled = false;
			});
		},
		enableProfileRunButton : function() {

			document.querySelectorAll("#timing-box .run-btn")[0].disabled = false;
		},
		getTerminalFilter : function() {

			return document.getElementById("filter-terminal").value;
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
		save : function (id, type) {
						
			switch (type) {
				case "json":
					this.downloadJSON(this['_'+id], id);
					break;
				case "csv":
					var keys = Object.keys(this['_'+id][0])  
					this.downloadCSV(AVIATION.JSON.serialize(this['_'+id], keys), id);
				default :
					break;
			};
		},
		downloadJSON : function(data, name) {
			/*
			 * modified from
			 * http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
			 */
			var a = document.createElement("a");
			var file = new Blob([JSON.stringify(data)], {type:'text/plain'});

			a.href = URL.createObjectURL(file);
			a.download = name+'.json';
			a.click();
		},
		downloadTXT : function(data, name) {

			var a = document.createElement("a");
			var file = new Blob([data], {type:'text/plain'});

			a.href = URL.createObjectURL(file);
			a.download = name+'.txt';
			a.click();
		},
		downloadCSV : function(data, name) {

			var a = document.createElement("a");
			var file = new Blob([data], {type:'text/plain'});

			a.href = URL.createObjectURL(file);
			a.download = name+'.csv';
			a.click();
		},
		buildResults : function() {
			this.clear();
			this.buildPassengerTable();
			this.buildFlightTable();
		},
		clear : function() {

			var pTable = document.getElementById("passenger-timing-table"),
				pHeader = document.getElementById("passenger-timing-header").innerHTML,
				fTable = document.getElementById("flight-table"),
				fHeader = document.getElementById("flight-table-header").innerHTML;
			
			pTable.innerHTML = pHeader;
			fTable.innerHTML = fHeader;

		},
		clearTables : function() {

			var t = document.querySelector('#passenger-profile-table'),
				p = document.querySelector('#aircraft-profile-box .content-box'),
				b = document.querySelector('#total-box .result-box');

			t.innerHTML = "";
			p.innerHTML = "";
			b.innerHTML = "";

		},
		buildTables : function (typeBuilder) {

			var typeTable = document.getElementById('passenger-profile-table'),
				typeHeader = document.getElementById('passenger-type-header').innerHTML,
				profileBox = document.querySelector('#aircraft-profile-box .content-box'),
				totalBox = document.getElementById('total-box');

			//
			//	Build the total passenger profile table
			//
			totalBox.children[1].appendChild(this.buildTypeTable(typeBuilder.typeClass, []));
			typeTable.innerHTML+=typeHeader;
			//
			//	Build all of the unique passenger profile tables
			//
			typeBuilder.getTypes().forEach((function (type) {
				typeTable.appendChild(this.buildTypeTableRow(type, true));
			}).bind(this));
			//
			//	Build all of the flight profile tables
			//
			typeBuilder.getProfiles().forEach((function (profile) {
				profileBox.appendChild(this.buildProfileTable(profile));
			}).bind(this));
		},
		buildFlightTable : function () {

			var table = document.getElementById('flight-table'),
				template = document.querySelector('#flight-table-template').innerHTML,
				innerString = '',
				self = this;

			this.flights.forEach(function(flight, idx) {

				self._flights.push({
					name : flight.getFlightName(),
					code : flight.airline.IATA,
					id : flight.id,
					loadFactor : flight.loadFactor,
					seats : flight.flight.seats,
					count : flight.passengers.length,
					gate : flight.gate,
					time : AVIATION.time.decimalDayToTime(flight.getTime())
				});

				var flightString = template.replace('%name%', flight.getFlightName())
							.replace('%code%', flight.airline.IATA)
							.replace('%id%', flight.id)
							.replace('%loadFactor%', flight.loadFactor)
							.replace('%seats%', flight.flight.seats)
							.replace('%count%', flight.passengers.length)
							.replace('%gate%', flight.gate)
							.replace('%time%', AVIATION.time.decimalDayToTime(flight.getTime()));
				innerString+=flightString;
			});
			table.innerHTML+=innerString;
		},
		buildPassengerTable : function() {

			var table = document.getElementById('passenger-timing-table'),
				template = document.getElementById('passenger-timing-template').innerHTML,
				innerString = '';
			
			this.passengers.forEach((function(passenger, idx) {

				var _ret = {};
				var passengerString = template;

				this.keys.forEach(function(key) {

					var event = passenger.getEvent(key);

					if (event) {
						_ret[key] = event.value;
						passengerString = passengerString.replace('%'+key+'%', 
							AVIATION.time.decimalDayToTime(_ret[key]));
					} else {
						//
						//	This should be improved - not clean
						//
						try {
							_ret[key] = passenger[key];
							passengerString = passengerString.replace('%'+key+'%', _ret[key]);
						} catch (e) {

							console.warn(e, key);
						}

					}
				})
				this._passengers.push(_ret);
				innerString+=passengerString;
			}).bind(this));
			table.innerHTML+=innerString;
		},
		buildTypeTable : function (typeObj, parents, weighted) {
			
			var template = document.getElementById('passenger-box-template').innerHTML,
				div = document.createElement('div'),
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

			if (parents.length === 0) container.style.marginBottom = "-10px";

			return container;
		},
		buildTypeTableRow : function (typeObj, push, weighted) {

			var template = document.getElementById("passenger-type-template").innerHTML,
				row = document.createElement('tr');

			if (push === true) {
				this._profiles.push({
					name : typeObj._name,
					count : typeObj._data.count,
					percentage : typeObj._data.percentage,
					brfood: typeObj._data.brfood,
					food : typeObj._data.food,
					bags : typeObj._data.bags,
					brshop : typeObj._data.brshop,
					shop : typeObj._data.shop,
					weighted : typeObj._data.weighted
				});
			}

			row.innerHTML += template.replace('%name%', typeObj._name)
								.replace('%count%', typeObj._data.count)
								.replace('%percent%', typeObj._data.percentage)
								.replace('%brfood%', typeObj._data.brfood)
								.replace('%food%', typeObj._data.food)
								.replace('%bags%', typeObj._data.bags)
								.replace('%brshop%', typeObj._data.brshop)
								.replace('%shop%', typeObj._data.shop)
								.replace('%weighted%', typeObj._data.weighted);
			return row;
		},
		buildProfileTable : function (flightObj, weighted) {

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
				this._aircraft[flightObj._name] = percs;

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
													p.split('.').slice(1).join('.')].join('.'))
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
