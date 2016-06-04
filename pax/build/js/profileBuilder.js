var app = app || {};

(function() {

	app.ProfileBuilder = function(passengers) {

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

				console.log(dist);
				console.log('percent sum: ', Object.keys(dist).map(function(o) {
					return dist[o];
				}).reduce(function(a,b) {
					return a+b;
				}, 0));

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
			_getPercArray : function (dist) {
				var arr = [];
				for (var d in dist) {
					for (var i=0; i<dist[d].percentage; i++) {
						arr.push(d);
					}
				}
				return arr;
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
			}
		};

		this.flightProfiles = {};
		this.flights = [];
		this.types = [];
		this.typeClass = null;
		this.run = function (filter, cb) {

			//passengers = passengers.filter(function(p) {
			//	return p.BAREA == 'A' || (p.GATE >= 1 && p.GATE < 13); //||
					//p.BAREA == 'B' || (p.GATE >= 20 && p.GATE < 40) ||
					//p.BAREA == 'C' || (p.GATE >= 40 && p.GATE < 49);
			//});	
			this.typeClass = new TypeClass('total', 
					passengers, 
					passengers.length, 
					[]);

			for (var type in this.typeClass._types) {

				var obj = this.typeClass._types[type],
					profile = obj._getPaxProfile();

				this.types.push(obj);

				for (var p in profile.pax) {
					if (!(p in this.flightProfiles)) this.flightProfiles[p] = {};
					this.flightProfiles[p][profile._name] = {
						pax : profile.pax[p],
			    		dist : profile.dist[p]
					}
				}
			}
			for (var flightType in this.flightProfiles) {
	    		this.flights.push(new FlightClass(flightType, this.flightProfiles[flightType]));
			}
			return cb();
		};
		this.getProfiles = function () {
			return this.flights;
		};
		this.getTypes = function () {
			return this.types;
		};
	}	
})();