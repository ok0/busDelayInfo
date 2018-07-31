var express = require("express");
var router = express.Router();
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");

router.get("/", function(req, res, next) {
	var weekArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
	var callList = ["getHoliDeInfo", "getRestDeInfo"]
	
	var preURL = CONFIG.calendar.url;
	var postURL = "?serviceKey=" + CONFIG.calendar.key;
	
	var year = req.query.year;
	var month = req.query.month;
	var lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
	lastDay = 1;
	var esInsertArray = {};
	
	for( var _day = 1 ; _day <= lastDay ; _day++ ) {
		var dayofweek = weekArray[new Date().getDay()];
		for( var _callCnt = 0 ; _callCnt < callList.length ; _callCnt++ ) {
			var func = callList[_callCnt];
			var url = preURL + "/" + func + postURL + "&solYear=" + year + "&solMonth=" + month.padStart(2, "0");
			console.log(url);
			cFunc.getApiData(url, function(getErr, getRs) {
				var body = JSON.parse(getRs);
				console.log(body);
			});
		}
	}
});

module.exports = router;