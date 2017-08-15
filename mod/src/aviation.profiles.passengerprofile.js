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

    var data = this.data;
    var wrangled = {
        'name': this.name,
    };

    Object.keys(data).forEach(function (k) {
        wrangled[k] = data[k];
    });

    return wrangled;
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
