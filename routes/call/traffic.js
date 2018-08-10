var express = require("express");
var router = express.Router();
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");

// 1. trim
// 2. parseInt(), parseFloat()
var setArray = function(body) {
	console.log("traffic setArray start");
	var rowData = body.VolInfo.row ;
	var rowDataArray = new Array();
	for (var i = 0 ; i < rowData.length ; i++) {
		var rowData2 = new Object();
		
		rowData2.spot_num = rowData[i].spot_num;
		rowData2.ymd = rowData[i].ymd;
		if(rowData[i].hh =="") {
			rowData2.hh = parseInt("0");
		} else {
			rowData2.hh = parseInt(rowData[i].hh);
		}
		rowData2.io_type = rowData[i].io_type;
		if(rowData[i].lane_num =="") {
			rowData2.lane_num = parseInt("0");
		} else {
			rowData2.lane_num = parseInt(rowData[i].lane_num);
		}
		if(rowData[i].vol =="") {
			rowData2.vol = parseInt("0");
		} else {
			rowData2.vol = parseInt(rowData[i].vol);
		}
		rowDataArray.push(rowData2);
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
//			setArray(getRs);
			console.log(setArray(getRs));
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