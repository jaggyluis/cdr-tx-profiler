var AVIATION = (function (aviation) {

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
		padded : function(val) {
			return new Interval(this.start-val, this.end+val);
		}
	};

	return aviation;

})(AVIATION || {});