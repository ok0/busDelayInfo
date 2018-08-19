var request = require("request");
var fs = require("fs");
var async = require("async");
//var testFolder = 'D:\study\js\nodeProject\files\weather';
//var testFolder = 'D:/study/js/nodeProject/files/weather';
//var testFolder = 'D:/study/js/nodeProject/files/weather';
var testFolder = './files/weather';
//var testFolder = './files/새 폴더';
fs.readdir(testFolder,'utf-8', function(err,files) {
	console.log(files);
	async.eachOfSeries(files
		, function(file, idx, doneCallback) {
			setTimeout( function() {
				//console.log(file);
				var fileFullName = testFolder+"/" + file;
				fs.readFile(fileFullName, 'utf-8', function(error, data) {
				    var data2 = JSON.parse(data);
		//		    console.log(data2);
		//		    console.log(data2);
		//		    console.log(data2.RealtimeWeatherStation);
				    setArray(files,data2);
				    doneCallback(null);
				});
			}, 2500);
		}
		, function (err) {
			if( err ) {
				console.log(err);
			} else {
				console.log("SUCCESS");
			}
		}
	);
})
//fs.readdir(testFolder).forEach((fileName) => {
////	  const data = fs.readFileSync(`./${fileName}`);
////	  const string = data.toString();
//	  console.log(fileName);
//	  var fileFullName = testFolder+"/" + fileName
//	  fs.readFile(fileFullName, 'utf-8', function(error, data) {
//		    var data2 = JSON.parse(data);
////		    console.log(data2);
////		    console.log(data2.RealtimeWeatherStation);
//		    setArray(fileName,data2);
//		});
//	});


var setArray = function(fileName,body) {
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
//		console.log(JSON.stringify(rowDataFin));
		request.put(OPT, function(npErr, npRes, npBody) {
			if( npErr ) {
				console.log(npErr);
			} else {
				console.log(fileName+npBody+" "+npErr);
			}
		});
//		request.post(OPT, function(npErr, npRes, npBody) {
//			console.log(npBody);
//		});
	}
	var rowData3 = JSON.stringify(rowDataArray);
	console.log("weather setArray end");
	return rowData3;
}