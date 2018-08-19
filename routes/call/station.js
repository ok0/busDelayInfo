var express = require("express");
var router = express.Router();
var date_utils  = require('date-utils');
var cFunc = require("../../common/func");
const CONFIG = require("../../common/config");
var request = require("request");

var setArray = function(body) { 
	console.log("station setArray start");
	var rowData = body.ServiceResult;
	var rowDataArray = new Array();
	var rowDataHeader = rowData.msgHeader[0];
	var date = new Date();
	var yyyy, mm, dd, hours, minutes, seconds;

	for(var _key in rowData.msgBody[0].itemList){
		var rowDataFin = new Object();
		var tmpRowData = new Object();
		
		yyyy = date.getFullYear();
		mm = (Number(date.getMonth())+1)+"";
		if(mm.length == 1){
			mm = "0"+mm;
		}else{
			mm = mm; 
		}
		dd = date.getDate();
		if(dd.length == 1){
			dd = "0"+dd;
		}else{
			dd = dd;
		}
		hours = date.getHours()+"";
		if(hours.length == 1){
			hours = "0"+hours;
		}else{
			hours = hours;
		}
		minutes = date.getMinutes()+"";
		if(minutes.length == 1){
			minutes = "0"+minutes;
		}else{
			minutes = minutes;
		}
		seconds = date.getSeconds()+"";
		if(seconds.length == 1){
			seconds = "0"+seconds;
		}else{
			seconds = seconds;
		}
		
		tmpRowData["regYMD"] = yyyy+""+mm+""+dd ;
		tmpRowData["regHours"] = hours;
		tmpRowData["regMinutes"] = minutes;
		tmpRowData["regSeconds"] = seconds;

		for(var _hKey in rowDataHeader){
			tmpRowData[_hKey] = rowDataHeader[_hKey][0].trim();
		}
		
		for(var _key2 in rowData.msgBody[0].itemList[_key]){
			tmpRowData[_key2] = rowData.msgBody[0].itemList[_key][_key2][0].trim();
		}
		rowDataArray.push(tmpRowData);
		
		var OPT = {
				headers: {
					"Content-Type": "application/json"
				}
				, url : "http://cloud.rosesystems.kr:9200/tmp_station/doc"
				, body : JSON.stringify(tmpRowData)
			};
		request.post(OPT, function(npErr, npRes, npBody) {
			console.log(npBody);
		});
	}
	
	var resultData = JSON.stringify(rowDataArray);
	
	console.log("station setArray end");
	return resultData;
	
}


// 하루종일 30초씩.
router.get("/", function(req, res, next) {
	var today = new Date().toISOString().substr(0, 10).replace('T', ' ').replace('-','').replace('-','').replace('-','');
	var now  = new Date();
	
	var hours = now.getHours()+"";
	var minutes = now.getMinutes()+"";
	var seconds = now.getSeconds()+"";
	
	if(hours.length == 1) {
		hours = "0"+hours;
	}
	if(minutes.length == 1) {
		minutes = "0"+minutes;
	}
	if(seconds.length == 1) {
		seconds = "0"+seconds;
	}
	
	var now_time = hours+""+minutes+""+seconds;
	var url = CONFIG.station.url + "?serviceKey=" + CONFIG.station.key + "&arsId=17004";
	
	cFunc.getApiData(url, function(getErr, getRs) {
		if( getErr ) {
			console.log(getErr);
			res.status(500).send();
		} else {
//			setArray(getRs);
			console.log(setArray(getRs));
		}
	});
});

module.exports = router;