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

        var valueType = data[k].valueType,
            attributeType = data[k].attributeType;

        if (valueType == 'number' || valueType == 'percentage' || valueType == 'string') {
            wrangled[k] = data[k].value;

        } else if (valueType == 'distribution') {

            if (attributeType == 'number') {

                var values = 0;
                var total = 0;

                Object.keys(data[k].value).forEach(function (key) {
                    values += +key * data[k].value[key];
                    total += data[k].value[key];
                });

                wrangled[k] = values / total;
            }
        }
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
