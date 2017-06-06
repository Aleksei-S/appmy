'use strict';

//СМР = ВСЕГО - прочие - транспорт - оборудование

var jobPos = angular.module('pos', []);
jobPos.controller('posCtrl', ['$scope','$http', function($scope,$http){








function tableRow (name="", total="0", CMP="0") {
  this.name = name;
  this.total = total;
  this.CMP = CMP;
}


$scope.arrRow = [];
$scope.arrRow.push(new tableRow("table","table","table"));
$scope.arrRow.push(new tableRow("table2222","table2222","table2222"));
$scope.arrRow.push(new tableRow("table3333","table3333","table3333"));


$scope.arrdb = [];

$scope.json = angular.toJson($scope.arrRow);




$scope.posSave = function (){
 $scope.response={};
 $http.post("/save",$scope.json).then(function success (response) {
	 console.log(response.data);
 });
};


$scope.posLoad = function (){
 $http.post("/load",$scope.json).then(function success (response) {
	 $scope.arrdb = angular.fromJson(response.data);
	  console.log($scope.arrdb[0].time);
	 // $scope.temp = angular.fromJson($scope.data.response);

 });

};

$scope.posChange = function ($event,db){
$scope.arrRow = this.rowDB.table;	
console.log(db);
console.log(this.rowDB.table);
};

$scope.posDel = function ($event,db){
$scope.arrRow = this.rowDB.table;	
console.log(db);
console.log(this.rowDB.table);

};






 }]);

