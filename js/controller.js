'use strict';

//СМР = ВСЕГО - прочие - транспорт - оборудование

var jobPos = angular.module('pos', []);
jobPos.controller('posCtrl', ['$scope','$http', function($scope,$http){








	function tableRow (name="", total="0", CMP="0") {
		this.name = name;
		this.total = total;
		this.CMP = CMP;
	}

	$scope.showInput = false;

	$scope.clickshowInput = function (row, key){
		this.showInput = true;
		let valuehide = row[key];
		row[key] = "";
		setTimeout(function () {
			var elem = document.getElementById("edit");
			elem.focus();
			elem.value = valuehide;
		},100);
	};






	$scope.inputBlur = function (row, key){
		let valueRow = document.getElementById("edit").value;
		this.$parent.showInput = false;
		row[key] = valueRow;
	};


	$scope.arrRow = [];
	$scope.arrRow.push(new tableRow("table","table","table"));
	$scope.arrRow.push(new tableRow("table2222","table2222","table2222"));
	$scope.arrRow.push(new tableRow("table3333","table3333","table3333"));


	$scope.arrdb = [];


	$scope.IDarrdb = "";



	$scope.posSave = function (){
		$scope.response={};
		$scope.json = angular.toJson($scope.arrRow);
		$http.post("/save",$scope.json).then(function success (response) {
	// console.log(response.data);
});
	};


	$scope.posLoad = function (){
		$http.post("/load",$scope.json).then(function success (response) {
			$scope.arrdb = angular.fromJson(response.data);
	  //console.log($scope.arrdb[0].created);
	 // $scope.temp = angular.fromJson($scope.data.response);

	});
	};


	$scope.posChange = function ($event,db){
		$scope.arrRow = this.rowDB.table;	

		// $event.currentTarget.className
		var cn = $event.currentTarget.className, thc = " selected", start_idx = cn.indexOf(thc);
		if(start_idx == -1) cn += thc;
		else cn = cn.replace(thc,"");
		$event.currentTarget.className = cn;
		$scope.IDarrdb = this.rowDB._id;

		console.log(this.rowDB._id);
// console.log(db);
// console.log(this.rowDB.table);
};







$scope.posDel = function ($event,db){
	if ($scope.IDarrdb == "") {return;}
    //let id = { _id: $scope.IDarrdb};
	// id = angular.toJson(id);
	// console.log(id);

	// $http.post("/del", $scope.IDarrdb).then(function success (response) {
	// 	console.log(angular.fromJson(response.message));
	// // $scope.arrdb = angular.fromJson(response.data);
	//   //console.log($scope.arrdb[0].created);
	//  // $scope.temp = angular.fromJson($scope.data.response);

	// });

// $http.get({method: 'GET',
// 		url: '/makeDelete',
// 		params: {_id: $scope.IDarrdb}
// 	})
// .success(data, status, headers, config)
// .error(data, status, headers, config);

	// $http({method: 'GET',
	// 	url: '/makeDelete',
	// 	params: {_id: $scope.IDarrdb}
	// }).success(function(data) {
	// 	console.log(data);
	// }).error(function(data) {
	// 	console.error("error in posting");
	// });

var req = {
 method: 'GET',
 url: '/makeDelete',
 params: {_id: $scope.IDarrdb}
}

$http(req).then(function(response){ console.log(response.data);}, function(){});


};







}]);

