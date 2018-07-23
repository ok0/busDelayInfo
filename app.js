/* require */
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");


/* router */
var testRouter = require("./routes/testRouter");

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
app.use("/testRouter", testRouter);


/* LISTEN */
app.listen(3000, function() {
	console.log("Hello, This is App:300!");
});


module.exports = app;
