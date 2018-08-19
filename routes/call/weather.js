var express = require("express");
var router = express.Router();
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");
var request = require("request");

// 1. trim
// 2. parseInt(), parseFloat()
var setArray = function(body) {
	console.log("weather setArray start");
	if(body == null) {
		console.log("file is null");
		return ;
	}
	var rowDataRESULT = body.RealtimeWeatherStation.RESULT[0] ;
	var rowData = body.RealtimeWeatherStation.row ;
	var rowDataArray = new Array();
	if(!(rowDataRESULT.CODE[0]=="INFO-000")) {
		console.log(rowDataRESULT.CODE[0]+" | "+rowDataRESULT.MESSAGE[0]);
		var rowDataFin = new Object();
		var rowDataHead = new Object();
		rowDataHead.CODE = rowDataRESULT.CODE[0];
		rowDataHead.MESSAGE = rowDataRESULT.MESSAGE[0];
		rowDataFin.head = rowDataHead;
		rowDataFin.body = "";
		var url1 = 'http://cloud.rosesystems.kr:9200/tmp_weather/doc';
		var OPT = {
				headers: {
					"Content-Type": "application/json"
				}
				, url : url1
				, body : JSON.stringify(rowDataFin)
			};
		request.post(OPT, function(npErr, npRes, npBody) {
			console.log(npBody);
		});
		return ;
	}
	for (var i = 0 ; i < rowData.length ; i++) {
		var rowDataFin = new Object();
		var rowDataBody = new Object();
		var rowDataHead = new Object();
		rowDataHead.CODE = rowDataRESULT.CODE[0];
		rowDataHead.MESSAGE = rowDataRESULT.MESSAGE[0];
		rowDataBody.SAWS_OBS_TM = rowData[i].SAWS_OBS_TM[0];
		rowDataBody.STN_NM = rowData[i].STN_NM[0];
		rowDataBody.STN_ID = rowData[i].STN_ID[0];
		if(rowData[i].SAWS_TA_AVG =="") {
			rowDataBody.SAWS_TA_AVG = parseFloat("0.0");
		} else {
			rowDataBody.SAWS_TA_AVG = parseFloat(rowData[i].SAWS_TA_AVG);
		}
		if(rowData[i].SAWS_HD =="") {
			rowDataBody.SAWS_HD = parseFloat("0.0");
		} else {
			rowDataBody.SAWS_HD = parseFloat(rowData[i].SAWS_HD);
		}
		rowDataBody.CODE = rowData[i].CODE[0];
		rowDataBody.NAME = rowData[i].NAME[0];
		if(rowData[i].SAWS_WS_AVG =="") {
			rowDataBody.SAWS_WS_AVG = parseFloat("0.0");
		} else {
			rowDataBody.SAWS_WS_AVG = parseFloat(rowData[i].SAWS_WS_AVG);
		}
		if(rowData[i].SAWS_RN_SUM =="") {
			rowDataBody.SAWS_RN_SUM = parseFloat("0.0");
		} else {
			rowDataBody.SAWS_RN_SUM = parseFloat(rowData[i].SAWS_RN_SUM);
		}
		if(rowData[i].SAWS_SOLAR =="") {
			rowDataBody.SAWS_SOLAR = parseFloat("0.0");
		} else {
			rowDataBody.SAWS_SOLAR = parseFloat(rowData[i].SAWS_SOLAR);
		}
		if(rowData[i].SAWS_SHINE =="") {
			rowDataBody.SAWS_SHINE = parseFloat("0.0");
		} else {
			rowDataBody.SAWS_SHINE = parseFloat(rowData[i].SAWS_SHINE);
		}
		rowDataArray.push(rowDataBody);
		rowDataFin.head = rowDataHead;
		rowDataFin.body = rowDataBody;
		var url1 = 'http://cloud.rosesystems.kr:9200/tmp_weather/doc/'+rowDataBody.SAWS_OBS_TM+rowDataBody.STN_ID;
		var OPT = {
				headers: {
					"Content-Type": "application/json"
				}
				, url : url1
				, body : JSON.stringify(rowDataFin)
			};
		request.put(OPT, function(npErr, npRes, npBody) {
			console.log(npBody);
		});
//		request.post(OPT, function(npErr, npRes, npBody) {
//			console.log(npBody);
//		});
	}
	
	var rowData3 = JSON.stringify(rowDataArray);
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
			setArray(getRs);
//			console.log(setArray(getRs));
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
