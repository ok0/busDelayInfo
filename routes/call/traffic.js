var express = require("express");
var router = express.Router();
var request = require("request");
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");

// 1. trim
// 2. parseInt(), parseFloat()
var setArray = function(body) {
	console.log("traffic setArray start");
	if(body == null) {
		console.log("file is null");
		return ;
	}
	var rowDataRESULT = body.VolInfo.RESULT[0] ;
	var rowData = body.VolInfo.row ;
	var rowDataArray = new Array();
	if(!(rowDataRESULT.CODE[0]=="INFO-000")) {
		console.log(rowDataRESULT.CODE[0]+" | "+rowDataRESULT.MESSAGE[0]);
		var rowDataFin = new Object();
		var rowDataHead = new Object();
		rowDataHead.CODE = rowDataRESULT.CODE[0];
		rowDataHead.MESSAGE = rowDataRESULT.MESSAGE[0];
		rowDataFin.head = rowDataHead;
		rowDataFin.body = "";
		var url1 = 'http://cloud.rosesystems.kr:9200/tmp_traffic/doc';
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
		
		rowDataBody.spot_num = rowData[i].spot_num[0];
		rowDataBody.ymd = rowData[i].ymd[0];
		if(rowData[i].hh =="") {
			rowDataBody.hh = parseInt("0");
		} else {
			rowDataBody.hh = parseInt(rowData[i].hh);
		}
		rowDataBody.io_type = rowData[i].io_type[0];
		if(rowData[i].lane_num =="") {
			rowDataBody.lane_num = parseInt("0");
		} else {
			rowDataBody.lane_num = parseInt(rowData[i].lane_num);
		}
		if(rowData[i].vol =="") {
			rowDataBody.vol = parseInt("0");
		} else {
			rowDataBody.vol = parseInt(rowData[i].vol);
		}
		rowDataArray.push(rowDataBody);
		rowDataFin.head = rowDataHead;
		rowDataFin.body = rowDataBody;
		var OPT = {
				headers: {
					"Content-Type": "application/json"
				}
				, url : "http://cloud.rosesystems.kr:9200/tmp_traffic/doc/"+rowDataBody.ymd+rowDataBody.hh+rowDataBody.io_type+rowDataBody.lane_num
				, body : JSON.stringify(rowDataFin)
			};
		request.put(OPT, function(npErr, npRes, npBody) {
			console.log(npBody);
		});
	}
	
	var rowData3 = JSON.stringify(rowDataArray);
	console.log("traffic setArray end");
	return rowData3;
}

router.get("/", function(req, res, next) {
	var today = new Date().toISOString().substr(0, 10).replace('T', ' ');
	var newDate = new Date();
	var date = newDate.addHours(-1).toFormat('YYYYMMDD');
	var time = newDate.toFormat('HH24');
	var url = CONFIG.traffic.prevUrl + "/" + CONFIG.traffic.key + "/" + CONFIG.traffic.postUrl + "/1/1000/D-23/" + date + "/" + time + "/";
	
	cFunc.getApiData(url, function(getErr, getRs) {
		if( getErr ) {
			console.log(getErr);
			res.status(500).send();
		} else {
			setArray(getRs);
//			console.log(setArray(getRs));
			cFunc.writeXmlToJson("traffic", "traffic_"+date+"_"+time, getRs, function(writeErr, writeRs) {
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