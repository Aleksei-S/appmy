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



 //elems = document.getElementsByTagName( '*' );



	$scope.inputBlur = function (row, key){
		let valueRow = document.getElementById("edit").value;
		this.$parent.showInput = false;
		row[key] = valueRow;
	};

if (getCookie('arrRow') == undefined) {
	$scope.arrRow = [];
	$scope.arrRow.push(new tableRow("table","table","table"));
	$scope.arrRow.push(new tableRow("table2222","table2222","table2222"));
	$scope.arrRow.push(new tableRow("table3333","table3333","table3333"));
} else {
	$scope.arrRow = angular.fromJson(getCookie('arrRow'));
}

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}



$scope.$watch('arrRow', function(newValue, oldValue, scope) {
 
document.cookie = "arrRow=" + angular.toJson($scope.arrRow) + "; path=/; expires=" + (new Date(Date.now() + 7 * 86400).toGMTString());
console.log( document.cookie );
}, true);





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
		$scope.arrRow = this.rowDB.table;	// change tabl osn

		if ($event.currentTarget.classList.contains("selected")) {
			$event.currentTarget.classList.remove("selected");
			$scope.IDarrdb = "";
		} else {
			let lochNess = document.querySelector(".selected");
				if (lochNess!== null) {
					lochNess.classList.remove("selected");
				}
			$event.currentTarget.classList.toggle("selected");
			$scope.IDarrdb = this.rowDB._id;
		}
		console.log($scope.IDarrdb );
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

