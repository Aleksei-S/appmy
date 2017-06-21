'use strict';






var rowCalculatePercent = ["В С Е Г О:", "квартирный жилой", "Прочие работы"];

var STRtable = ["Подготовка территории строительства",
"90 квартирный жилой дом (КПД-19)"
,"Наружные сети(подключение)"
,"Временные здания и сооружения"
, "Прочие работы и лимитированные затраты", "В С Е Г О:"]; 
var rowCalculatePercent = ["В С Е Г О:", "квартирный жилой", "Прочие работы"];





var jobPos = angular.module('jobPos', []);

///////////////////// service !!!!!!!!! /////////////////////e
angular.module('jobPos').service('dataTable', function() {

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



// // Service
// function InboxService($http) {
// this.getEmails = function getEmails() {
// return $http.get('/emails');
// };
// }
// angular
// .module('app')
// .service('InboxService', InboxService);





///////////////////// controller !!!!!!!!! /////////////////////
jobPos.controller('PosCtrl', ['$scope','dataTable','$compile', 'dataTableWork', function($scope, dataTable,$compile,dataTableWork){
  $scope.dateBeginBuilding= new Date();
  $scope.timeBuilding = 0;


  $scope.$watch('timeBuilding', function(newValue, oldValue, scope) {
    dataTable.dateBeginBuilding = $scope.dateBeginBuilding;
    dataTable.timeBuilding = $scope.timeBuilding;
    dataTable.getArrayMonthAndYearsColdspan();
    dataTable.getTable($scope.table);
    dataTable.getTimeBuildingCeil();
    $scope.arrayMonth = dataTable.arrayMonth;
    $scope.arrayYearsColdspan = dataTable.arrayYearsColdspan;
    $scope.table = dataTable.table;
    $scope.timeBuildingCeil = dataTable.timeBuildingCeil;
//dataTable.refreshTable;
}, );

// dataTable.dateBeginBuilding ; //дата начала строительства
// dataTable.dateBeginBuilding = $scope.dateBeginBuilding;

// $scope.timeBuilding = dataTable.timeBuilding($scope.timeBuilding); // продолжительность строительства
// $scope.table = new Array();



///////////////////// ПРОЦЕНТЫ !!!!!!!!! /////////////////////
$scope.$watch('timeBuildingCeil', function(newValue, oldValue, scope) {
  console.log('$watchGroup timeBuildingCeil');
  $scope.Percent = new Array($scope.timeBuildingCeil);
  for (var i = $scope.Percent.length - 1; i >= 0; i--) {
    $scope.Percent[i] = "-";
  }
});

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
  deleteCookie("table");
  deleteCookie("timeBuilding");
  deleteCookie("timeBuildingCeil");
  deleteCookie("myFavorite");

};








$scope.setCookie = function (){


//dataTable.getTable(angular.fromJson(getCookie("table")));


//setTimeout(dataTable.table=angular.fromJson(getCookie("table")), 52);
//$scope.table=dataTable.table;
console.log(dataTable.table);
// $scope.$apply();
// setTimeout($scope.timeBuilding=angular.fromJson(getCookie("timeBuilding")), 1);
// setTimeout($scope.timeBuildingCeil=angular.fromJson(getCookie("timeBuildingCeil")), 2);

//$scope.timeBuildingCeil=getCookie("timeBuildingCeil");
//$scope.$apply($scope.timeBuildingCeil);


// let gg = getCookie("timeBuildingCeil");

// console.log(typeof(angular.fromJson(gg)));

// $scope.table=angular.fromJson(gg);
//$scope.table= angular.fromJson(gg);
// console.log(gg);
// console.log(gg == $scope.table);
};

$scope.saveCookie = function (){



  setCookie("table",angular.toJson($scope.table), 120);
// //setCookie("timeBuildingCeil", $scope.timeBuildingCeil, 120);

// setCookie("timeBuilding", angular.toJson($scope.timeBuilding), 120);
// setCookie("timeBuildingCeil", angular.toJson($scope.timeBuildingCeil), 120);

// setCookie("table", angular.toJson($scope.table), 120);





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
    scope: { text: '=', key: '@'},
    template: '<p ng-click="clickOnText()">{{text}}</p>',
    replace: true,
    controller: function ( $scope, $element ) {
      $scope.clickOnText = function () {
        var newElement = $compile("<my-input mytext='text' mykey='{{key}}'></my-dir>")($scope);
        $element.replaceWith($compile(newElement)($scope));
        setTimeout(function () {
          var elem = document.getElementById("edit");
          elem.focus();
          elem.selectionStart = elem.value.length;
        },100);
      };

    },
  };
});

angular.module('jobPos').directive('myInput', function($compile){
  return {
    restrict: 'E',
    scope: { mytext: '=', mykey: '@' },
    template: '<input type="text" check-Num id="edit" ng-model="mytext" ng-blur="inputBlur(mytext)" ng-keypress="pressKeyboard($event)" class="form-control input-sm">',
    replace: true,
    controller: function ( $scope, $element ) {
      $scope.inputBlur = function (event) {
        var newElement = $compile('<text-tabl text="mytext"></text-tabl>')($scope);
        $element.replaceWith($compile(newElement)($scope));
      };
      $scope.pressKeyboard = function (e) {
        if (e.charCode == 13) {
          $scope.inputBlur($element[0].value);
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




//angular.module('jobPos').directive('tableStockroom', ['dataTableStockroom', function(dataTableStockroom){




// angular.module('jobPos').directive('calculateTable', calculateTable);
// function calculateTable() {


  angular.module('jobPos').directive('calculateTable', ['dataTableStockroom','dataTable', function(dataTableStockroom, dataTable){
    return {
      require: '^textTabl',
      link: function($scope, elm, attrs, ctrl) {
        console.log(attrs.text);


        // $scope.$watch(attrs.text, function(newValue, oldValue, scope){
        //   console.log('watch');
        //   if (newValue == oldValue) {return;}
        //   $scope.calculate(attrs.key);
        // });


        $scope.$watch("table", function(newValue, oldValue, scope){
        //  console.log('watch');
          if (newValue == oldValue) {return;}
          $scope.calculate(attrs.key);
        }, true);

//  $scope.$watch(dataTable.table, function(newValue, oldValue, scope){

// console.log("dataTable.tabledataTable.tabledataTable.tabledataTable.tabledataTable.table");

// $scope.calculate(attrs.key);
//  },true);



        $scope.calculate = function (val) {
          if (attrs.key == "total" || attrs.key == "CMP") {
            $scope.calculateOther(attrs.key);
          } else if (attrs.key == "name") {
            return;
          } else {
            $scope.calculateRow($scope.$parent.$parent.Row, attrs);
            setTimeout($scope.calculateColumn($scope.$parent.$parent.Row, attrs, val), 10);
          } 
        };


        $scope.calculateOther = function (key) {
          let other;
          let totalRow;
          let result = 0;
          for (var i = 0; i < $scope.$parent.$parent.table.length; i++){
            if (($scope.$parent.$parent.table[i].name).indexOf('Прочие работы') !== -1 ) {
              other = $scope.$parent.$parent.table[i];
              continue;
            }
            if (($scope.$parent.$parent.table[i].name).indexOf('В С Е Г О:') !== -1 ) {
              totalRow = $scope.$parent.$parent.table[i];
              continue;
            }

            let sum = $scope.$parent.$parent.table[i][key].replace('-', "0");
            result = result + parseFloat(sum);
          }
          other[key] = (totalRow[key] - result).toFixed(2);
        };


        $scope.calculateRow = function (row,attrs) {
          if (!checkRowCalculate(row, rowCalculatePercent) || this.$parent.$last == true) {return;}
     

          let lastKey = Object.keys(row)[Object.keys(row).length - 1];
          let result = 0;
          for (var key in row){
            if (key == "name" || key == "total" || key == "CMP" || key == lastKey) {continue;}
            if (row[key][attrs.calculateTable] == "-") {row[key][attrs.calculateTable] = "0";}
            result = result + parseFloat(row[key][attrs.calculateTable]);
          }
          if (attrs.calculateTable == "first") {
            row[lastKey][attrs.calculateTable] = (row.total - result).toFixed(2);
          } else {
            row[lastKey][attrs.calculateTable] = (row.CMP - result).toFixed(2);
          }







        //VSEGOOO
        if (row == $scope.table[$scope.table.length-1]) {
          console.log('vsego');
          dataTableStockroom.getArrSummaYear(row);
        }






        };

        $scope.calculateColumn = function (row,attrs,key) {
          let result = 0;
          let table = $scope.$parent.$parent.$parent.table;
          let ResultRow;
          let TotalRow;
          for (var i = 0; i < table.length; i++) {

            if (checkRowCalculate(table[i],["квартирный жилой"])) {
              ResultRow = table[i];
              continue;
            }
            if (checkRowCalculate(table[i],["В С Е Г О:"])) {
              TotalRow = table[i];
              continue;
            }
            let num = table[i][key][attrs.calculateTable];
            if (num == "-") {num = "0";}
            result = result + parseFloat(num);
          }

          if (TotalRow[key][attrs.calculateTable] == "-") {TotalRow[key][attrs.calculateTable] = 0;}
          ResultRow[key][attrs.calculateTable] = TotalRow[key][attrs.calculateTable] - result;
          ResultRow[key][attrs.calculateTable] = (ResultRow[key][attrs.calculateTable]).toFixed(2);
        };

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



    }
  };
}]);
// }



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



angular.module('jobPos').service('dataTableStockroom', function(){

// this.getArrSummaYear = function (table) {
//     console.log("tableStockroom");

//   if (table==undefined) {return [0];}////mb i net
//   this.arrSummaYear = [];
//   let summa = 0;
//     for (var key in table[table.length-1]) {

//       if (typeof(table[table.length-1][key]) == "object") {
//         let val = table[table.length-1][key].second;
//         if (val == "-") {val = "0";}
//         summa = summa + parseFloat(val);
//         if (key.indexOf('январь') !== -1 ) {
//          this.arrSummaYear.push(summa);
//          summa = 0;
//         }
//      }
//     }
//   this.arrSummaYear.push(summa);
//   this.getMaxSummaYear();
// };

this.getArrSummaYear = function (row) {
    console.log("tableStockroom");


  this.arrSummaYear = [];
  let summa = 0;
    for (var key in row) {

      if (typeof(row[key]) == "object") {
        let val = row[key].second;
        if (val == "-") {val = "0";}
        summa = summa + parseFloat(val);
        if (key.indexOf('январь') !== -1 ) {
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

});






angular.module('jobPos').directive('tableStockroom', ['dataTableStockroom', function(dataTableStockroom){

  return {
    priority: 0,
    restrict: 'E',
    templateUrl: 'views/directiv/tableStockroom.html',
    link: function($scope, elm, attrs, ctrl) {


$scope.coefficient=0;
$scope.objStockroom = dataTableStockroom;


//        function objStockroom () {
//         this.arrSummaYear = function () {
// console.log("tableStockroom");
// if ($scope.table==undefined) {return [0];}////mb i net
// let resultArr = [];
// let summa = 0;
// for (var key in $scope.table[$scope.table.length-1]) {
  
//   if (typeof($scope.table[$scope.table.length-1][key]) == "object") {
//     let val = $scope.table[$scope.table.length-1][key].second;
//     if (val == "-") {val = "0";}
//     summa = summa + parseFloat(val);
//     if (key.indexOf('январь') !== -1 ) {
//      resultArr.push(summa);
//      summa = 0;
//    }
//  }
// }
// resultArr.push(summa);
// return resultArr;
// };

// this.maxSummaYear = function () { 
//   return Math.max(...this.arrSummaYear());   
// };     




// $scope.objStockroom = new objStockroom();


    }
  };
 }]);





/////////////////////////////////////////////Resources TABLE//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Resources TABLE//////////////////////////////////////////





// angular.module('jobPos').directive('tableResources', tableResources);

// function tableResources() {
//   return {
//     restrict: 'E',
//     templateUrl: 'views/directiv/tableResources.html',
//     link: function($scope, elm, attrs, ctrl) {

//      $scope.$watch('objStockroom.arrSummaYear()', function(newValue, oldValue, scope) {

//       let coefficient = $scope.coefficient;
//       let arrSummaYear = $scope.objStockroom.arrSummaYear();

//       let table = function () { 
//         let table=[];
//         for (var i = 0; i < arrSummaYear.length; i++) {
//          table.push(new ResourcesOBJcreate(arrSummaYear[i]));
//        };   
//        return table;
//      };     

//      $scope.tableResources = {
//       coefficient : coefficient,
//       arrSummaYear : arrSummaYear,
//       table : table(),
//       visi : function () {
//         console.log('705 visi');
//         if ( this.arrSummaYear.length < 2) {
//           return true;
//         } else { return false;}
//       },
//     };

//     $scope.CalculateResources = function (valSumma,valRes, coeff) {
//       if (valSumma == "0" || coeff == "0") { return "-";}
//       return (valSumma/(2.7*1267*$scope.coefficient)*valRes*coeff).toFixed(2);
//     }

//   },true);

//      function ResourcesOBJcreate (summa) {
//       let electric;
//       let oil;
//       let vapor;
//       let compresAir;
//       let waterHouse;
//       let oxyden;
//       let coef = function (argument) {
//         if ($scope.coefficient == 0) {return 1;}
//       };
//       let summaPlusCoef = summa / (2.7 * 1267 * coef());
//       if (summaPlusCoef < 0.750) {
//         electric = "205";
//         oil = "97";
//         vapor = "200";
//         compresAir = "3.9";
//         waterHouse = "0.3";
//         oxyden = "4400";
//       } else if (0.749 < summaPlusCoef && summaPlusCoef < 1.250) {
//         electric = "185";
//         oil = "69";
//         vapor = "185";
//         compresAir = "3.2";
//         waterHouse = "0.23";
//         oxyden = "4400";
//       } else if (1.249 < summaPlusCoef && summaPlusCoef < 1.750) {
//         electric = "140";
//         oil = "52";
//         vapor = "160";
//         compresAir = "3.2";
//         waterHouse = "0.2";
//         oxyden = "4400";
//       } else if (1.749 < summaPlusCoef && summaPlusCoef < 2.250) {
//         electric = "100";
//         oil = "44";
//         vapor = "140";
//         compresAir = "2.6";
//         waterHouse = "0.16";
//         oxyden = "4400";
//       } else if (2.249 < summaPlusCoef) {
//         electric = "70";
//         oil = "40";
//         vapor = "130";
//         compresAir = "2.6";
//         waterHouse = "0.16";
//         oxyden = "4400";
//       }
//       return{
//         summa : summa,
//         electric : electric,
//         oil : oil,
//         vapor : vapor,
//         compresAir : compresAir,
//         waterHouse : waterHouse,
//         oxyden : oxyden
//       }
//     };

//   }
// };
// }
























// angular.module('drag', []).
// directive('draggable', function($document) {
// return function(scope, element, attr) {
// var startX = 0, startY = 0, x = 0, y = 0;
// element.css({
// position: 'relative',
// border: '1px solid red',
// backgroundColor: 'lightgrey',
// cursor: 'pointer',
// display: 'block',
// width: '65px'
// });
// element.on('mousedown', function(event) {
// // Prevent default dragging of selected content
// event.preventDefault();
// startX = event.screenX - x;
// startY = event.screenY - y;
// $document.on('mousemove', mousemove);
// $document.on('mouseup', mouseup);
// });

// function mousemove(event) {
// y = event.screenY - startY;
// x = event.screenX - startX;
// element.css({
// top: y + 'px',
// left: x + 'px'
// });
// }

// function mouseup() {
// $document.off('mousemove', mousemove);
// $document.off('mouseup', mouseup);
// }
// };
// });