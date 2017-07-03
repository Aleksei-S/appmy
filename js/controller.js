'use strict';



var rowCalculatePercent = ["В С Е Г О:", "квартирный жилой", "Прочие работы"];

var STRtable = ["Подготовка территории строительства",
"90 квартирный жилой дом (КПД-19)"
,"Наружные сети(подключение)"
,"Временные здания и сооружения"
, "Прочие работы и лимитированные затраты", "В С Е Г О:"]; 


var jobPos = angular.module('jobPos', []);





///////////////////// service !!!!!!!!! /////////////////////e
angular.module('jobPos').service('dataTable', function() {


this.getArrSummaYear = function (row) {
    console.log("tableStockroom");


    this.arrSummaYear = [];
    let summa = 0;
    for (var key in row) {

      if (typeof(row[key]) == "object") {
        let val = row[key].second;
        if (val == "-") {val = "0";}
        summa = summa + parseFloat(val);
        summa = parseFloat(summa.toFixed(2));
        if (key.indexOf('декабрь') !== -1 ) {
          this.arrSummaYear.push(summa);
          summa = 0;
        }
      }
    }
    this.arrSummaYear.push(summa);
    this.getMaxSummaYear();
  };



  this.getMaxSummaYear = function () { 
    this.maxSummaYear = Math.max(...this.arrSummaYear); 
  };

  this.arrSummaYear = [];
  this.maxSummaYear = 0;


  this.getArrayMonthAndYearsColdspan = function () {
    console.log("function getArrayMonthAndYearsColdspan");
    let mapMonth = {
      "Jan" : "январь",
      "Feb" : "февраль",
      "Mar" : "март",
      "Apr" : "апрель",
      "May" : "май",
      "Jun" : "июнь",
      "Jul" : "июль",
      "Aug" : "август",
      "Sep" : "сентябрь",
      "Oct" : "октябрь",
      "Nov" : "ноябрь",
      "Dec" : "декабрь"
    };
this.arrayMonth = []; //ОЧИСТИТЬ
this.arrayYearsColdspan = []; //ОЧИСТИТЬ
this.table = []; //ОЧИСТИТЬ !!!!!!!!!!!!!!!!!NONONONO
let timeMonth = new Date(this.dateBeginBuilding.getFullYear(), this.dateBeginBuilding.getMonth(), 1, 0, 0, 0, 0);
let num = this.dateBeginBuilding.getMonth();
let Year = this.dateBeginBuilding.getFullYear();
let countColdspan = 0;
let Obj = function (year, coldspan) {
  this.year = year;
  this.coldspan = coldspan;
};

for (var i = 0; i < parseInt(Math.ceil(this.timeBuilding)); i++) {

  if(num == 13) {
    num = 1;
  }

  timeMonth.setMonth(num++);
  this.arrayMonth.push(mapMonth[timeMonth.toString().substring(4,7)]);
  let yearNext = timeMonth.toString().substring(11,15);

  if (Year == yearNext) {
    countColdspan++;
  }else{ 
    this.arrayYearsColdspan.push(new Obj(Year,countColdspan));
    Year = yearNext; 
    countColdspan = 1;
  }
}

this.arrayYearsColdspan.push(new Obj(Year,countColdspan));
};

this.arrayYearsColdspan = [];
this.arrayMonth = [];
this.dateBeginBuilding = new Date(); //дата начала строительства
this.timeBuilding = 0;
this.timeBuildingCeil = 0;
this.getTimeBuildingCeil = function () {
  console.log('timeBuildingCeil');
  this.timeBuildingCeil = parseInt(Math.ceil(this.timeBuilding));
};



this.table = [];

this.getTable = function (table, copytable) {
  this.table = []; 
  if (copytable == true && table !== undefined) {

    for (var i = 0; i < table.length; i++) {
      let arr = [];
      let monthArr = [];
      for (var key in table[i]) {
        if (key == "name" || key == "total" || key == "CMP") {continue;}
        monthArr.push(key);
        arr.push(table[i][key]);
      } 
      if (arr.length == 0) {

        this.table.push(new this.rowTable(this.arrayMonth, table[i].name, table[i].total, table[i].CMP)); 
      } else {
        this.table.push(new this.rowTable(arr, table[i].name, table[i].total, table[i].CMP, monthArr)); 
      }

    }
    return;
  }
  if (table !== undefined) {
    for (var i = 0; i < table.length; i++) {
      this.table.push(new this.rowTable(this.arrayMonth, table[i].name, table[i].total, table[i].CMP)); 
    }
  } else {
    for (var i = 0; i < STRtable.length; i++) {
      this.table.push(new this.rowTable(this.arrayMonth, STRtable[i]));
    }
  }

};



this.rowTable = function (arr, name="-", total="-", CMP="-", monthArr) {
  this.name = name;
  this.total = total;
  this.CMP = CMP;
  for (var i = 0; i < arr.length; i++) {
    if (typeof(arr[i])=="object") {
      this[monthArr[i]] = {
        first : arr[i].first,
        second : arr[i].second
      };
    } else {
      this[arr[i]+i] = {
        first : "-",
        second : "-"
      };
    }
  } 
};

});











///////////////////// controller !!!!!!!!! /////////////////////
jobPos.controller('PosCtrl', ['$scope','dataTable','$compile', 'dataTableWork', function($scope, dataTable,$compile,dataTableWork){
    $scope.namePOS= "";
  $scope.dateBeginBuilding= new Date();
  $scope.timeBuilding = 0;
$scope.Percent = [];

 $scope.changTime = function (val) {
    dataTable.dateBeginBuilding = $scope.dateBeginBuilding;
    dataTable.timeBuilding = $scope.timeBuilding;
    dataTable.getArrayMonthAndYearsColdspan();
    dataTable.getTable($scope.table);
    dataTable.getTimeBuildingCeil();
    $scope.arrayMonth = dataTable.arrayMonth;
    $scope.arrayYearsColdspan = dataTable.arrayYearsColdspan;
    $scope.table = dataTable.table;
    $scope.timeBuildingCeil = dataTable.timeBuildingCeil;


    if ($scope.timeBuildingCeil == undefined) {$scope.timeBuildingCeil = 0;}
       $scope.Percent = new Array($scope.timeBuildingCeil);
    for (var i = 0; i < $scope.Percent.length; i++) {
      $scope.Percent[i] = "-";
    }


 }

$scope.$watch('Percent', function(newValue, oldValue, scope) {
  console.log('Percent');
  $scope.SummaPercent = 0;
  for (var i = $scope.Percent.length - 1; i >= 0; i--) {
    let a = $scope.Percent[i].replace('-', "0");
    $scope.SummaPercent = $scope.SummaPercent + parseFloat(a);
  }
},true);

$scope.calcPercentTable = function () {
  if ($scope.timeBuildingCeil == 0) {return;}
  if ($scope.SummaPercent != "100") {return;}

  for (var i = 0; i < $scope.table.length; i++) {
    for (var n = rowCalculatePercent.length - 1; n >= 0; n--) {
      if ($scope.table[i].name.indexOf(rowCalculatePercent[n]) !== -1) {
        let m = 0;
        for (var key in $scope.table[i]) {

          if (key == "name" || key == "total" || key == "CMP") {continue;}
          $scope.table[i][key].first = ($scope.table[i].total * $scope.Percent[m]*0.01).toFixed(2);
          $scope.table[i][key].second = ($scope.table[i].CMP * $scope.Percent[m]*0.01).toFixed(2);
          m++;
        }
      }
    }
  } 
  dataTable.getArrSummaYear($scope.table[$scope.table.length-1]);
}
///////////////////// ПРОЦЕНТЫ !!!!!!!!! /////////////////////


/////////////////////ВЫДЕЛЕНИЕ СТРОЧКИ!!!!!!!!!!!!!!/////////////////////
var RowKalendarniiIndex = "";
var elemDOM = "";

$scope.addRow = function (){
  if (RowKalendarniiIndex === "") {
    $scope.table.splice(0, 0, new dataTable.rowTable($scope.arrayMonth, "-"));
  } else {
    $scope.table.splice(RowKalendarniiIndex+1, 0, new dataTable.rowTable($scope.arrayMonth, "-"));
  }
};

$scope.deleteRow = function (){
  if (RowKalendarniiIndex === "") {
    return;
  }
  let lochNess = document.querySelector(".selected");
  if (lochNess!== null) {
    lochNess.classList.remove("selected");
  }

  $scope.table.splice(RowKalendarniiIndex, 1);
  RowKalendarniiIndex = "";
};

$scope.switchRow = function (str){

  let num = "";
  console.log(elemDOM.nextElementSibling );
  let row = $scope.table[RowKalendarniiIndex];
  if (str == "up" && -1 < RowKalendarniiIndex - 1) {
    num = RowKalendarniiIndex - 1;
    elemDOM = elemDOM.previousElementSibling;
  } else if (str == "down" && RowKalendarniiIndex + 1 < ($scope.table.length)) {
    num = RowKalendarniiIndex + 1; 
    elemDOM = elemDOM.nextElementSibling;
  } else {
    return;
  }
  $scope.table.splice(RowKalendarniiIndex, 1, $scope.table[num]);
  $scope.table.splice(num, 1, row);
  RowKalendarniiIndex = num;
  let lochNess = document.querySelector(".selected");
  if (lochNess!== null) {
    lochNess.classList.remove("selected");
  }
  elemDOM.classList.toggle("selected");
};

$scope.clickRowKalendarnii = function (currentTarget){
  if (currentTarget.classList.contains("selected")) {
    currentTarget.classList.remove("selected");
    RowKalendarniiIndex = "";
    elemDOM = "";
  } else {
    let lochNess = document.querySelector(".selected");
    if (lochNess!== null) {
      lochNess.classList.remove("selected");
      RowKalendarniiIndex = "";
      elemDOM = "";
    }
    elemDOM = currentTarget;
    currentTarget.classList.toggle("selected");
    RowKalendarniiIndex = $scope.table.indexOf(this.Row);
  }
};
/////////////////////ВЫДЕЛЕНИЕ СТРОЧКИ!!!!!!!!!!!!!!/////////////////////









$scope.savePos = function () {
  var b = 1;
  var c = 6;
  var a = c || b;
  console.log(a);
  console.log(dataTable.table);

  console.log($scope.arrayYearsColdspan);
// console.log($scope.dateBeginBuilding);
// console.log(dataTable.dateBeginBuilding);
// console.log(dataTable.timeBuilding($scope.timeBuilding));
}



////////////CCCOOOOOKIIIIE//////////////////////////
// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
expires: -1 ////////expires: 3600
})
}

// document.cookie = "arrRow=" + angular.toJson($scope.arrRow)
// + "; path=/; expires=" + (new Date(Date.now() + 7 * 86400).toGMTString());
// console.log( document.cookie );




$scope.delCookie = function (){
  deleteCookie("namePOS");
  deleteCookie("table");
  deleteCookie("dateBeginBuilding");
  deleteCookie("timeBuilding");
  deleteCookie("Percent");
  deleteCookie("workCapacity");
  deleteCookie("coefficient");

};



$scope.setCookie = function (){

let tabl=angular.fromJson(getCookie("table"));
//$scope.table=dataTable.table;
console.log(tabl);

 let time = angular.fromJson(getCookie("timeBuilding"));

 console.log(time);

 let timeBeginJson = angular.fromJson(getCookie("dateBeginBuilding"));

console.log(timeBeginJson);

let Percent = angular.fromJson(getCookie("Percent"));
 

 $scope.namePOS= angular.fromJson(getCookie("namePOS"));;
 $scope.dateBeginBuilding = new Date(timeBeginJson);
 $scope.timeBuilding = time;
 dataTable.dateBeginBuilding = $scope.dateBeginBuilding;
 dataTable.timeBuilding = $scope.timeBuilding;
 dataTable.getArrayMonthAndYearsColdspan();
 dataTable.getTable(tabl, true);
 dataTable.getTimeBuildingCeil();
 $scope.arrayMonth = dataTable.arrayMonth;
 $scope.arrayYearsColdspan = dataTable.arrayYearsColdspan;
 $scope.table = dataTable.table;
 $scope.timeBuildingCeil = dataTable.timeBuildingCeil;
 $scope.Percent = Percent;
$scope.workCapacity = angular.fromJson(getCookie("workCapacity"));
 dataTable.getArrSummaYear($scope.table[$scope.table.length-1]);
$scope.coefficient = angular.fromJson(getCookie("coefficient"));


};

$scope.saveCookie = function (){
  setCookie("namePOS",angular.toJson($scope.namePOS), 1200);
  setCookie("table",angular.toJson($scope.table), 1200);
  setCookie("dateBeginBuilding",angular.toJson($scope.dateBeginBuilding), 1200);
  setCookie("timeBuilding",angular.toJson($scope.timeBuilding), 1200);
  setCookie("Percent",angular.toJson($scope.Percent), 1200); 
  setCookie("workCapacity",angular.toJson($scope.workCapacity), 1200);
  setCookie("coefficient",angular.toJson($scope.coefficient), 1200); 
  console.log(angular.toJson($scope.table));
};



}]);






angular.module('jobPos').directive('tableKalendarnii', ['$compile', function($compile){

  return {
    restrict: 'E',
    templateUrl: 'views/directiv/tableKalendarnii.html',
    link: function($scope, elm, attrs, ctrl) {


    }
  };
}]);


angular.module('jobPos').directive( 'textTabl', function ($compile) {
  return {
    restrict: 'E',
scope: { text: '=', key: '@', dataval: '@'}, /////////// prob text: '@'
template: '<p ng-show="showInput" ng-click="clickOnText()">{{text}}</p><my-input ng-show="!showInput" dataval={{dataval}} mytext="text" mykey="{{key}}"></my-dir>',
replace: false,
controller: function ( $scope, $element, $attrs) {


  $scope.showInput=true;
  $scope.clickOnText = function () {
    $scope.showInput=false;
    setTimeout(function () {
      var elem = $element[0].firstChild.nextSibling;
      elem.focus();
    },100);

  };

},
};
});

angular.module('jobPos').directive('myInput', ['dataTable', function(dataTable){
  return {
    restrict: 'E',
    scope: { mytext: '=', mykey: '@'},
    template: '<input type="text" check-Num ng-change="change(mytext)" ng-model="mytext" ng-blur="inputBlur(mytext)" ng-keypress="pressKeyboard($event)" class="form-control input-sm">',
    replace: true,
    controller: function ( $scope, $element, $attrs) {

      $scope.inputBlur = function (event) {
        $scope.$parent.showInput =true; 
      };

      $scope.pressKeyboard = function (e) {
        if (e.charCode == 13) {
          $scope.inputBlur();
        }
      };

      $scope.change = function (val) {




if ($attrs.mykey == "total" || $attrs.mykey == "CMP") {
  $scope.calculateOther($scope.$parent.$parent.$parent.$parent.Row, $attrs.mykey, val);
} else if ($attrs.key == "name") {
  return;
} else {

 $scope.calculateColumn($scope.$parent.$parent.$parent.$parent.Row, $attrs.dataval, $attrs.mykey, val);
 $scope.calculateRow($scope.$parent.$parent.$parent.$parent.Row, $attrs, val );
} 
};


$scope.calculateOther = function (Row, key, val) {
  let other;
  let total;
  let result = 0;
  let scope = $scope.$parent.$parent.$parent.$parent;

  for (var i = 0; i < scope.table.length; i++){
    if ((scope.table[i].name).indexOf('Прочие работы') !== -1 ) {
      if (scope.table[i] == Row) {
        return;
      }
      other = scope.table[i];
      continue;
    }
    if ((scope.table[i].name).indexOf('В С Е Г О:') !== -1 ) {
      if (scope.table[i] == Row) {
        total = val;
      } else {
        total = scope.table[i][key].replace('-', "0");
      }
      continue;
    }
    let sum = scope.table[i][key].replace('-', "0");
    if (scope.table[i] == Row ) {
      sum = val.replace('-', "0");
    } 
    result = result + parseFloat(sum);
  }
  other[key] = (total - result).toFixed(2);
};


$scope.calculateRow = function (row,attrs,val) {


  if (!checkRowCalculate(row, rowCalculatePercent) || this.$parent.$parent.$parent.$last == true) {return;}
  let lastKey = Object.keys(row)[Object.keys(row).length - 1];
  let result = 0;
  for (var key in row){
    if (key == "name" || key == "total" || key == "CMP" || key == lastKey) {continue;}

    if (row[key]==row[attrs.mykey]) {
      result = result + parseFloat(val.replace("-","0"));
      continue;
    }

    if (attrs.dataval == "first") {
      result = result + parseFloat((row[key].first).replace("-","0"));
    } else {
      result = result + parseFloat((row[key].second).replace("-","0"));
    }
  }

  if (attrs.dataval == "first") {
    row[lastKey].first = (row.total.replace("-","0") - result).toFixed(2);

    for (var i = 0; i <  $scope.$parent.$parent.$parent.$parent.table.length; i++) {
      if (checkRowCalculate($scope.$parent.$parent.$parent.$parent.table[i],["квартирный жилой"])) { 
        $scope.calculateColumn($scope.$parent.$parent.$parent.$parent.table[i], "first" , lastKey, row[lastKey].second);
      }
    }

  } else {
    row[lastKey].second = (row.CMP.replace("-","0") - result).toFixed(2);

    for (var i = 0; i <  $scope.$parent.$parent.$parent.$parent.table.length; i++) {
      if (checkRowCalculate($scope.$parent.$parent.$parent.$parent.table[i],["квартирный жилой"])) { 
        $scope.calculateColumn($scope.$parent.$parent.$parent.$parent.table[i], "second" , lastKey, row[lastKey].second);
      }
    }

  }


//VSEGOOO
if (row == $scope.$parent.$parent.$parent.$parent.table[$scope.$parent.$parent.$parent.$parent.table.length-1]) {
console.log('vsego');
dataTable.getArrSummaYear(row);
}
//VSEGOOO
};







$scope.calculateColumn = function (row,dataval, mykey,val) {
 let result = 0;
 let table = $scope.$parent.$parent.$parent.$parent.table;
 let ResultRow;
 let TotalRow;



 for (var i = 0; i < table.length; i++) {

   if (checkRowCalculate(table[i],["квартирный жилой"])) {
     ResultRow = table[i];
     continue;

   }

   if (checkRowCalculate(table[i],["В С Е Г О:"])) {

     if (table[i] == row && dataval == "first" || table[i] == row && dataval == "second") {
       TotalRow = parseFloat(val);
     } else if (dataval == "first"){
       TotalRow = table[i][mykey].first;
     } else {
       TotalRow = table[i][mykey].second;
     }
     continue;
   }

   if (table[i] == row) {
     result = result + parseFloat(val.replace("-","0"));
     continue;
   }

   if (dataval == "first") {
    result = result + parseFloat((table[i][mykey].first).replace("-","0"));
  } else {
    result = result + parseFloat((table[i][mykey].second).replace("-","0"));
  }

}


if (dataval == "first") {
  ResultRow[mykey].first = (TotalRow - result).toFixed(2);
} else {
  ResultRow[mykey].second = (TotalRow - result).toFixed(2);
}


};








///////////////////
function checkRowCalculate (row, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (row.name.indexOf(arr[i]) !== -1) {
      return true;
    } else {
      continue;
    }
  }
  return false;
}
/////////////////

},
};
}]);





angular.module('jobPos').directive('checkNum', checkNum);
function checkNum() {
  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$formatters.unshift(function (fromValue) {
        if (fromValue == "-") { fromValue = 0;}
        return fromValue;
      });
      ctrl.$parsers.push(function(inValue) {
        inValue = inValue.replace(',', ".");
        if (inValue == 0 || inValue == "") {return inValue = "-";}
        return inValue;
      });
    }
  };
}






angular.module('jobPos').directive( 'textTablval', function ($compile) {
  return {
    restrict: 'E',
scope: { text: '=', key: '@', dataval: '@'}, /////////// prob text: '@'
template: '<p ng-show="showInput" ng-click="clickOnText()">{{text}}</p><my-inputval ng-show="!showInput" dataval={{dataval}} mytext="text" mykey="{{key}}"></my-inputval>',
replace: false,
controller: function ( $scope, $element, $attrs) {


  $scope.showInput=true;
  $scope.clickOnText = function () {
    $scope.showInput=false;
    setTimeout(function () {
      var elem = $element[0].firstChild.nextSibling;
      elem.focus();
    },100);

  };

},
};
});

angular.module('jobPos').directive('myInputval', function($compile){
  return {
    restrict: 'E',
    scope: { mytext: '=', mykey: '@'},
    template: '<input type="text" check-Num ng-change="change(mytext)" ng-model="mytext" ng-blur="inputBlur(mytext)" ng-keypress="pressKeyboard($event)" class="form-control input-sm">',
    replace: true,
    controller: function ( $scope, $element, $attrs) {

      $scope.inputBlur = function (event) {
        $scope.$parent.showInput =true; 
      };

      $scope.pressKeyboard = function (e) {
        if (e.charCode == 13) {
          $scope.inputBlur();
        }
      };

},
};
});


angular.module('jobPos').directive('checkNum', checkNum);
function checkNum() {
  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$formatters.unshift(function (fromValue) {
        if (fromValue == "-") { fromValue = 0;}
        return fromValue;
      });
      ctrl.$parsers.push(function(inValue) {
        inValue = inValue.replace(',', ".");
        if (inValue == 0 || inValue == "") {return inValue = "-";}
        return inValue;
      });
    }
  };
}

angular.module('jobPos').directive('checkTimeBuilding', checkTimeBuilding);
function checkTimeBuilding() {
  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.push(function(inValue) {
        inValue = inValue.replace(',', ".");
        scope.timeBuildingCeil = Math.ceil(inValue);
        return inValue;
      });
    }
  };
}

////////////////////////////////////////////////WORK TABLE//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////WORK TABLE//////////////////////////////////////////


angular.module('jobPos').service('dataTableWork', function(){

  this.getWorkTable = function (workCapacity, time) {
this.sumWorking = (workCapacity / time / 8 / 22).toFixed(0); //8час: X мес:22дн
this.ITR = (this.sumWorking * 0.155).toFixed(0); //15,5%
this.working = this.sumWorking - this.ITR;
this.workingInTheShift = (this.working * 0.7).toFixed(0); // в т.ч. рабочих * 70 %
this.ITRInTheShift = (this.ITR * 0.8).toFixed(0); // ИТР * 80% 
this.sumInTheShift = Math.ceil(parseFloat(this.workingInTheShift) + (this.ITRInTheShift * 0.5)); // (34+7x0,5) = 38 чел
}
this.sumWorking = 0;
this.ITR = 0;
this.working = 0;
this.workingInTheShift = 0;
this.ITRInTheShift = 0;
this.sumInTheShift = 0;

});


angular.module('jobPos').directive('tableWork', ['dataTableWork','dataTableHousehold', function(dataTableWork, dataTableHousehold){
  return {
    restrict: 'E',
    templateUrl: 'views/directiv/tableWork.html',
    link: function (scope, element, attrs) {
      scope.workCapacity = 0;
      scope.$watchGroup(['timeBuilding', 'workCapacity'], function(newValue, oldValue, scope) {
        if (newValue == oldValue) {return;}
        if ( scope.timeBuilding == 0 || scope.workCapacity == 0) {return;}
        console.log("watch getWorkTable");
        dataTableWork.getWorkTable(scope.workCapacity, scope.timeBuilding); 
        scope.ObjWorkTabl = dataTableWork;
        dataTableHousehold.getableHousehold();
        scope.CalcHousehold = dataTableHousehold;
      });
    }
  }
}]);

//////////////////////////////////////////////tableHousehold TABLE//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////tableHousehold TABLE//////////////////////////////////////////


angular.module('jobPos').service('dataTableHousehold', ['dataTableWork', function(dataTableWork){

  this.getableHousehold = function () {
    this.Prorab = (dataTableWork.ITRInTheShift*4).toFixed(1);
    this.Garderob = (dataTableWork.working*0.6).toFixed(1);
    this.Dyshevaya = (dataTableWork.workingInTheShift*0.287).toFixed(1);
    this.Ymivalna = (dataTableWork.sumInTheShift*0.065).toFixed(1);
    let Sysh = (dataTableWork.workingInTheShift*0.15).toFixed(1);
    if (Sysh < 4) {
      this.Syshilka = 4;
    } else {
      this.Syshilka = Sysh;
    }
    let Stol = (dataTableWork.sumInTheShift*0.25).toFixed(1);
    if (Sysh < 12) {
      this.Stolov = 12;
    } else {
      this.Stolov = Stol;
    }
    let Bit = (dataTableWork.workingInTheShift*0.1).toFixed(1);
    if (Bit < 8) {
      this.Bitovka = 8;
    } else {
      this.Bitovka = Bit;
    }
    this.Yborna = (dataTableWork.sumInTheShift*0.1).toFixed(1);
  }

  this.Prorab = 0;
  this.Garderob = 0;
  this.Dyshevaya = 0;
  this.Ymivalna = 0;
  this.Syshilka = 0;
  this.Stolov = 0;
  this.Bitovka = 0;
  this.Yborna = 0;

}]);

angular.module('jobPos').directive('tableHousehold', ['dataTableHousehold', function(dataTableHousehold){
  return {
    restrict: 'E',
    templateUrl: 'views/directiv/tableHousehold.html',
    link: function($scope, elm, attrs, ctrl) {

    }
  };
}]);




/////////////////////////////////////////////Stockroom TABLE//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Stockroom TABLE//////////////////////////////////////////



angular.module('jobPos').directive('tableStockroom', ['dataTable', function(dataTable){

  return {
    priority: 0,
    restrict: 'E',
    templateUrl: 'views/directiv/tableStockroom.html',
    link: function($scope, elm, attrs, ctrl) {

      $scope.coefficient=0;
      $scope.objStockroom = dataTable;

    }
  };
}]);

/////////////////////////////////////////////Resources TABLE//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Resources TABLE//////////////////////////////////////////

angular.module('jobPos').service('dataTableResources', function(){

  function ResourcesOBJcreate (summa, coefic) {
    let electric;
    let oil;
    let vapor;
    let compresAir;
    let waterHouse;
    let oxyden;
    let coef = coefic;
    let summaPlusCoef = summa / (2.7 * 1267 * coef);
    if (summaPlusCoef < 0.750) {
      electric = "205";
      oil = "97";
      vapor = "200";
      compresAir = "3.9";
      waterHouse = "0.3";
      oxyden = "4400";
    } else if (0.749 < summaPlusCoef && summaPlusCoef < 1.250) {
      electric = "185";
      oil = "69";
      vapor = "185";
      compresAir = "3.2";
      waterHouse = "0.23";
      oxyden = "4400";
    } else if (1.249 < summaPlusCoef && summaPlusCoef < 1.750) {
      electric = "140";
      oil = "52";
      vapor = "160";
      compresAir = "3.2";
      waterHouse = "0.2";
      oxyden = "4400";
    } else if (1.749 < summaPlusCoef && summaPlusCoef < 2.250) {
      electric = "100";
      oil = "44";
      vapor = "140";
      compresAir = "2.6";
      waterHouse = "0.16";
      oxyden = "4400";
    } else if (2.249 < summaPlusCoef) {
      electric = "70";
      oil = "40";
      vapor = "130";
      compresAir = "2.6";
      waterHouse = "0.16";
      oxyden = "4400";
    } else{
      electric = "-";
      oil = "-";
      vapor = "-";
      compresAir = "-";
      waterHouse = "-";
      oxyden = "-";
    }


    return{
      summa : summa,
      electric : electric,
      oil : oil,
      vapor : vapor,
      compresAir : compresAir,
      waterHouse : waterHouse,
      oxyden : oxyden
    }
  };


  this.getArrTable = function (coefficient, arrSummaYear) {
    this.arrSummaYearResources = [];
    for (var i = 0; i < arrSummaYear.length; i++) {
      this.arrSummaYearResources.push(new ResourcesOBJcreate(arrSummaYear[i], coefficient));
    }; 
    this.coefficient = coefficient;
    this.arrSummaYear = arrSummaYear;
    this.getvisi();
  }
  this.getvisi = function () {
    console.log('705 visi');
    if ( this.arrSummaYear.length < 2) {
      this.visi = true;
    } else { 
      this.visi = false;
    }
  }

  this.arrSummaYearResources = []; 
  this.coefficient = 0;
  this.arrSummaYear = [];
  this.visi = true;


  this.getArrResources = function (coefficient) {
    this.objResourcesArr = [];
    for (var i = 0; i < this.arrSummaYearResources.length; i++) {
      let electric = (this.arrSummaYearResources[i].summa/(2.7*1267*coefficient)*this.arrSummaYearResources[i].electric*1.02).toFixed(2);
      let oil = (this.arrSummaYearResources[i].summa/(2.7*1267*coefficient)*this.arrSummaYearResources[i].oil*1.02).toFixed(2);
      let vapor = (this.arrSummaYearResources[i].summa/(2.7*1267*coefficient)*this.arrSummaYearResources[i].vapor*1.02).toFixed(2);
      let compresAir = (this.arrSummaYearResources[i].summa/(2.7*1267*coefficient)*this.arrSummaYearResources[i].compresAir*1.03).toFixed(2);
      let waterHouse = (this.arrSummaYearResources[i].summa/(2.7*1267*coefficient)*this.arrSummaYearResources[i].waterHouse*1.03).toFixed(2);
      let oxyden = (this.arrSummaYearResources[i].summa/(2.7*1267*coefficient)*this.arrSummaYearResources[i].oxyden*1.03).toFixed(2);
      this.objResourcesArr.push(new this.objResources(electric, oil, vapor, compresAir, waterHouse, oxyden, 
        this.arrSummaYearResources[i].electric, this.arrSummaYearResources[i].oil, 
        this.arrSummaYearResources[i].vapor, this.arrSummaYearResources[i].compresAir, 
        this.arrSummaYearResources[i].waterHouse, this.arrSummaYearResources[i].oxyden));
    }
  }

  this.objResourcesArr = [];

  this.objResources = function (electric, oil, vapor, compresAir, waterHouse, oxyden, electricCoef, oilCoef, vaporCoef, compresAirCoef, waterHouseCoef, oxydenCoef){
    this.electric = electric;
    this.oil = oil;
    this.vapor = vapor;
    this.compresAir = compresAir;
    this.waterHouse = waterHouse;
    this.oxyden = oxyden;
    this.electricCoef = electricCoef;
    this.oilCoef = oilCoef;
    this.vaporCoef = vaporCoef;
    this.compresAirCoef = compresAirCoef;
    this.waterHouseCoef = waterHouseCoef;
    this.oxydenCoef = oxydenCoef;
  }
});






angular.module('jobPos').directive('tableResources', ['dataTableResources', function(dataTableResources){

  return {
    restrict: 'E',
    templateUrl: 'views/directiv/tableResources.html',
    link: function($scope, elm, attrs, ctrl) {

      $scope.tableResources = dataTableResources;

      $scope.$watchGroup(['objStockroom.arrSummaYear', 'coefficient'], function(newValue, oldValue, scope) {
        console.log('watch tableResources');
        if ($scope.objStockroom.arrSummaYear == undefined || $scope.objStockroom.arrSummaYear[0] == 0 || $scope.coefficient == 0) {return;}
        dataTableResources.getArrTable($scope.coefficient, $scope.objStockroom.arrSummaYear);
        dataTableResources.getArrResources($scope.coefficient);
      });
    }
  };
}]);







