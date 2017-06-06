var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');


var POS = require('../js/db/db').POS;

var table = [];

// POS.find({},function(err,docs){
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		var table = docs;
// 	}
// });   




var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use('/js', express.static(path.dirname(__dirname)+'/js'));
app.use('/views', express.static(path.dirname(__dirname)+'/views'));
app.use('/bower_components', express.static(path.dirname(__dirname)+'/bower_components'));
app.use('/js', express.static(path.dirname(__dirname)+'/js'));



app.get('*', function(req, res){
	res.sendFile(path.dirname(__dirname) + '/views/index.html');
});







app.post('/save', function(req, res){
	// console.log(req.body);
	// res.send(req.body);
	var pos = new POS({
		table: req.body
	});
	pos.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.send("ok");

		}
	});
});



app.post('/load', function(req, res){
	// console.log(req.body);
	// res.send(req.body);
	POS.find({},function(err,docs){
		if (err) {
			console.log(err);
		} else {
			res.send(docs);
		}
	});   
});

app.post('/del', function(req, res){
	// console.log(req.body);
	// res.send(req.body);
	POS.find({},function(err,docs){
		if (err) {
			console.log(err);
		} else {
			res.send(docs);
		}
	});   
});






// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'ЛЕХАААААА' });
// });

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});