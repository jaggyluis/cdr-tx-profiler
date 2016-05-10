
//--------------------------------------------------------
// utility functions
//--------------------------------------------------------
'use strict';

function decimalDayToTime(dday) {
	dday = dday>=0 ? dday : 1 + dday;
	var hours = Number((dday*24).toString().split('.')[0]);
	var minutes = Number((dday*24*60 - hours*60).toString().split('.')[0]);
	var seconds = Number((dday*24*60*60 - hours*60*60 - minutes*60).toString().split('.')[0]);
	hours = hours > 0 ? hours.toString() : '00';
	minutes = minutes > 0 ? minutes.toString() : '00';
	seconds = seconds > 0 ? seconds.toString() : '00';
	hours = hours.length > 1 ? hours : "0"+hours;
	minutes = minutes.length > 1 ? minutes: "0"+minutes;
	seconds = seconds.length > 1 ? seconds: "0"+seconds;
	return hours+':'+minutes+':'+seconds;
};

function minutesToDecimalDay(minutes) {
	var hours = minutes/60;
	var dday = hours/24;
	return dday;
};

function timeToDecimalDay(time) {
	var splitStr = time.split(':');
	var hours = Number(splitStr[0]);
	var minutes = Number(splitStr[1]);
	var seconds = null // not needed in current simulation
	return minutesToDecimalDay(hours*60+minutes);
};

function romanToNumber(str) {
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
		//console.warn('number not in dict: ', str);
		return 3; // for now
	}
}