var express = require('express');
var app = express();
var path = require('path');



app.use('/views', express.static(path.dirname(__dirname)+'/views'));
app.use('/bower_components', express.static(path.dirname(__dirname)+'/bower_components'));
app.use('/js', express.static(path.dirname(__dirname)+'/js'));



app.get('*', function(req, res){
  res.sendFile(path.dirname(__dirname) + '/views/index.html');
});








app.post('/ma', function(req, res){
console.log(req);
res.send("ffff");
});





// app.post('/', function(req, res) {
//     console.log(req);
// });



// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'ЛЕХАААААА' });
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});