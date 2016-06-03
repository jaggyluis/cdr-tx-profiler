var AVIATION = (function (aviation) {

	aviation.class = aviation.class || {};
	aviation.class.Interval = function(start, end) {
		
		return new Interval(start, end);
	}

	function Interval(start, end) {
		this.start = start;
		this.end = end;
	};
	Interval.prototype = {
		intersects : function(other) {
			return this.includes(other.start) ||
				this.includes(other.end) ||
				other.includes(this.start) ||
				other.includes(this.end);
		},
		getLength : function() {
			return this.end-this.start;
		},
		contains : function(other) {
			return this.includes(other.start) && this.includes(other.end);
		},
		includes : function(num) {
			return num >= this.start && num <= this.end;
		},
		padded : function(val1, val2) {
			if(val1 && val2) {
				return new Interval(this.start-val1, this.end+val2);
			} else if(val1) {
				return new Interval(this.start-val1, this.end+val1);
			}
		}
	};

	return aviation;

})(AVIATION || {});