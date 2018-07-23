var express = require('express');
var router = express.Router();

router.get("/", function( req, res) {
	console.log("routes/testRouter/");
});

module.exports = router;
