aviation.profiles.FlightProfile = function (name, profileData) {
	return new FlightProfile(name, profileData);
};

aviation.profiles.FlightProfile.deserialize = function (data) {

	return Object.create(FlightProfile.prototype, {
		'name' : {'value' : data.name },
		'data' : {'value' : data.data }
	});
};

function FlightProfile (name, profileData) {
	this.name = name;
	this.data = profileData;
}

FlightProfile.prototype = {};

FlightProfile.prototype.wrangle = function () {

    var data = this.data;

	return  {
		'name' : this.name,
		'data' : Object.keys(data).map(function(i) {
			return {
				'name' : i,
				'data' : Object.keys(data[i]).map(function(j) {
					return {
						'name' : j,
						'data' : Object.keys(data[i][j]).map(function(k) {
							return {
								'name' : k,
								'count' : data[i][j][k].count,
								'percentage' : data[i][j][k].percentage
							};
						})
					};
				})
			};
		}) 
	};
};

FlightProfile.prototype.serialize = function () {

	return 	{
		'class' : 'FlightProfile',
		'data' : {
			'name' : this.name ,
			'data' : this.data
		}
	};
};
