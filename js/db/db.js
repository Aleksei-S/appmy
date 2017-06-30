var mongoose = require('mongoose');


//bluebird ili ES-6
mongoose.Promise = global.Promise;
//mongoose.connect(config.get("mongoose:uri"));

try {
	mongoose.connect('mongodb://localhost/test2');
} catch(e) {
	// statements
	console.log(e);
}

//mongoose.connect('mongodb://localhost/test2');
var Schema = mongoose.Schema;


var schema = new Schema({
	table:[],
	created:{
		type:Date,
		default:Date.now
	}
});


// var POS = mongoose.model('POS', schema);



exports.POS = mongoose.model('POS', schema);






// POS.find({},function(err,docs){
//   if (err) {
//     console.log(err);
//   } else {
// for (variable in docs[10]) {
// 	console.log(variable);
// }
//     console.log(docs[10].comments);
//   }
 // });     
