var AVIATION = (function (aviation) {

	aviation.time = {

		decimalDayToTime : function (dday) {

			dday = dday >= 0 ? dday : 1 + dday;

			var hours = Number((dday * 24).toString().split('.')[0]),
				minutes = Number((dday * 24 * 60 - hours * 60).toString().split('.')[0]),
				seconds = Number((dday * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60).toString().split('.')[0]);

			hours = hours > 0 ? hours.toString() : '00';
			minutes = minutes > 0 ? minutes.toString() : '00';
			seconds = seconds > 0 ? seconds.toString() : '00';
			hours = hours.length > 1 ? hours : "0"+ hours;
			minutes = minutes.length > 1 ? minutes: "0"+ minutes;
			seconds = seconds.length > 1 ? seconds: "0"+ seconds;

			return hours+':'+minutes+':'+seconds;
		},
		decimalDayToMinutes : function (dday) {

			dday = dday >= 0 ? dday : 1 + dday;

			return Number((dday*24*60).toString().split('.')[0]);
		},
		decimalDayDelta : function (fdday, tdday) {

			return tdday - fdday < 0 ? tdday - fdday + 1 : tdday - fdday;

		},
		timeToDecimalDay : function (time) {

			var splitStr = time.split(':'),
				hours = Number(splitStr[0]),
				minutes = Number(splitStr[1]),
				seconds = null;

			return this.minutesToDecimalDay(hours * 60 + minutes);
		},
		minutesToDecimalDay : function (minutes) {

			var hours = minutes/60,
				dday = hours/24;

			return dday;
		},
		secondsToDecimalDay : function (seconds) {

			return this.minutesToDecimalDay(seconds / 60);
		},
		apTimeToDecimalDay : function (str) {

			var time = str.split(/[: ]/),
				hours = time[2] === 'AM' ? time[0] : 
						time[2] === 'PM' ? (Number(time[0]) + 12).toString() :
						time[2],
				minutes = time[1];

			return this.timeToDecimalDay(hours+':'+minutes);
		},
		isapTime : function (str) {

			return ['AM', 'PM'].includes(str.toString().split(/ /).reverse()[0]);
		},
		romanToNumber : function (str) {

			var dict = {
				"I" : 1,
				"II" : 2,
				"III" : 3,
				"IV" : 4,
				"V" : 5,
				"VI" : 6,
			};

			if (dict[str] !== undefined) {

				return dict[str];

			} else {

				return 3; 
			}
		},
		romanToLetter : function(str) {

			var dict = {
				"I" : 'A',
				"II" : 'B',
				"III" : 'C',
				"IV" : 'D',
				"V" : 'E',
				"VI" : 'F',
			};

			if (dict[str] !== undefined) {

				return dict[str];

			} else {

				return 'C';
			}
		}
	}

	return aviation;

})(AVIATION || {});