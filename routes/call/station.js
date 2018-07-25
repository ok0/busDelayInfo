var express = require("express");
var router = express.Router();
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");

// 1. trim
// 2. parseInt(), parseFloat()
var setArray = function() {
	
}


// 하루종일 30초씩.
router.get("/", function(req, res, next) {
	var today = new Date().toISOString().substr(0, 10).replace('T', ' ').replace('-','').replace('-','').replace('-','');
	var now  = new Date();
	
	var hours = now.getHours()+"";
	var minutes = now.getMinutes()+"";
	var seconds = now.getSeconds()+"";
	
	if(hours.length == 1){
		hours = "0"+hours;
	}
	if(minutes.length == 1){
		minutes = "0"+minutes;
	}
	if(seconds.length == 1){
		seconds = "0"+seconds;
	}
	
	var now_time = hours+""+minutes+""+seconds;
	var url = CONFIG.station.url + "?serviceKey=" + CONFIG.station.key + "&arsId=17004";
	
	cFunc.getApiData(url, function(getErr, getRs) {
		if( getErr ) {
			console.log(getErr);
			res.status(500).send();
		} else {
			cFunc.writeXmlToJson("station", "station_"+today+"_"+now_time, getRs, function(writeErr, writeRs) {
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