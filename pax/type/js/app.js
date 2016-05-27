(function() {	

	function typeBuilder(passengers) {

		function TypeClass(name, pArr, length, trace) {

			var type = this._getPassengersByType(pArr);
			var dt = this._getPassengersByDT(pArr);
			var di = this._getPassengersByDI(pArr);

			this._name = name;
			this._data = this._getTypeProfile(pArr, length);
			this._pax = pArr;

			if (!trace.includes('type')) {
				var ty = trace.slice();
				ty.push('type');
				this.business = new TypeClass(this._name+'.'+'business', type.business, length, ty);
				this.leisure = new TypeClass(this._name+'.'+'leisure', type.leisure, length, ty);
				this.other = new TypeClass(this._name+'.'+'other', type.other, length, ty);
			}
			if (!trace.includes('di')) {
				var ti = trace.slice();
				ti.push('di');
				this.domestic = new TypeClass(this._name+'.'+'domestic', di.domestic, length, ti);
				this.international = new TypeClass(this._name+'.'+'international', di.international, length, ti);
			}
			if (!trace.includes('dt')) {
				var tt = trace.slice();
				tt.push('dt');
				this.departing = new TypeClass(this._name+'.'+'departing', dt.departing, length, tt);
				this.transfer = new TypeClass(this._name+'.'+'transfer', dt.transfer, length, tt);
			}
			var _types = this._filterTypes();
			if(!Object.keys(_types).includes(this._name)) this._types = _types;
		};
		TypeClass.prototype = {

			_getPaxProfile : function() {

				var pax = this._getPaxData(this._pax),
					data = this._data;
					dist = {};

				for (var t in pax) {
					dist[t] = this._getArrivalDistribution(pax[t], 10);
				}
				return {
					_name: this._name,
					pax : pax,
					data : data,
					dist : dist
				};
			},
			_getArrivalDistribution : function (pArr, mod) {

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
			},
			_getTypes() {
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

				this._getTypes().forEach(function(type) {
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
					types[curr._name] = curr;
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
					weighted = weighted === undefined ? false : weighted,
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
				},{
					count:count, 
					weighted:weighted, 
					percentage: Math.round(count/total*100)
				});
			},
			_getPaxData : function (pArr) {

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
									return '_';
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
							//console.warn(f)
						}
					}
				}).bind(this));

				return typeData;
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
									.replace('%weighted%', this._data.weighted);
				
				
				if (drawHeader) {
					var parent = table.children[1].children[0].children[0];
					trace.push(parent);
				}
				container.appendChild(table);

				var sub = [];
				this._getTypes().forEach((function(type) {
					sub.push(this[type]._buildTable(true, tabs, trace));
				}).bind(this));

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


		function FlightClass (name, types) {
			this._name = name;
			this._types = types;
			this._di = this._getDIDist();
		}
		FlightClass.prototype = {

			_getDIDist : function() {
				var dist = {
					domestic : {},
					international : {}
				};
				for (var type in this._types) {
					if (type.split('.').includes('domestic')) {
						dist.domestic[type] = this._types[type];
					} else if (type.split('.').includes('international')) {
						dist.international[type] = this._types[type];
					}
				}
				return dist;
			},
			_getPerc : function() {
				var perc = {};
				for (var d in this._di) {
					var count = 0
					perc[d] = {}
					for (var t in this._di[d]) {
						perc[d][t] = this._di[d][t].pax.length
						count+=this._di[d][t].pax.length
					}
					for (var p in perc[d]){
						perc[d][p] = {
							count : perc[d][p],
							percentage : Math.round(perc[d][p]/count*100),
							dist : this._types[p].dist
						}
					} 
				}
				return perc;
			},
			_buildTable : function(weighted) {

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
					weighted = weighted === undefined ? false : weighted,
					div = document.createElement('div'),
					top = boxTemplate.replace(/%name%/g, this._name),
					percs = this._getPerc();

				for (var type in percs) {
					var rep = typeTemplate.replace(/%type%/g, this._name+'.'+type)
										.replace(/%name%/g, this._name)
										.replace(/%count%/, Object.keys(percs[type]).map(function(k) {
											return percs[type][k].count
										}).reduce(function(a,b) {
											return a+b;
										}));
					for (var p in percs[type]) {
						var f = percs[type][p],
							st =  JSON.stringify(f.dist).replace(/[{}]/g, '');
							flight = flightTemplate.replace(/%name%/g, [this._name, p.split('.').slice(1)].join('.'))
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
		}

		//passengers = passengers.filter(function(p) {
			//return p.BAREA == 'A' || (p.GATE >= 1 && p.GATE < 13); //||
				//p.BAREA == 'B' || (p.GATE >= 20 && p.GATE < 40) ||
				//p.BAREA == 'C' || (p.GATE >= 40 && p.GATE < 49);
		//});	

		var typeClass = new TypeClass('total', passengers, passengers.length, []),
			keys = Object.keys(typeClass._types),
			box = document.getElementById('table-box'),
			children = [],
			obj,
			flightProfiles = {},
			logbar = document.getElementById('log'),
			i = 0;	

		function append(dest, str) {
			dest.innerHTML+='<div>*</div>'.replace("*", str)
		};
		function compute_profiles(cb) {

			obj = typeClass._types[keys[i]];
		    children.push(obj._buildTable(!i, 1, []));
		    profile = obj._getPaxProfile()

		    for (var flightClass in profile.pax) {
		    	if (!(flightClass in flightProfiles)) flightProfiles[flightClass]= {};
		    	flightProfiles[flightClass][profile._name] = {
		    		pax : profile.pax[flightClass],
		    		dist : profile.dist[flightClass]
		    	}
		    }
		    append(logbar, obj._name); // log
		    i++;

		    if (i < keys.length) {
		    	window.setTimeout(compute_profiles.bind(null, cb), 0)
		    } else {
		    	return cb(flightProfiles);
		    };
		};

		append(logbar, '<br>>>><br><br>');
		append(logbar, '<br>computing passenger profiles...<br><br>');
		append(box, '<br><div class="pad">TOTALS</div><br>');
		box.appendChild(typeClass._buildTable(true, 1, []));

		compute_profiles(function(profiles) {

			var d = document.createElement('div');
			//d.style.paddingLeft = '50px';
	    	append(d, '<br><div class="pad">PASSENGER PROFILES</div><br>');
	    	children.forEach(function(childElem) {
	    		d.appendChild(childElem);
	    	})	    	
	    	append(d, '<br><div class="pad">FLIGHT PROFILES</div><br>')
	    	box.appendChild(d);

	    	var flights = [];

	    	append(logbar, '<br>computing flight profiles...<br><br>');

	    	for (var flightType in profiles) {
	    		var flightClass = new FlightClass(flightType, profiles[flightType]);
	    		append(logbar, flightType);
	    		d.appendChild(flightClass._buildTable());
	    	}

	    	append(logbar, '<br>...done');
		});
	}
	var profiles = typeBuilder(p12.concat(p13).concat(p14).concat(p15));

})();