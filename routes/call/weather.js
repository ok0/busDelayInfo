var express = require("express");
var router = express.Router();
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");

// 1. trim
// 2. parseInt(), parseFloat()
var setArray = function() {
	console.log("weather setArray start");
	var rowData = body.RealtimeWeatherStation.row ;
	console.log("weather setArray end");
	return rowData;
}

// 매일 2시간 단위.
router.get("/", function(req, res, next) {
	var today = new Date().toISOString().substr(0, 10).replace('T', ' ');
	var newDate = new Date();
	var date = newDate.addHours(-1).toFormat('YYYYMMDD');
	var time = newDate.toFormat('HH24');
	var url = CONFIG.weather.prevUrl + "/" + CONFIG.weather.key + "/" + CONFIG.weather.postUrl + "/1/1000";
	
	cFunc.getApiData(url, function(getErr, getRs) {
		if( getErr ) {
			console.log(getErr);
			res.status(500).send();
		} else {
			console.log(setArray(getRs));
			cFunc.writeXmlToJson("weather", "weather_"+date+"_"+time, getRs, function(writeErr, writeRs) {
				if( writeErr ) {
					console.log(writeErr);
					res.status(500).send();
				} else {
					res.status(200).send();
				}
			});
		}
	});
});

module.exports = router;