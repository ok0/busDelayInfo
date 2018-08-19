var request = require("request");
var fs = require("fs");
var async = require("async");
//var testFolder = 'D:\study\js\nodeProject\files\weather';
//var testFolder = 'D:/study/js/nodeProject/files/weather';
//var testFolder = 'D:/study/js/nodeProject/files/weather';
var testFolder = './files/traffic';
//var testFolder = './files/test222';
//fs.readdirSync(testFolder).forEach((fileName) => {
////	  const data = fs.readFileSync(`./${fileName}`);
////	  const string = data.toString();
//	  console.log(fileName);
//	  var fileFullName = testFolder+"/" + fileName
//	  fs.readFile(fileFullName, 'utf-8', function(error, data) {
//		    var data2 = JSON.parse(data);
////		    console.log(data2);
////		    console.log(data2.RealtimeWeatherStation);
//		    setArray(data2);
//		});
//	});

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
var setArray = function(fileName,body) {
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
//				, url : "http://cloud.rosesystems.kr:9200/shin_v2/doc"
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