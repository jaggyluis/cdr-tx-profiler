aviation.core.string = {
	generateUUID : function () {
		//	http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	    var d = new Date().getTime(),
	    	uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        	var r = (d + Math.random()*16)%16 | 0;
	        	d = Math.floor(d/16);
	        	return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    	});
	    return uuid;
	}
};