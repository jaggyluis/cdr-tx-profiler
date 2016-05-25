(function() {	

	function typeBuilder(passengers) {

		function getArrivalDistribution(pArr, mod) {

			var delta = [],
				dist;

			pArr.forEach(function(p) {

				var arrTime,
					depTime;

				if (AVIATION.time.isapTime(p.ARRTIME)) {
					arrTime = AVIATION.time.aptimeToDecimalDay(p.ARRTIME);
				} else if (!isNaN(p.ARRTIME)) {
					arrTime = p.ARRTIME;
				}
				if (AVIATION.time.isapTime(p.DEPTIME)) {
					depTime = AVIATION.time.aptimeToDecimalDay(p.DEPTIME);
				} else if (!isNaN(p.DEPTIME)) {
					depTime = p.DEPTIME;
				}
				if (arrTime && depTime) {
					var near = AVIATION.math.round(AVIATION.time.decimalDayToMinutes(depTime-arrTime),mod)
					delta.push(near);
				}
			});
			dist = AVIATION.array.dist(delta, true);

			//console.log('percent sum: ', Object.keys(dist).map(function(o) {
			//	return dist[o];
			//}).reduce(function(a,b) {
			//	return a+b;
			//}));

			return dist;
			}

		function getPaxData (pArr) {

			var flights = [];
			var passengers = pArr;
			var typeData = {};
			//console.log('total passengers: ', passengers.length);

			var destinations = AVIATION.array.buildLib(passengers, 'DEST');
			Object.keys(destinations).map(function(dest) {
				var aLib = AVIATION.array.buildLib(destinations[dest], 'AIRLINE');
				for (var airline in aLib) {
					flights.push({
						passengers : aLib[airline],
						flight : aLib[airline][0].FLIGHT,
						destination : key.DESTINATION[dest],
						airline : key.AIRLINE[airline],
						aircraft : null,
					})
				}
			})
			//console.log('total flight types: ', flights.length)
			var sorted = flights.sort(function(a,b) {
				return b.passengers.length - a.passengers.length
			});
			sorted.forEach((function(f) {

				var airport = AVIATION.get.airportByString(f.destination);
				var airline = AVIATION.get.airlineByCode(f.airline);
				
				if (airport !== undefined && airline !== undefined) {

					var matchedFlights = designDay.filter(function(flight) {
						return flight.OPERATOR == airline.IATA && 
							flight["DEST."] == airport.IATA
					});
					if (matchedFlights.length !== 0) {
						//console.log(airport.IATA, airline.IATA);
						//console.log(matchedFlights);
						var types = matchedFlights.map(function(m) {
							try {
								return AVIATION.get.aircraftByCode(m.AIRCRAFT).RFLW;
							} catch (e) {
								//console.warn('not in library: ', m.AIRCRAFT)
								return 'OTHER';
							}
						});
						var type = AVIATION.array.mode(types);
						if (type in typeData) {
							f.passengers.forEach(function(p) {
								typeData[type].push(p);
							})
						} else {
							typeData[type] = f.passengers;
						}
					} else {
						//console.warn('flight not matched');
					}
				}
			}).bind(this));

			return typeData;
		}

		function TypeClass(name, pArr, length, trace) {

			var type = this._getPassengersByType(pArr);
			var dt = this._getPassengersByDT(pArr);
			var di = this._getPassengersByDI(pArr);

			this._name = name;
			this._passengers = pArr;
			this._data = this._getTypeProfile(pArr, length);

			if (!trace.includes('type')) {
				var ty = trace.slice();
				ty.push('type');
				this.business = new TypeClass('business', type.business, length, ty);
				this.leisure = new TypeClass('leisure', type.leisure, length, ty);
				this.other = new TypeClass('other', type.other, length, ty);
			}
			if (!trace.includes('di')) {
				var ti = trace.slice();
				ti.push('di');
				this.domestic = new TypeClass('domestic', di.domestic, length, ti);
				this.international = new TypeClass('international', di.international, length, ti);
			}
			if (!trace.includes('dt')) {
				var tt = trace.slice();
				tt.push('dt');
				this.departing = new TypeClass('departing', dt.departing, length, tt);
				this.transfer = new TypeClass('transfer', dt.transfer, length, tt);
			}
		};
		TypeClass.prototype = {

			get _types() {
				var types = [];
				for (var type in this) {
					if (!type.match(/_/)){
						types.push(type);
					} 
				};
				return types;
			},
			_uniq : function() {

				function _permutator(inputArr) {
					/*
					 * Modified from
					 * http://stackoverflow.com/
					 * questions/9960908/permutations-in-javascript
					 *
					 */
				    var results = [];
				    function permute(arr, memo) {
				    	var cur, memo = memo || [];
				    	for (var i = 0; i < arr.length; i++) {
				      		cur = arr.splice(i, 1);
				      		if (arr.length === 0) {
				        		results.push(memo.concat(cur).join('.'));
				      		}
				      		permute(arr.slice(), memo.concat(cur));
				      		arr.splice(i, 0, cur[0]);
				    	}
				    	return results.join(' ');
				 	}
				  	return permute(inputArr);
				}

				var uniq = [],
					perm = '',
					self = this;

				this._types.forEach(function(type) {
					var u = self[type]._uniq();
					perm+=' '+u[1];
					u[0].forEach(function(uArr) {
						var l = [type].concat(uArr),
							t = l.join('.');
						if (!perm.match(t)) {
							uniq.push(l);
							perm+=' '+_permutator(l);
						}
					})
				})
				if (uniq.length) {
					return [uniq, perm];
				} else {
					return [[[]], ''];
				}
			},
			_filterTypes : function() {
				var u = this._uniq(),
					types = {};
				for(var type in u[0]){
					var keys = u[0][type].slice(),
						curr = this; 
					for (var i=0; i<keys.length; i++){
						curr = curr[keys[i]];
					}
					types[keys.join('.')] = curr;
				}
				return types;
			},
			_getPassengersByDI : function (pArr) {
				var filtered = {
					domestic : [],
					international : [],
				}
				pArr.forEach(function(p) {

					switch (p['DESTGEO'] >= 4) {
						case false:
							filtered.domestic.push(p);
							break;
						case true :
							filtered.international.push(p);
							break;
						default:
							break;
					}
				});
				return filtered;
			},
			_getPassengersByDT : function (pArr) {
				var filtered = {
					departing : [],
					transfer : []
				}
				pArr.forEach(function(p) {

					for (var i=1; i<=6; i++) {

						var dt = p['Q3GETTO'+i.toString()]
						var arrTime = p['ARRTIME'];

						if (dt === 3 || arrTime === 'N') {
							filtered.transfer.push(p);
							return;
						}
					}
					filtered.departing.push(p);
					return;
				});
				return filtered;
			},
			_getPassengersByType : function (pArr) {
				var filtered = {
					leisure : [],
					business : [],
					other : []
				};
				pArr.forEach(function(p) {
					for (var i=1; i<=3; i++) {

						var type = p['Q2PURP'+i.toString()]

						switch ( type ) {
							case 1 :
								filtered.business.push(p);
								return;
							case 2 || 3 || 4 || 5 || 6: 
								filtered.leisure.push(p);
								return;
							default :
								break;
						}
					}
					filtered.other.push(p);
					return;
				});
				return filtered;
			},
			_getTypeProfile : function (pArr, total, weighted) {
				
				var count = 0,
					filtered = {
					bags : 0,
					shop : 0,
					food : 0,
				};
				pArr.forEach(function(p) {
					var weight = p.WEIGHT && weighted ? p.WEIGHT : 1;
					count++;
					if(p.Q4BAGS === 1) filtered.bags+=weight;
					if(p.Q4STORE === 1) filtered.shop+=weight;
					if(p.Q4FOOD === 1) filtered.food+=weight;
				});
				return Object.keys(filtered).reduce(function(a,b) {
					a[b] = Math.round((filtered[b]/count)*100);
					return a;
				},{count:count, percentage: Math.round(count/total*100)});
			},
			_buildTable : function (drawHeader, tabs, parents) {

				var container = document.createElement('div'),
					col = document.createElement('div'),
					expand = document.createElement('div'),
					expImg = document.createElement('img'),
					table = document.createElement('table'),
					header = document.getElementById('passenger-type-header').innerText,
					template = document.getElementById('passenger-type-template').innerText,
					trace = parents.slice();
					tabs = tabs++;

				container.style.paddingLeft = (tabs*50).toString()+"px";
				col.classList.add('table-container');
				table.classList.toggle('passenger-timing-table');

				if (drawHeader) table.innerHTML+= header;

				table.innerHTML+=template.replace('%name%', this._name)
									.replace('%name%', this._name)
									.replace('%count%', this._data.count)
									.replace('%percent%', this._data.percentage)
									.replace('%food%', this._data.food)
									.replace('%bags%', this._data.bags)
									.replace('%shop%', this._data.shop)
				
				
				if (drawHeader) {
					var parent = table.children[1].children[0].children[0];
					trace.push(parent);
				}
				container.appendChild(table);

				var sub = [];
				for (var type in this._types) {
					sub.push(this[this._types[type]]._buildTable(true, tabs, trace));
				}

				if (sub.length !== 0) {

					col.classList.toggle('collapsed');
					expand.classList.toggle('expand');

					expImg.src = 'img/expand.png';
					expImg.addEventListener('click', function() {
						col.classList.toggle('collapsed');
						col.classList.add('outlined-left')

						if (col.classList.contains('collapsed')) {
							expImg.src = 'img/expand.png';
						} else {
							expImg.src = 'img/collapse.png';
						}
					});

					expand.appendChild(expImg);
					container.appendChild(expand);
					container.appendChild(col);
					for (var s in sub ) col.appendChild(sub[s]);
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
			}
		}

		passengers = passengers.filter(function(p) {
			return p.BAREA == 'A' || (p.GATE >= 1 && p.GATE < 13) ||
				p.BAREA == 'B' || (p.GATE >= 20 && p.GATE < 40) ||
				p.BAREA == 'C' || (p.GATE >= 40 && p.GATE < 49);
		});	

		var typeClass = new TypeClass('total T1', passengers, passengers.length, []),
			types = typeClass._filterTypes(),
			box = document.getElementById('table-box'),
			count = 0;

		for (type in types) {
			var cl = types[type],
				dat = getPaxData(types[type]._passengers),
				draw = !count;

			cl._name = type;
			box.appendChild(cl._buildTable(draw, 1, []));

			for (var fType in dat) {
				var dist = getArrivalDistribution(dat[fType], 10);
			}

			count++;
		}

		box.innerHTML+='<div><br><div style="padding-left: 50px">TOTAL SIMULATION RESULTS</div><br></div>';
		box.appendChild(typeClass._buildTable(true, 1, []));
	}

	var profiles = typeBuilder(p12.concat(p13).concat(p14).concat(p15));

})();