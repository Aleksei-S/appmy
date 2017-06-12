'use strict';

var jobPos = angular.module('jobPos', []);

jobPos.controller('PosCtrl', ['$scope', function($scope){


  $scope.STRtable = new Array("Подготовка территории строительства",
    "90 квартирный жилой дом (КПД-19)"
    ,"Наружные сети(подключение)"
    ,"Временные здания и сооружения"
    , "Прочие работы и лимитированные затраты", "В С Е Г О:" ); 
  $scope.rowCalculatePercent = ["В С Е Г О:", "квартирный жилой", "Прочие работы"];


$scope.dateBeginBuilding = new Date(); //дата начала строительства
$scope.timeBuilding = 0; // продолжительность строительства
$scope.timeBuildingCeil = 0; 
$scope.table = new Array();          
$scope.arrayMonth = new Array();      
$scope.arrayYearsColdspan = new Array();



$scope.timeBuilding = 9;


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


  console.log($scope.objResources.tableRes );
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

        for (var i = 0; i < parseInt(Math.ceil($scope.timeBuilding)); i++) {

          if(num == 13) {
            num = 1;
          }

          timeMonth.setMonth(num++);
          $scope.arrayMonth.push(mapMonth[timeMonth.toString().substring(4,7)]);
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
      $scope.calculate(attrs.key);
    });


     $scope.calculate = function (val) {
       if (attrs.key == "total" || attrs.key == "CMP") {
        $scope.calculateOther(attrs.key);
      } else if (attrs.key == "name") {
        return;
      } else {
        $scope.calculateRow($scope.$parent.$parent.Row, attrs);
          //$scope.calculateColumn($scope.$parent.$parent.Row, attrs, val);
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
        other[key] = totalRow[key] - result;
      };


      $scope.calculateRow = function (row,attrs) {
       if (!checkRowCalculate(row,$scope.rowCalculatePercent) || this.$parent.$last == true) {return;}
       let lastKey = Object.keys(row)[Object.keys(row).length - 1];
       let result = 0;
       for (var key in row){
        if (key == "name" || key == "total" || key == "CMP" || key == lastKey) {continue;}
        if (row[key][attrs.calculateTable] == "-") {row[key][attrs.calculateTable] = "0";}
        result = result + parseFloat(row[key][attrs.calculateTable]);
      }
      if (attrs.calculateTable == "first") {
        row[lastKey][attrs.calculateTable] = row.total - result;
      } else {
        row[lastKey][attrs.calculateTable] = row.CMP - result;
        console.log('calculateRow');
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
      ResultRow[key][attrs.calculateTable] =  TotalRow[key][attrs.calculateTable] - result;
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



////////////////////////////////////////////////WORK TABLE//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////WORK TABLE//////////////////////////////////////////

angular.module('jobPos').directive('tableWork', tableWork);

function tableWork() {
  return {
    restrict: 'E',
    templateUrl: 'views/directiv/tableWork.html',
    link: function($scope, elm, attrs, ctrl) {
      $scope.ObjWorkTabl = new ObjWorkTabl();

      function ObjWorkTabl() {
        if (ObjWorkTabl.__instance) {
          return ObjWorkTabl.__instance; 
        } else if (this === window) {
          return new ObjWorkTabl();
        }
        ObjWorkTabl.__instance = this;

        this.workCapacity = 0;
        this.sumWorking = function (argument) {
          console.log('ObjWorkTabl');
          return (this.workCapacity / $scope.timeBuilding / 8 / 22).toFixed(0); //8час: X мес:22дн
        };
        this.ITR = function (argument) {
          return (this.sumWorking() * 0.155).toFixed(0); //15,5%
        };
        this.working = function (argument) {
          return (this.sumWorking() - this.ITR()); //15,5% 
        };
        this.workingInTheShift = function (argument) {
          return (this.working() * 0.7).toFixed(0);  // в т.ч. рабочих * 70 %
        };
        this.ITRInTheShift = function (argument) {
          return (this.ITR() * 0.8).toFixed(0);   // ИТР * 80% 
        };
        this.sumInTheShift = function (argument) {
          return Math.ceil(parseFloat(this.workingInTheShift()) + (this.ITRInTheShift() * 0.5));   // (34+7x0,5) = 38 чел 
        };
      }
    }
  };
}

////////////////////////////////////////////////tableHousehold TABLE//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////tableHousehold TABLE//////////////////////////////////////////

angular.module('jobPos').directive('tableHousehold', tableHousehold);
function tableHousehold() {
  return {
    restrict: 'E',
    templateUrl: 'views/directiv/tableHousehold.html',
    link: function($scope, elm, attrs, ctrl) {
    }
  };
}


//////////////////////////////////////////////// Stockroom TABLE//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Stockroom TABLE//////////////////////////////////////////

// function watchCoefficient () {
//   $scope.ResourcesTablar = [];
//   for (var i = 0; i < ResourcesTablSumma().length; i++) {
//     $scope.ResourcesTablar.push(new ResourcesOBJcreate( ResourcesTablSumma()[i]));
//   }
//   $scope.maxSummaYear = Math.max(...ResourcesTablSumma());
// }

angular.module('jobPos').directive('tableStockroom', tableStockroom);

function tableStockroom() {
  return {

    restrict: 'E',
    templateUrl: 'views/directiv/tableStockroom.html',
    link: function($scope, elm, attrs, ctrl) {
      $scope.objStockroom = new objStockroom();

      function objStockroom() {
        if (objStockroom.__instance) {
          return objStockroom.__instance; 
        } else if (this === window) {
          return new objStockroom();
        }
        objStockroom.__instance = this;

        this.coefficient = 0;
        this.arrSummaYear = [];
        this.setArrSummaYear = function () {
          this.arrSummaYear = [];
          console.log('this.arrSummaYear');
          let count = 0;
          let i = 0;
          let row = $scope.table[$scope.table.length-1]; //if (($scope.table[i].name).indexOf('В С Е Г О:') !== -1) {
            let summa = 0;
            for (var key in row) {
              if ($scope.valueCheck(row[key])) {
                let month = $scope.arrayYearsColdspan[i].coldspan;
                count ++;
                let val = row[key].second;
                if (val == "-") {val = "0";}
                summa = summa + parseFloat(val);
                if (count == month) {
                  count = 0;
                  i ++;
                  this.arrSummaYear.push(summa);
                  summa = 0;
                }
              }
            }  
          }();

          this.maxSummaYear = function () {
             console.log(this.arrSummaYear);
            return Math.max(...this.arrSummaYear);   
          };


        }
      }
    };
  }



  angular.module('jobPos').directive('tableResources', tableResources);

  function tableResources() {
    return {
      restrict: 'E',
      templateUrl: 'views/directiv/tableResources.html',
      link: function($scope, elm, attrs, ctrl) {


        console.log($scope.objStockroom.arrSummaYear);

        $scope.objResources = new objResources();

        function objResources() {
          if (objResources.__instance) {
            return objResources.__instance; 
          } else if (this === window) {
            return new objResources();
          }
          objResources.__instance = this;

          this.visible = function () {
            if ($scope.objStockroom.arrSummaYear.length < 2) {return true;}
          };

          // this.table = _.memoize(function () {
          //  let table = [];
          //  for (var i = 0; i < $scope.objStockroom.arrSummaYear().length; i++) {
          //    console.log($scope.objStockroom.arrSummaYear()[i]);
          //    table.push(new ResourcesOBJcreate($scope.objStockroom.arrSummaYear()[i]));
          //    return table;
          //  });


         //  this.table = (function() {
         //    let table = [];
         //    for (var i = 0; i < $scope.objStockroom.arrSummaYear().length; i++) {
         //     console.log($scope.objStockroom.arrSummaYear()[i]);
         //     table.push(new ResourcesOBJcreate($scope.objStockroom.arrSummaYear()[i]));
         //   }
         //   return table;
         // });




         // this.tableRes =[];
         // this.table = function () {
         //  this.tableRes =[];
         //   for (var i = 0; i < $scope.objStockroom.arrSummaYear().length; i++) {
         //     console.log($scope.objStockroom.arrSummaYear()[i]);
         //   this.tableRes.push(new ResourcesOBJcreate($scope.objStockroom.arrSummaYear()[i]));
         //   }

       };


// $scope.$watchGroup(['objStockroom.arrSummaYear()'], function(newValue, oldValue, scope) {
//   console.log($scope.objStockroom.arrSummaYear());
//   // $scope.objResources = new objResources();
//  });









      // }



      function ResourcesOBJcreate (summa) {
        let electric;
        let oil;
        let vapor;
        let compresAir;
        let waterHouse;
        let oxyden;
        let coef = function (argument) {
          if ($scope.objStockroom.coefficient == 0) {return 1;}
        };
        let summaPlusCoef = summa / (2.7 * 1267 * coef());
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
      }


      



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











// ////////////////////////////////////////////////Resources TABLE//////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////Resources TABLE//////////////////////////////////////////






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










