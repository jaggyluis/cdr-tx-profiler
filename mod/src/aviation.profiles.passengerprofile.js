aviation.profiles.PassengerProfile = function (name, profileData) {
	return new PassengerProfile(name, profileData);
};
aviation.profiles.PassengerProfile.deserialize = function (data) {
	return Object.create(PassengerProfile.prototype, {
		'name' : {'value' : data.name }, // !!!!! TODO
		'data' : {'value' : data.data }
	});
};
function PassengerProfile (name, profileData) {
	this.name = name;
	this.data = profileData;
}
PassengerProfile.prototype = {};
PassengerProfile.prototype.wrangle = function () {
	return {
		'name' : this.name,
		'count' : this.data.count,
		'percentage' : this.data.percentage,
		'bags' : this.data.bags,
		'brshop' : this.data.brshop,
		'shop' : this.data.shop,
		'brfood' : this.data.brfood,
		'food' : this.data.food,
	};
};
PassengerProfile.prototype.serialize = function () {
		return 	{
		'class' : 'PassengerProfile',
		'data' : {
			'name' : this.name ,
			'data' : this.data,
		}
	};
};
