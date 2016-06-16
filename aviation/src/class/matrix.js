var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Matrix3d = function(numRow, numCol, mod) {
		
		return new Matrix3d(numRow, numCol, mod);
	}

	function Matrix3d(numRow, numCol, mod) {

		this.d = [];
		this.m = mod;
		this.r = numRow;
		this.c = numCol;
		this._rs = [];

		for (var r=0; r<numRow; r++) {
			var row = [];
			for (var c=0; c<numCol; c++) {
				var col = [];
				row.push(col);
			}
			this.d.push(row);
			this._rs.push([]);
		}
	};
	Matrix3d.prototype = {

		setItem : function(r, c, i) {

		},
		getItem : function(r, c, i) {

			return this.d[r][c][i] || null;
		},
		pushItem : function(item, r, c) {

			if ( r === -1 || undefined ) r = this.d.length-1;
			if ( c === -1 || undefined ) c = this.d[r].length-1;
			this.d[r][c].push(item);
		},
		getCol : function(r, c) {

			return this.d[r][c] || null;
		},
		getRow : function(r) {

			if (r === -1) r = this.d.length-1;

			return this.d[r] || null;
		},
		getRowItemCount(r) {

			return this.d[r].reduce(function(a,b) {

				return a + b.length;
			},0);
		},
		getRowBlank : function() {

			var row = [];

			for (var c=0; c<this.c; c++) {
				row.push([]);				
			}

			return row;
		},
		copyRow : function(f, t, insert) {

			if (insert === true) {
				this.insertRow(t, this.d[f]);
			} else {
				this.d[t] = this.d[f].slice();
			}
		},
		copyRowApply : function(f, t, insert, cb) {

			var row = this.getRowBlank();

			for (var c=0; c<this.d[f].length; c++) {
				for (var i=0; i<this.d[f][c].length; i++) {

					var item = this.d[f][c][i],
						count = this.d[f][c].length,
						index = cb(item, count, i, c, f),
						col = index < this.c ? 
							row[index] : 
							row[index-this.c];

					col.push(item);
				}
			}
			if (insert) {
				this.insertRow(t, row);
			} else {
				this.d[t] = row;
			}

		},
		insertRowBlank : function(t) {
			
			this.insertRow(t, this.getRowBlank());
		},
		insertRow : function(t, row) {

			this.d.splice(t, 0, row.slice());
			this._rs.push([]);
			this.r++;
		},
		applyRow : function(f, t) {

			for (var c=0; c<this.c; c++) {

				var fcol = this.d[f][c],
					tcol = this.d[t][c],
					delta = fcol.length - tcol.length;

				for (var i=fcol.length-delta; i<fcol.length; i++) {
					tcol.push(fcol[i]);
				}
			}
		},
		distributeRowByCap : function(f, t, cap) {

			var cap = cap || Infinity;

			this.applyRow(f,t);

			for (var c=0; c<this.c; c++) {
				if (this.d[t][c].length > cap) {

					var len = this.d[t][c].length,
						delta = len - cap;
						nxt = this.d[t][c+1] ? 
							this.d[t][c+1] : 
							this.d[t][c+1-this.c];

					nxt = this.d[t][c]
						.slice(len-delta, len)
						.concat(nxt);

					this.d[t][c] = this.d[t][c].slice(0,len-delta);
				}
			}
		},
		distributeRowByCallBack : function(f, t, insert, cb) {
			
			this.applyRow(f,t);

			for (var c=0; c<this.c; c++) {

				var add = [];

				while(cb(this.d[t][c])>this.m) {
					add.push(this.d[t][c].pop());
				}
				if(this.d[t][c+1] !== undefined) {
					this.d[t][c+1] = add.concat(this.d[t][c+1]);
				} else {
					this.d[t][this.c-c+1] = 
						add.concat(this.d[t][this.c-c+1]);
				}
			}
		},
		shiftRow : function(r, shift) {

			if (shift > 0) {
				for (var i=0; i<shift; i++) {
					this.d[r].push(this.d[r].shift());
					this._rs[r].push(-shift);
				}
			} else if (shift < 0) {
				for (var i=0; i<-shift; i++) {
					this.d[r].unshift(this.d[r].pop())
					this._rs[r].push(-shift);
				}
			}
		},
		restore : function() {

			for (var r=0; r<this.r; r++) {
				this.shiftRow(r, this._rs.reduce(function(a,b) {

				 return a+b;

				}));
			}
		},
		merge : function(other) {

			this.m = this.m ? this.m : other.m ? other.m : this.m;
			this.r = this.r ? this.r : other.r ? other.r : this.r;
			this.c = this.c ? this.c : other.c ? other.c : this.c;
			this.rs = [];

			var m1, m2;

			if (this.d.length) {
				m1 = this;
				m2 = other;
			} else if (other.d.length) {
				m1 = other;
				m2 = this;
			} else {
				console.warn('empty merge');
			}

			for (var r=0; r<m2.d.length; r++) {
				for (var c=0; c<m2.d[r].length; c++) {
					for (var i=0; i<m2.d[r][c].length; i++) {
						m1.d[r][c].push(m2.d[r][c][i]);
					}
				}
			}
			return m1;
		}
	}

	return aviation;

})(AVIATION || {});