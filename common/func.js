var request = require("request");
var fs = require("fs");
var iconv = require("iconv-lite");
var charset = require("charset");
var xml2js = require("xml2js");
var xmlParser = new xml2js.Parser();


var cFunc = {};
cFunc.getApiData = function(url, callback) {
	var OPT = {
		url : url
		, encoding : "binary"
	};
	
	request.get(OPT, function(err, res, body){
		statusCode = res.statusCode;
		if( statusCode === 200 || statusCode == 201 || statusCode == 202 || statusCode == 204 || statusCode == 205 ) {
			var enc = charset(res.headers, body);
			var encsTmp = iconv.decode(body, enc);
			xmlParser.parseString(encsTmp, function(xmlErr, encs) {
				if( xmlErr ) {
					callback("XML parsing error", null);
				} else {
					callback(null, encs);
				}
			});
		} else {
			console.log(err, statusCode);
			callback("request error", null);
		}
	});
}

cFunc.writeXmlToJson = function(dir, filename, body, callback) {
	var dirPath = __dirname+"/../files/" + dir;
	var fileRename = filename + ".json";
	var filePath = dirPath + "/"+fileRename;
	
	cFunc.mkdirPath(dirPath);
	fs.open(filePath, "w+", function(openError) {
		if( !openError ) {
			fs.writeFile(filePath, JSON.stringify(body), "utf-8", function(fsError) {
				if( fsError ) {
					callback("writeFile Error", null);
				} else {
					callback(null, null);
				}
			});
		} else {
			console.log(openError);
			callback("Open file error", null);
		}
	});
}

cFunc.mkdirPath = function mkdirpath(dirPath) {
	if( !fs.existsSync(dirPath) ) {
		try {
			fs.mkdirSync(dirPath);
		} catch(e) {
			mkdirpath(path.dirname(dirPath));
			mkdirpath(dirPath);
		}
	}
}


module.exports = cFunc;