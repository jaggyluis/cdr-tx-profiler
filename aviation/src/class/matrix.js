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

		for (var i=0; i<numRow; i++) {
			var x = [];
			for (var j=0; j<numCol; j++) {
				var y = [];
				x.push(y);
			}
			this.d.push(x);
			this._rs.push([]);
		}
	};
	Matrix3d.prototype = {

		setItem : function(r,c,i) {

		},
		getItem : function(r,c,i) {

			return this.d[r][c][i] || null;
		},
		pushItem : function(item, r,c) {

			if ( r === -1 || undefined ) r = this.d.length-1;
			if ( c === -1 || undefined ) c = this.d[r].length-1;
			this.d[r][c].push(item);
		},
		getCol : function(r,c) {

			return this.d[r][c] || null;
		},
		getRow : function(r) {

			if (r === -1) r = this.d.length-1;

			return this.d[r] || null;
		},
		copyRow : function(f, t, insert) {

			if (insert === true) {
				this.insertRow(t, this.d[f]);
			} else {
				this.d[t] = this.d[f].slice();
			}
		},
		insertRow : function(t, row) {

			this.d.splice(t, 0, row.slice());
		},
		applyRow : function(f, t, cap) {

			var cap = cap || Infinity;

			for (var c=0; c<this.c; c++) {

				var fcol = this.d[f][c],
					tcol = this.d[t][c],
					delta = fcol.length - tcol.length;

				for (var i=fcol.length-delta; i<fcol.length; i++) {
					tcol.push(fcol[i]);
				}
			}
			for (var c=0; c<this.c; c++) {
				if (this.d[t][c].length > cap) {

					var len = this.d[t][c].length,
						delta = len - cap;

					this.d[t][c+1] = this.d[t][c]
						.slice(len-delta, len)
						.concat(this.d[t][c+1]);

					this.d[t][c] = this.d[t][c].slice(0,len-delta);
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


		}
	}

	return aviation;

})(AVIATION || {});