var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');








var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use('/js', express.static(path.dirname(__dirname)+'/js'));
app.use('/views', express.static(path.dirname(__dirname)+'/views'));
app.use('/bower_components', express.static(path.dirname(__dirname)+'/bower_components'));




app.get('/', function(req, res){
	res.sendFile(path.dirname(__dirname) + '/views/index.html');
});


///////mymymy

var namePOSJ= "";
var	tableJ= [];
var	timeBuildingJ= "";
var	dateBeginBuildingJ= "";
var PercentJ= [];
var workCapacityJ= "";
var coefficientJ= "";
///////mymymy


app.post('/ee', function(req, res){

	var pos = new POS({
		namePOS: req.body.namePOS,
		timeBuilding: req.body.timeBuilding,
		dateBeginBuilding: req.body.dateBeginBuilding,
		table: req.body.table,
		Percent: req.body.Percent,		
		workCapacity: req.body.workCapacity,
		coefficient: req.body.coefficient,
	});


namePOSJ = req.body.namePOS;
dateBeginBuildingJ = req.body.dateBeginBuilding;
timeBuildingJ = req.body.timeBuilding;
tableJ = req.body.table;
PercentJ = req.body.Percent;
workCapacityJ = req.body.workCapacity;
coefficientJ = req.body.coefficient;



	// res.send(req.body);
//res.send(path.dirname(__dirname) + '/views/index.html');
});



app.post('/obn', function(req, res){

let data = {
	namePOS: namePOSJ,
	dateBeginBuilding: dateBeginBuildingJ,
	timeBuilding: timeBuildingJ,
	table: tableJ,
	Percent: PercentJ,		
	workCapacity: workCapacityJ,
	coefficient: coefficientJ,
};

res.send(data);
});




var POS = require('../js/db/db').POS;




////////////////save//////////////////////////
app.post('/save', function(req, res){

	var pos = new POS({
		namePOS: req.body.namePOS,
		timeBuilding: req.body.timeBuilding,
		dateBeginBuilding: req.body.dateBeginBuilding,
		table: req.body.table,
		Percent: req.body.Percent,		
		workCapacity: req.body.workCapacity,
		coefficient: req.body.coefficient,
	});

	pos.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.send("pos save! ok!");

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



app.get('/makeDelete', function(req, res) {
console.log("I received a command!");
console.log(req.query._id); 

POS.findByIdAndRemove( req.query._id, function (err, todo) {  
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    if (err) {
    	console.log(err);
    } else {
    	var response = {
    		message: "Todo successfully deleted",
    	};
    	res.send("Todo successfully deleted");
    }

});
});



// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'ЛЕХАААААА' });
// });

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});