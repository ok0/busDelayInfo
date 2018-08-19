var express = require("express");
var router = express.Router();
var request = require("request");
var date_utils  = require('date-utils');
var async = require("async");
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");

var setArray = function(_type, _data) {
	var rs = {
		year : null
		, month : null
		, day : null
		, isHolday : null
		, dateKind : null
		, dateName : null
		, remarks : null
	};
	
	if( _type == "dayLabel" ) {
		if( _data.dayOfWeek == "saturday" || _data.dayOfWeek == "sunday" ) {
			var hday = "Y";
		} else {
			var hday = "N";
		}
		
		rs = {
			year : _data.y
			, month : _data.m
			, day : _data.d
			, dateKind : "dayOfWeek"
			, dateName : _data.dayOfWeek
			, isHolday : hday
			, remarks : ""
		};
	} else if( _type == "getHoliDeInfo" || _type == "getRestDeInfo" ) {
		var ymd = _data.locdate[0];
		var y = ymd.substr(0, 4);
		var m = ymd.substr(4, 2);
		var d = ymd.substr(6);
		
		rs = {
			year : y
			, month : m
			, day : d
			, isHoliday : _data.isHoliday[0]
			, dateKind : _type
			, dateName : _data.dateName[0]
		};
		
		if( _data.remarks ) {
			rs.remarks = _data.remarks[0];
		}
	}
	
	rs.year = parseInt(rs.year);
	rs.month = parseInt(rs.month);
	rs.day = parseInt(rs.day);
	
	return rs;
}

var putES = function(_data, cb) {
	var esURL = 'http://cloud.rosesystems.kr:9200/calendar/doc/';
	var OPT = {
		headers: {
			"Content-Type": "application/json"
		}
		, url : esURL
		, body : JSON.stringify(_data)
	};
	request.post(OPT, function(npErr, npRes, npBody) {
		if( cb ) {
			cb(npErr, npRes);
		}
	});
}

router.get("/dayLabel", function(req, res, next) {
	var weekArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
	var callList = ["getHoliDeInfo", "getRestDeInfo"]
	
	var preURL = CONFIG.calendar.url;
	var postURL = "?serviceKey=" + CONFIG.calendar.key;
	
	var year = req.query.year;
	var month = req.query.month;
	var lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
	//lastDay = 1;
	
	var dayArr = [];
	for( var dayCnt = 1 ; dayCnt <= lastDay ; dayCnt++ ) {
		dayArr.push(year + "-" + month + "-" + String(dayCnt).padStart(2, "0"));
	}
	
	async.eachOfSeries(
		dayArr
		, function(_day, _idx, doneCallback) {
			_day = String(_day);
			
			// 날짜데이터.
			var aa = new Date(_day);
			var dayLabel = aa.getDay();
			
			// 요일
			var func = "dayLabel";
			var dayOfWeek = weekArray[dayLabel];
			putES(setArray(func, {y:String(aa.getFullYear()),m:String(aa.getMonth() + 1),d:String(aa.getDate()),dayOfWeek:dayOfWeek}), function(esErr, esRes) {
				doneCallback(esErr);
			});
		}
		, function(err) {
			if( err ) {
				console.log(err);
			} else {
				console.log("END!");
			}
		}
	);
	
	res.status(200).send();
});

router.get("/holiday", function(req, res, next) {
	var callList = ["getHoliDeInfo", "getRestDeInfo"];
	
	var preURL = CONFIG.calendar.url;
	var postURL = "?serviceKey=" + CONFIG.calendar.key;
	
	var year = req.query.year;
	var month = req.query.month;
	
	async.eachOfSeries(
		callList
		, function(_func, _idx, doneCallback) {
			var url = preURL + "/" + _func + postURL + "&solYear=" + year + "&solMonth=" + month.padStart(2, "0");
			cFunc.getApiData(url, function(getErr, getRs) {
				if( getErr ) {
					doneCallback(getErr);
				} else {
					console.log(_func);
					if(
						getRs.response.body[0].items[0].item
						&& getRs.response.body[0].items[0].item.length > 0
					) {
						async.eachOfSeries(
							getRs.response.body[0].items[0].item
							, function(_row, _idx2, doneCallback2) {
								putES(setArray(_func, _row), function(esErr, esRes) {
									if( esErr ) {
										doneCallback2(esErr);
									} else {
										doneCallback2(null);
									}
								});
							}
							, function (err) {
								if( err ) {
									console.log(err);
									doneCallback(err);
								} else {
									console.log("...");
									doneCallback(null);
								}
							}
						);
					} else {
						doneCallback(null);
					}
				}
			});
		}
		, function(err) {
			if( err ) {
				console.log(err);
			} else {
				console.log("END!");
			}
		}
	);
	
	res.status(200).send();
});

module.exports = router;