'use strict';

var jobPos = angular.module('jobPos', []);

jobPos.controller('PosCtrl', ['$scope', function($scope){


  $scope.STRtable = new Array("Подготовка территории строительства",
    "90 квартирный жилой дом (КПД-19)"
    ,"Наружные сети(подключение)"
    ,"Временные здания и сооружения"
    , "Прочие работы и лимитированные затраты", "В С Е Г О:" ); 



$scope.dateBeginBuilding = new Date(); //дата начала строительства
$scope.timeBuilding = 0; // продолжительность строительства
$scope.timeBuildingCeil = 0; 
$scope.table = new Array();          
$scope.arrayMonth = new Array();      
$scope.arrayYearsColdspan = new Array();


function tableRow (arr, name="", total="0", CMP="0") {
  this.name = name;
  this.total = total;
  this.CMP = CMP;
  for (var i = 0; i < arr.length; i++) {
    this[arr[i]+i] = new objValue();
  } 
}


$scope.createTable = function (oldTable){
  if (oldTable.length == 0) {
    for (var i = 0; i < $scope.STRtable.length; i++) {
      $scope.table.push(new tableRow($scope.arrayMonth, $scope.STRtable[i]));
    }
  } else {
    for (var i = 0; i < oldTable.length; i++) {
      $scope.table.push(new tableRow($scope.arrayMonth, oldTable[i].name,oldTable[i].total,oldTable[i].CMP));
    }
  }
}

function objValue (first="-", second = "-") {
  this.first = first;
  this.second = second;
}


$scope.valueCheck = function (val) {
  if(val instanceof objValue === true) {
    return true;
  }
  return false;
}

$scope.save = function (val) {

  console.log($scope.table);
}




}]);







angular.module('jobPos').directive('tableKalendarnii', tableKalendarnii);

function tableKalendarnii() {
  var mapMonth = {
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
  return {
    restrict: 'E',
    templateUrl: 'views/directiv/tableKalendarnii.html',
    link: function($scope, elm, attrs, ctrl) {

      $scope.$watchGroup(['timeBuilding', 'dateBeginBuilding'], function(newValue, oldValue, scope) {
           let oldTable = $scope.table;   //save old

        $scope.arrayMonth =  Array(); //ОЧИСТИТЬ
        $scope.arrayYearsColdspan =  Array(); //ОЧИСТИТЬ
        $scope.table = [];               //ОЧИСТИТЬ  !!!!!!!!!!!!!!!!!NONONONO
        let timeMonth = new Date($scope.dateBeginBuilding.getFullYear(), $scope.dateBeginBuilding.getMonth(), 1, 0, 0, 0, 0);
        let num = $scope.dateBeginBuilding.getMonth();
        let Year = $scope.dateBeginBuilding.getFullYear();
        let countColdspan = 0;
        let Obj = function (year, coldspan) {
          this.year = year;
          this.coldspan = coldspan;
        };
        let ObjMonth = function (Month, value) {
          this.Month = Month;
          this.value = value;
        };

        for (var i = 0; i < parseInt(Math.ceil($scope.timeBuilding)); i++) {

          if(num == 13) {
            num = 1;
          }

          timeMonth.setMonth(num++);
          $scope.arrayMonth.push(new ObjMonth(mapMonth[timeMonth.toString().substring(4,7)],(100/$scope.timeBuilding).toFixed(0)));
          let yearNext = timeMonth.toString().substring(11,15);

          if (Year == yearNext) {
            countColdspan++;
          }else{ 
            scope.arrayYearsColdspan.push(new Obj(Year,countColdspan));
            Year = yearNext; 
            countColdspan = 1;
          }
        }

        $scope.arrayYearsColdspan.push(new Obj(Year,countColdspan));
        $scope.createTable(oldTable);
      });
    }
  };
}



angular.module('jobPos').directive( 'textTabl', function ( $compile ) {
  return {
    restrict: 'E',
    scope: { text: '=', key: '@'},
    template: '<p ng-click="clickOnText()">{{text}}</p>',
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


angular.module('jobPos').directive('calculateTable', calculateTable);
function calculateTable() {
  return {
    require: '^textTabl',
    link: function($scope, elm, attrs, ctrl) {
     $scope.$watch(attrs.text, function(newValue, oldValue, scope){
      if (newValue == oldValue) {return;}
      $scope.calculate();
    });

     $scope.calculate = function (val) {
       if (attrs.key == "total" || attrs.key == "CMP") {
        $scope.calculateOther($scope.mykey);
      }
    };
    $scope.calculate = function (val) {
     if (attrs.key == "total" || attrs.key == "CMP") {
      $scope.calculateOther(attrs.key);
    }
  };

  $scope.calculateOther = function (key) {
    let other;
    let totalRow;
    let rezult = 0;

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
      rezult = rezult + parseFloat(sum);
    }
    other[key] = totalRow[key] - rezult;

  };


}
};
}



















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







// $scope.addRow = function (name){
//   $scope.table.splice(0, 0, new tableRow($scope.arrayMonth, name));
// };

// $scope.deleteRow = function (index){
//  $scope.table.splice(index, 1);
// };

// $scope.switchRow = function (index, str){
//  let row = $scope.table[index];
//  let num = "";

//  if (str == "up") {
//   num = index - 1;
//   } else {
//   num = index + 1;
//   }

//   if (-1 < num && num < ($scope.table.length)) {
//   $scope.table.splice(index, 1,  $scope.table[num]);
//   $scope.table.splice(num, 1,  row);
//   }
// };



// ///////////////FOR PERCENT
// $scope.clickPercent = function ($event, MonthObj){
//   let valueHide = MonthObj.value;
//   this.Month.value=""; 
//   this.showInput = true;
//   setTimeout(function () {
//     var elem = document.getElementById("edit");
//     elem.focus();
//     elem.value = valueHide;
//   },100);
// }

// $scope.inputPercentBlur = function (){
//   this.$parent.showInput = false;
//   this.$parent.Month.value = document.getElementById("edit").value;
//   checkRowPercent(this.$parent.$parent.arrayMonth);
//   refreshTable ();
// };

// function checkRowPercent (arrayMonth) {
//   let result = 100;
//   for (var i = 0; i < arrayMonth.length-1; i++) {
//     result = result - arrayMonth[i].value;
//   }
//   arrayMonth[arrayMonth.length-1].value = result;
// }
// ///////////////FOR PERCENT




// function watchTable(row, key) {
//   if (key == "total" || key == "CMP") {
//     refreshTable ();
//   } else {
//     refreshLastValueTable (row);
//   }
//   watchCoefficient (); //// для коэфициента 2,7*1267*....
// }

// //расчет последнего месяца
// function refreshLastValueTable (row) {
//   let arr = [];
//   arr = arr.concat($scope.rowCalculatePercent, $scope.rowCalculateLastMonth, $scope.rowCalculateFirstAndLastMonth);

//   if (checkRowCalculate(row, arr)) {
//    calculateLastMonthTable(row);
//    calculateOther ();
//  }
// }

// //расчет последнего месяца продолжение
// function calculateLastMonthTable (row) {
//  let result = []; 
//  let val = lastANDfirstKey(row)[1];
//  result[0] = row.total;
//  result[1] = row.CMP;

//  for (var key in row){
//   if (key == "name" || key == "total" || key == "CMP"  || key == val) {
//     continue; 
//   }
//   result[0] = result[0] - row[key].first;
//   result[1] = result[1] - row[key].second;
// }

// row[val].first = result[0];
// row[val].second = result[1];
// }

// function calculateOther () {
//   let other;
//   let totalRow;

//   for (var i = 0; i < $scope.table.length; i++){
//     if (($scope.table[i].name).indexOf('Прочие работы') !== -1 ) {
//       other = $scope.table[i];
//     }
//     if (($scope.table[i].name).indexOf('В С Е Г О:') !== -1 ) {
//       totalRow = $scope.table[i];
//     }
//   }

//   for (var key in other) {
//     let result = [];

//     if (key == "name") {
//       continue; 
//     }
//     if (key == "total" || key == "CMP") {
//       result[0] = totalRow[key];
//     } else {
//       result[0] = totalRow[key].first;
//       result[1] = totalRow[key].second;
//     }

//     for (var i = 0; i < $scope.table.length; i++){

//       if (($scope.table[i].name).indexOf('В С Е Г О:') !== -1 || ($scope.table[i].name).indexOf('Прочие работы') !== -1) {
//         continue; 
//       }
//       if (key == "total" || key == "CMP") {
//         result[0] = result[0] - $scope.table[i][key];
//       } else {
//         result[0] = result[0] - $scope.table[i][key].first;
//         result[1] = result[1] - $scope.table[i][key].second;
//       }
//     }

//     if (key == "total" || key == "CMP") {
//       other[key] =  result[0];
//     } else {
//       other[key].first = result[0];
//       other[key].second = result[1];
//     }
//   }
//   calculateLastMonthTable (other);
// }



// $scope.rowCalculatePercent = ["В С Е Г О:", "квартирный жилой"];
// $scope.rowCalculateLastMonth = ["сети"];
// $scope.rowCalculateFirstMonth = ["Подготовка"];
// $scope.rowCalculateFirstAndLastMonth = ["Временные здания"];
// //как считать строки
// function checkRowCalculate (row, arr) {
//   for (var i = 0; i < arr.length; i++) {
//     if (row.name.indexOf(arr[i]) !== -1) {
//       return true;
//     } else {
//       continue;
//     }
//   }
//   return false;
// }


// //ВЫЧИСЛЕНИЕ!!!!!!!!!!!!!
// function refreshTable () {

//   //каждой строки в табице кроме прочие
//   for (var i = 0; i < $scope.table.length; i++){
//     if (($scope.table[i].name).indexOf('Прочие работы') !== -1 ) {
//       continue;
//     }
//     // проценты расчет
//     if ($scope.table[i].total !== "0" && checkRowCalculate($scope.table[i], $scope.rowCalculatePercent)) {
//       calculatePercentRow($scope.table[i]);
//       continue;
//     }
//     // расчет последний месяц
//     if ($scope.table[i].total !== "0" && checkRowCalculate($scope.table[i], $scope.rowCalculateLastMonth)) {
//       calculateLastMonth($scope.table[i]);
//       continue;
//     }
//    // расчет первый месяц
//    if ($scope.table[i].total !== "0" && checkRowCalculate($scope.table[i], $scope.rowCalculateFirstMonth)) {
//     calculateFirstMonth($scope.table[i]);
//     continue;
//   }
//     // расчет первый и последний месяц
//     if ($scope.table[i].total !== "0" && checkRowCalculate($scope.table[i], $scope.rowCalculateFirstAndLastMonth)) {
//       calculateFirstAndLastMonth($scope.table[i]);
//       continue;
//     }
//   }
//   calculateOther();
// }

//  // проценты расчет
//  function calculatePercentRow (row) {
//   let count = 0;
//   for (var key in row) {
//     if (key == "name" || key == "total" || key == "CMP") {
//      continue; 
//    }
//    row[key].first = row.total * $scope.arrayMonth[count].value / 100;
//    row[key].first =+ row[key].first.toFixed(2);

//    row[key].second = row.CMP * $scope.arrayMonth[count].value / 100;
//    row[key].second =+ row[key].second.toFixed(2);
//    count++;
//  } 
// }

// // расчет последний месяц
// function calculateLastMonth (row) {
//   let val = lastANDfirstKey(row)[1];
//   row[val].first = row.total;
//   row[val].second = row.CMP;
// }

// // расчет первый месяц
// function calculateFirstMonth (row) {
//   let val = lastANDfirstKey(row)[0];
//   row[val].first = row.total;
//   row[val].second = row.CMP;
// }

// // расчет первый и последний месяц
// function calculateFirstAndLastMonth (row) {
//   let val = lastANDfirstKey(row);
//   row[val[0]].first = row.total * 0.8;
//   row[val[0]].second = row.CMP * 0.8;
//   row[val[1]].first = row.total * 0.2;
//   row[val[1]].second = row.CMP * 0.2;
// }


// function lastANDfirstKey(row){
//   let keys = new Array(2)
//   let valFirst = "";
//   let valLast = "";
//   for (var key in row) {
//     if ($scope.valueCheck(row[key]) && valFirst == "") {
//       valFirst = key;
//     } 
//     valLast = key;
//   } 
//   keys[0] = valFirst;
//   keys[1] = valLast;
//   return keys;
// }




// // function replaceOnNumber () {
// //   for (var i = 0; i < $scope.table.length; i++){
// //     for (var key in $scope.table) {
// //       if ($scope.table[key] == "-") {
// //         $scope.table[key] = "0";
// //       }
// //     }
// //   }
// // }

// // function replaceOnMinus () {
// //   for (var i = 0; i < $scope.table.length; i++){
// //     for (var key in $scope.table) {
// //       if ($scope.table[key] == "0") {
// //         $scope.table[key] = "-";
// //       }
// //     }
// //   }
// // }


// ////////////////////////////////////////////////WORK TABLE//////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////WORK TABLE//////////////////////////////////////////


// function WorkTabl (workCapacity) {
//   return{
//     workCapacity : workCapacity,
//     sumWorking : function () {
//       if (workCapacity == "" || $scope.timeBuilding == "") {return "";}
//       return Math.ceil(this.workCapacity / 8 / 22 / $scope.timeBuilding); //8час: X мес:22дн
//     },
//     ITR : function () {
//       if (workCapacity == "" || $scope.timeBuilding == "") {return "";}
//       return Math.ceil(this.sumWorking() * 0.155); //15,5% 
//     },
//     working : function () {
//       if (workCapacity == "" || $scope.timeBuilding == "") {return "";}
//       return this.sumWorking() - this.ITR(); //8час: X мес:22дн
//     },
//     workingInTheShift : function () {
//       return Math.ceil(this.working() * 0.7); // в т.ч. рабочих * 70 %
//     },
//     ITRInTheShift : function () {
//       return  Math.ceil(this.ITR() * 0.8); // ИТР * 80% 
//     },
//     sumInTheShift : function () {
//       return  Math.ceil(this.workingInTheShift() + this.ITRInTheShift() * 0.5); // (34+7x0,5) = 38 чел 
//     }
//   }
// }

// $scope.ObjWorkTabl = WorkTabl("");

// $scope.clickWorkTabl = function (event){
//   setTimeout(function () {
//     var elem = document.getElementById("edit2");
//     elem.focus();
//     elem.value = $scope.ObjWorkTabl.workCapacity;
//   },100);
// };

// $scope.inputWorkTabl = function (value){
//  $scope.ObjWorkTabl =  WorkTabl(value);
// };



// ////////////////////////////////////////////////Resources TABLE//////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////Resources TABLE//////////////////////////////////////////

// $scope.coefficient = new Number(); // 2,7 (84год) х 1267(91год) х0,70842 (текущий)
// $scope.ResourcesTablar = [];
// $scope.ResourcesVisible = true;
// $scope.maxSummaYear = new Number(); 

// $scope.$watchGroup(['timeBuilding', 'dateBeginBuilding', 'coefficient'], function(newValue, oldValue, scope) {
//   if ($scope.timeBuilding == 0 || $scope.coefficient == 0) {return;}
//   watchCoefficient();
//   if (1 < ResourcesTablSumma().length ) {
//     $scope.ResourcesVisible = false;
//   } else {
//     $scope.ResourcesVisible = true;
//   }
// });

// function watchCoefficient () {
//   $scope.ResourcesTablar = [];
//   for (var i = 0; i < ResourcesTablSumma().length; i++) {
//     $scope.ResourcesTablar.push(new ResourcesOBJcreate( ResourcesTablSumma()[i]));
//   }
//   $scope.maxSummaYear = Math.max(...ResourcesTablSumma());
// }

// function ResourcesTablSumma() {
//   let rezult = [];
//   let count = 0;
//   let i = 0;
//     let row = $scope.table[$scope.table.length-1]; //if (($scope.table[i].name).indexOf('В С Е Г О:') !== -1) {
//       let summa = 0;
//       for (var key in row) {
//         if ($scope.valueCheck(row[key])) {
//           let month = $scope.arrayYearsColdspan[i].coldspan;
//           count ++;
//           summa = summa + row[key].second;
//           if (count == month) {
//             count = 0;
//             i ++;
//             rezult.push(summa);
//             summa = 0;
//           }

//         }
//       }
//   return rezult;
// }



// function ResourcesOBJcreate (summa ) {
//   let electric;
//   let oil;
//   let vapor;
//   let compresAir;
//   let waterHouse;
//   let oxyden;
//   let summaPlusCoef = summa / (2.7 * 1267 * $scope.coefficient);
//   if (summaPlusCoef < 0.750) {
//     electric = "205";
//     oil = "97";
//     vapor = "200";
//     compresAir = "3.9";
//     waterHouse = "0.3";
//     oxyden = "4400";
//   } else if (0.749 < summaPlusCoef && summaPlusCoef < 1.250) {
//     electric = "185";
//     oil = "69";
//     vapor = "185";
//     compresAir = "3.2";
//     waterHouse = "0.23";
//     oxyden = "4400";
//   } else if (1.249 < summaPlusCoef && summaPlusCoef < 1.750) {
//     electric = "140";
//     oil = "52";
//     vapor = "160";
//     compresAir = "3.2";
//     waterHouse = "0.2";
//     oxyden = "4400";
//   } else if (1.749 < summaPlusCoef && summaPlusCoef < 2.250) {
//     electric = "100";
//     oil = "44";
//     vapor = "140";
//     compresAir = "2.6";
//     waterHouse = "0.16";
//     oxyden = "4400";
//   } else if (2.249 < summaPlusCoef) {
//     electric = "70";
//     oil = "40";
//     vapor = "130";
//     compresAir = "2.6";
//     waterHouse = "0.16";
//     oxyden = "4400";
//   }

//   return{
//     summa : summa,
//     electric : electric,
//     oil : oil,
//     vapor : vapor,
//     compresAir : compresAir,
//     waterHouse : waterHouse,
//     oxyden : oxyden
//   }
// }










