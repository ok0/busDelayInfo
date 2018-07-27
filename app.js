/* require */
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");


/* router */
var callWeather = require("./routes/call/weather");
var callTraffic = require("./routes/call/traffic");
var callStation = require("./routes/call/station");

/* other.. */
var app = express();

/* view engine */
app.set('view engine', 'ejs');
app.set('views', './views');

/*정적 파일경로*/
app.use("/public", express.static('public'));
app.use("/modules", express.static('node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/* routes */
app.use("/call/weather", callWeather);
app.use("/call/traffic", callTraffic);
app.use("/call/station", callStation);


/* LISTEN */
app.listen(3000, function() {});


module.exports = app;
