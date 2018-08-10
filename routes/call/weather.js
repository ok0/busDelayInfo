var express = require("express");
var router = express.Router();
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");

// 1. trim
// 2. parseInt(), parseFloat()
var setArray = function(body) {
	console.log("weather setArray start");
	var rowData = body.RealtimeWeatherStation.row ;
	var rowDataArray = new Array();
	
	for (var i = 0 ; i < rowData.length ; i++) {
		var rowData2 = new Object();
		
		rowData2.SAWS_OBS_TM = rowData[i].SAWS_OBS_TM;
		rowData2.STN_NM = rowData[i].STN_NM;
		rowData2.STN_ID = rowData[i].STN_ID;
		if(rowData[i].SAWS_TA_AVG =="") {
			rowData2.SAWS_TA_AVG = parseFloat("0.0");
		} else {
			rowData2.SAWS_TA_AVG = parseFloat(rowData[i].SAWS_TA_AVG);
		}
		if(rowData[i].SAWS_HD =="") {
			rowData2.SAWS_HD = parseFloat("0.0");
		} else {
			rowData2.SAWS_HD = parseFloat(rowData[i].SAWS_HD);
		}
		rowData2.CODE = rowData[i].CODE;
		rowData2.NAME = rowData[i].NAME;
		if(rowData[i].SAWS_WS_AVG =="") {
			rowData2.SAWS_WS_AVG = parseFloat("0.0");
		} else {
			rowData2.SAWS_WS_AVG = parseFloat(rowData[i].SAWS_WS_AVG);
		}
		if(rowData[i].SAWS_RN_SUM =="") {
			rowData2.SAWS_RN_SUM = parseFloat("0.0");
		} else {
			rowData2.SAWS_RN_SUM = parseFloat(rowData[i].SAWS_RN_SUM);
		}
		if(rowData[i].SAWS_SOLAR =="") {
			rowData2.SAWS_SOLAR = parseFloat("0.0");
		} else {
			rowData2.SAWS_SOLAR = parseFloat(rowData[i].SAWS_SOLAR);
		}
		if(rowData[i].SAWS_SHINE =="") {
			rowData2.SAWS_SHINE = parseFloat("0.0");
		} else {
			rowData2.SAWS_SHINE = parseFloat(rowData[i].SAWS_SHINE);
		}
		rowDataArray.push(rowData2);
	}
	
	var rowData3 = JSON.stringify(rowDataArray);
//	console.log(rowData3);
	console.log("weather setArray end");
	return rowData3;
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
//			setArray(getRs);
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
