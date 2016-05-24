(function() {	

	function typeBuilder() {

		function getPassengersByDI(pArr) {
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
		}
		function getPassengersByDT(pArr) {
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
		}
		function getPassengersByType(pArr) {
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
		};
		function getTypeProfile(pArr, total, weighted) {
			
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
		};

		function TypeClass(name, pArr, length, trace) {

			var type = getPassengersByType(pArr);
			var dt = getPassengersByDT(pArr);
			var di = getPassengersByDI(pArr);

			this.__name = name;
			this._data = getTypeProfile(pArr, length);

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
		}
		TypeClass.prototype._buildTable = function (drawHeader, tabs, parents) {
			

			var container = document.createElement('div'),
				expand = document.createElement('div'),
				expImg = document.createElement('img'),
				table = document.createElement('table'),
				header = document.getElementById('passenger-type-header').innerText,
				col = document.createElement('div');
				template = document.getElementById('passenger-type-template').innerText;
				tabs = tabs++;

			container.style.paddingLeft = (tabs*50).toString()+"px";
			col.classList.add('table-container');



			table.classList.toggle('passenger-timing-table');
			if (drawHeader) table.innerHTML+= header

			table.innerHTML+=template.replace('%name%', this.__name)
								.replace('%name%', this.__name)
								.replace('%count%', this._data.count)
								.replace('%percent%', this._data.percentage)
								.replace('%food%', this._data.food)
								.replace('%bags%', this._data.bags)
								.replace('%shop%', this._data.shop)
			
			
			var parent = table.children[1].children[0].children[0];
			var trace = parents.slice();
			trace.push(parent);
			container.appendChild(table);

			var sub = [];
			for (var type in this) {
				if (!type.match(/_/)){
					var sTable = this[type]._buildTable(true, tabs, trace)
					sub.push(sTable);
				} 
			}

			if (sub.length !== 0) {

				col.classList.toggle('collapsed');

				expImg.src = 'img/expand.png';
				expand.classList.toggle('expand');
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
			}
	
			container.addEventListener('mouseenter', function() {
				for (var i=0; i<parents.length; i++) {
					parents[i].classList.add('sel');
					parent.classList.add('sel');
				}
			})
			container.addEventListener('mouseleave', function() {
				for (var i=0; i<parents.length; i++) {
					parents[i].classList.remove('sel');
					parent.classList.remove('sel');
				}
			})
			return container;
		}



		var passengers = p12.concat(p13).concat(p14).concat(p15);
		passengers = passengers.filter(function(p) {
			return p.BAREA == 'A' || (p.GATE >= 1 && p.GATE < 13) ||
				p.BAREA == 'B' || (p.GATE >= 20 && p.GATE < 40) ||
				p.BAREA == 'C' || (p.GATE >= 40 && p.GATE < 49);
		});	

		var typeClass = new TypeClass('total T1', passengers, passengers.length, []);
		document.getElementById('table-box').appendChild(typeClass._buildTable(true, 1, []));
	}

	typeBuilder();

})();