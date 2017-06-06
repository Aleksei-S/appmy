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
$scope.arrRow.push(new tableRow("tableName","tableTotal","tableCMP"));
$scope.arrRow.push(new tableRow("tableName2222","tableTotal2222","tableCMP2222"));
$scope.arrRow.push(new tableRow("tableName3333","tableTotal3333","tableCMP3333"));








$scope.posSave = function (){

 $scope.response={};
 $http.post("/ma",{ message : "message"}).then(function success (response) {
	 console.log(response);
 });

// $http.post('request-url',  { 'message' : "messageGGGGGGGGGG" });











};


$scope.posLoad = function (){

};












 }]);

