(function () {
    'use strict';
   var app = angular.module('adminapp', ['ui.bootstrap','ngSanitize','ngAnimate', 'ui.select', 'oitozero.ngSweetAlert', 'highcharts-ng']);
  //  var app = angular.module('adminapp', ['ui.bootstrap']);
   app.constant('_', window._);
   app.run(function ($rootScope) {
    $rootScope._ = window._;
 });
//  app.factory('swal', SweetAlert);
  // ##############################Directive Start########################################
  app.directive('input', [function() {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (
          'undefined' !== typeof attrs.type
          && 'number' === attrs.type
          && ngModel
        ) {
          ngModel.$formatters.push(function(modelValue) {
            return Number(modelValue);
          });

          ngModel.$parsers.push(function(viewValue) {
            return Number(viewValue);
          });
        }
      }
    }
  }]);
// ##############################Directive End##########################################

// ##############################Filter Start########################################
app.service('adminFilter', function() {

  var baseurl = 'http://127.0.0.1:2021';
  // var baseurl = 'http://combosoft.com.bd';

  var startDate = new Date('2017-01-01');
  // var stringValue = 'test string value';

  var objectValue = {
    jsonurl:  baseurl
  };

   return {

    // getString: function() {
    //   return stringValue;
    // },
    // setString: function(value) {
    //   stringValue = value;
    // },

    getBaseUrl: function() {
      objectValue.baseurl = baseurl;
      return baseurl;
    },

    getstartDate: function() {
      objectValue.startdate = startDate;
      return startDate;
    },
    setstartDate: function(value) {
      startDate = value;
      objectValue.startdate = value;
      // divisionObjValue.startdate = value;
    },

  }


});

app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});
// ##############################Filter End##########################################

// ##############################Factory Start########################################
app.factory('slugify', function() {
  return function(text) {
    return angular.lowercase(text)
      // .replace('-', '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
});
// ##############################Factory End##########################################


  // ===========Demo Controller Start==========
  app.controller('demoController', ["$scope", "$rootScope", '$http', 'adminFilter', function ($scope, $rootScope, $http, adminFilter) {

    // var baseUrl = adminFilter.getBaseUrl();
    $scope.frmObj = {};

    // alert('yes');
    // =============Document Ready Start====================
    angular.element(function () {
      
    });
    // =============Document Ready End======================

  }]);

  // ===========Demo Controller End============

  // ===========onlyCkeditor Controller Start==========
  app.controller('onlyCkeditorController', ["$scope", "$rootScope", '$http', 'adminFilter', function ($scope, $rootScope, $http, adminFilter) {

    // var baseUrl = adminFilter.getBaseUrl();
    $scope.frmObj = {};

    // alert('yes');
    // =============Document Ready Start====================
    angular.element(function () {
      // *************************cKeditor Start**************************
      CKEDITOR.replace( 'description' );
      // *************************cKeditor End****************************
    });
    // =============Document Ready End======================

  }]);
  // ===========onlyCkeditor Controller End============

  // ===========Blog Controller Start==========
  app.controller('blogController', ["$scope", "$rootScope", '$http', 'adminFilter', function ($scope, $rootScope, $http, adminFilter) {

    // var baseUrl = adminFilter.getBaseUrl();
    $scope.frmObj = {};

    // alert('yes');
    // =============Document Ready Start====================
    angular.element(function () {
      // *************************cKeditor Start**************************
      CKEDITOR.replace( 'details' );
      // *************************cKeditor End****************************
    });
    // =============Document Ready End======================

  }]);
  // ===========Blog Controller End============

  // ===========CommonAction Controller Start==========
  app.controller('commonActionController', ["$scope", "$rootScope", '$http', 'adminFilter', '$uibModal', 'SweetAlert', function ($scope, $rootScope, $http, adminFilter, $uibModal, SweetAlert ) {

    // var baseUrl = adminFilter.getBaseUrl();
    $scope.frmObj = {};
    $scope.fltFrmObj = {};

    // $scope.loaderPg = false;
    // =============Document Ready Start====================
    angular.element(function () {
      // alert('aaa');
      // $scope.loaderPg = true;
    });
    // =============Document Ready End======================

    // ============Complete Start====================

    $scope.clickMeForDelete = function ($event, itemId, item ){
      $event.preventDefault();

        // alert('i am here');
        SweetAlert.swal({
          title: "Are you sure?",
          text: "If you remove, You will not be able to recover this item!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Remove",
          cancelButtonText: "Cancel",
          closeOnConfirm: true,
          closeOnCancel: true
        }, function(isConfirm) {
          if (isConfirm) {
          console.log('confirm', itemId);
          document.getElementById("itemDeleteForm"+itemId).submit();

          } else {
            console.log('unconfirm');
          }
        });
    };
    // ============Complete End======================

    // ============Show Image Start====================
    $scope.clickMeForShowImage1 = function ($event, imgUrl ){
      $event.preventDefault();
        // alert('i am here');
        SweetAlert.swal({
          title: '',
          text: '',
          imageUrl: imgUrl,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: '',
          animation: true,
          showCloseButton: true,
        })
    };

    $scope.clickMeForShowImage = function ($event, imgUrl ){
      $event.preventDefault();
        // alert('i am here');
        SweetAlert.swal({
          title: "",
          confirmButtonText: 'Close',
          text: "<img src='" + imgUrl + "' style='width:400px;'>",
          html: true,
      });
    };
    // ============Show Image End======================


    // ============paginaation limit change Start====================
    $scope.myFuncPP1 = function() {
      // $scope.count++;
      console.log('pagelimit input ',$scope.fltFrmObj.pagelimit2);
      $scope.fltFrmObj.pagelimit = 20;
  };



    $scope.fltFrmObj.pagelimit2 = 12;
    $scope.pageLimitChange1 = function () {
      // alert('pagelimit Is ',$scope.fltFrmObj.pagelimit);
      console.log('pagelimit Is ',$scope.fltFrmObj.pagelimit);
      $scope.fltFrmObj.pagelimit2 = 5;
    };
    // ============paginaation limit change End======================


    // ====================== Delete Modal Start=========================
    $scope.openItemDeleteModal = function ($event, id, item) {

      // alert('aaaa');
      $event.preventDefault();
      $uibModal.open({
        backdrop: true,
        animation: true,
        windowClass: 'show',
        backdropClass: 'show',
        // backdrop: 'static',

        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        // templateUrl: '../../admin-container/js/templates/modal/itemDelete.html',
        templateUrl: '../../../admin-container/js/templates/modal/itemDelete.html',
        size: 'lg',
        controller: function ($scope, $uibModalInstance) {
         // alert('I am here');
          $scope.name = item;
          $scope.cancel = function () {
            // $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
          };

          $scope.ok = function () {
            document.getElementById("itemDeleteForm"+id).submit();
            $scope.$close();
          };
        }
      }).result.catch(function(resp) {
        // if (!(res === 'cancel' || res === 'escape key press')) {
        //   throw res;
        // }
        if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
      });

    };
    // ====================== Delete Modal End===========================


    // ====================== Migration Modal Start=========================
    $scope.openItemMigrationModal = function ($event, id, item) {

      // alert('aaaa');
      $event.preventDefault();
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: '../../admin-container/js/templates/modal/item-migrate.html',

        size: 'lg',
        controller: function ($scope, $uibModalInstance) {
          $scope.name = item;


          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };

          $scope.okMigrate = function () {
            // var retObj = {
            //   name: $scope.name,
            //   age: $scope.age,
            //   profession: "Car Mechanic",
            //   yearsOfExp: 3
            // };
            // $scope.$close(retObj);
            // document.getElementById("itemMigrate"+id).submit();


            console.log('I am Here  =')

            // var trHref = document.getElementById("itemMigrate"+id).href;
            var trHref = document.querySelector("#itemMigrate"+id).href;
            console.log('href  =', trHref);
            // window.location.reload();
            window.location.href = trHref; //Will take you to Google.
            // window.location.href = 'http://www.google.com'; //Will take you to Google.
            // window.open('http://www.google.com'); //This will open Google in a new window.

            // console.log('trHrefAA  =', trHrefAA);

            $scope.$close();
          };


        }
      }).result.catch(function(res) {
        if (!(res === 'cancel' || res === 'escape key press')) {
          throw res;
        }
      });


    }
    // ====================== Migration Modal End===========================

    // ====================== Migration Modal Start=========================
    $scope.openCommonItemActionModal = function ($event, id, item) {

      // alert('aaaa');
      $event.preventDefault();
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: '../../admin-container/js/templates/modal/common-item-action.html',

        size: 'lg',
        controller: function ($scope, $uibModalInstance) {
          $scope.name = item;


          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };

          $scope.okConnonItemAction = function () {
            var trHref = document.querySelector("#commonItemAction"+id).href;
            window.location.href = trHref; //Will take you to Google.
            $scope.$close();
          };
        }
      }).result.catch(function(res) {
        if (!(res === 'cancel' || res === 'escape key press')) {
          throw res;
        }
      });


    }
    // ====================== Migration Modal End===========================

  }]);
  // ===========CommonAction Controller End============

  // ===========contentBlock Controller Start==========
  app.controller('contentBlockController', ["$scope", "$rootScope", '$http', 'adminFilter', '$uibModal', 'SweetAlert', function ($scope, $rootScope, $http, adminFilter, $uibModal, SweetAlert ) {

    // var baseUrl = adminFilter.getBaseUrl();
    $scope.frmObj = {};
    $scope.fltFrmObj = {};

    

    // $scope.loaderPg = false;
    // =============Document Ready Start====================
    angular.element(function () {
      // alert('aaa');
      // $scope.loaderPg = true;
    });
    // =============Document Ready End======================




    // ============paginaation limit change Start====================
    $scope.myFuncPP22 = function() {
      // $scope.count++;
      console.log('pagelimit input ',$scope.fltFrmObj.pagelimit);
      $scope.fltFrmObj.pagelimit = 20;
      // document.getElementById("filterForm").submit();
  };



    // $scope.fltFrmObj.pagelimit = 12;
    $scope.pageLimitSelectChange = function () {
      // $event.preventDefault();
      // alert('pagelimit Is ',$scope.fltFrmObj.pagelimit);
      console.log('pagelimit Is ',$scope.fltFrmObj.pagelimitSel);
      $scope.fltFrmObj.pagelimit = $scope.fltFrmObj.pagelimitSel;

    setTimeout(() => {
      document.getElementById("filterForm").submit();
    }, 1000);
      // document.getElementById("filterForm").submit();
    };
    // ============paginaation limit change End======================

  }]);
  // ===========contentBlock Controller End============

  // ===========CommonAction Controller Start==========
  app.controller('otherCommonActionController', ["$scope", "$rootScope", '$http', 'adminFilter', '$uibModal', function ($scope, $rootScope, $http, adminFilter, $uibModal ) {

    // var baseUrl = adminFilter.getBaseUrl();
    $scope.frmObj = {};
    // $scope.loaderPg = false;
    // =============Document Ready Start====================
    angular.element(function () {
      // alert('aaa');
      // $scope.loaderPg = true;
    });
    // =============Document Ready End======================



    // ====================== Delete Modal Start=========================
    $scope.openRelatedImageReUpdateModal = function ($event, productId, imageId, imageSort, isVideo) {

      console.log(productId);
      // alert('aaaa');
      $event.preventDefault();
      $uibModal.open({
        backdrop: true,
        animation: true,
        windowClass: 'show',
        backdropClass: 'show',
        // backdrop: 'static',

        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        // templateUrl: '../../admin-container/js/templates/modal/itemDelete.html',
        templateUrl: '../../../admin-container/js/templates/modal/related-image-re-update.html',
        size: 'lg',
        controller: function ($scope, $uibModalInstance) {
          // alert('I am here');
          $scope.productId = productId;
          $scope.imageId = imageId;
          $scope.imageSort = imageSort;
          // $scope.isVideo = isVideo;
          if(isVideo == 'true'){
            $scope.isVideo = true;
          }else{
            $scope.isVideo = false;
          }


          $scope.cancel = function () {
            // $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
          };

          $scope.ok = function () {
            document.getElementById("itemDeleteForm"+id).submit();
            $scope.$close();
          };
        }
      }).result.catch(function(resp) {
        // if (!(res === 'cancel' || res === 'escape key press')) {
        //   throw res;
        // }
        if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
      });

    };
    // ====================== Delete Modal End===========================
  }]);
  // ===========CommonAction Controller End============
   
  // ===========user Controller Start==========
   app.controller('userController', ["$scope", "$rootScope", '$http','adminFilter', 'slugify', function ($scope, $rootScope, $http, adminFilter, slugify) {

    // $scope.loaderPg = true;

    // alert('Hello i am Here');
        $scope.frmObj = {};

        angular.element(function () {
        console.log('page loading completed');
        // console.log('Is page', $scope.frmObj.isPage);


      // ============getStateOfCountry Start====================
      if($scope.frmObj.country && $scope.frmObj.country != undefined ){
        console.log('Ang calling');
        $scope.getStateOfCountry();

      }
      else{
        $scope.frmObj.country = '';
        $scope.frmObj.state = ''
      }
      // ============getStateOfCountry End======================
    });


    $scope.getStateOfCountry = function () {

      $scope.loaderPg = true;
        // ============getStateOfCountryy Start====================
      console.log('country Is ',$scope.frmObj.country);
      var data = {countryId : $scope.frmObj.country}
      var config = {
        headers : {
          'Content-Type': 'x-www-form-urlencoded;'
        }
      }

      $http.post('/country/backend-api-related-state', data, config)
        .then(function (response) {

         console.log(response);
          if(response.data.status == 'success'){
            $scope.country = response.data.country;
            $scope.states = response.data.states;
          }
        }).catch(function (response) {
        console.log('Fail backend-api-related-subcategory '+response);
      }).finally(function() {
        console.log("Finished backend-api-related-subcategory sails lift" );
        $scope.loaderPg = false;
      });
      // ============getStateOfCountryy End======================
    };

  }]);
  // ===========user Controller End============

  // ===========ads Controller Start==========
  app.controller('adsController', ["$scope", "$rootScope", '$http','adminFilter', 'slugify', function ($scope, $rootScope, $http, adminFilter, slugify) {

    // $scope.loaderPg = true;

    // alert('Hello i am Here');
        $scope.frmObj = {};

        angular.element(function () {
        console.log('page loading completed adsController');
        // console.log('Is page', $scope.frmObj.isPage);


      // ============getStateOfCountry Start====================
      if($scope.frmObj.category && $scope.frmObj.category != undefined ){
        console.log('Ang calling');
        $scope.getSubcategoryOfCategory();

      }
      else{
        console.log('page loading completed 22');
        $scope.frmObj.category = '';
        $scope.frmObj.subcategory = ''
      }
      // ============getSubcategoryOfCategory End======================
    });


    $scope.getSubcategoryOfCategory = function () {
      console.log('page loading completed calling');
      $scope.loaderPg = true;
        // ============getSubcategoryOfCategoryy Start====================
      console.log('Category Is ',$scope.frmObj.category);
      var data = {cateId : $scope.frmObj.category}
      var config = {
        headers : {
          'Content-Type': 'x-www-form-urlencoded;'
        }
      }

      $http.post('/category/backend-api-related-subcategory', data, config)
        .then(function (response) {

         // console.log(response);
          if(response.data.status == 'success'){
            $scope.category = response.data.category;
            $scope.subCategories = response.data.subCategory;
          }
        }).catch(function (response) {
        console.log('Fail backend-api-related-subcategory '+response);
      }).finally(function() {
        console.log("Finished backend-api-related-subcategory sails lift" );
        $scope.loaderPg = false;
      });
      // ============getSubcategoryOfCategoryy End======================
    };

  }]);
  // ===========ads Controller End============

  // ===========siteEvent Controller Start==========
  app.controller('siteEventNewController', ["$scope", "$rootScope", '$http', function ($scope, $rootScope, $http) {

    $scope.customFieldErrorsAng = {};
    $scope.frmObj = {};

    angular.element(function () {
      console.log('page loading completed');
      // console.log('Is page', $scope.frmObj.isPage);


    // ============getStateOfCountry Start====================
    if($scope.frmObj.country && $scope.frmObj.country != undefined ){
      console.log('Ang calling');
      $scope.getStateOfCountry();

    }
    else{
      $scope.frmObj.country = '';
      $scope.frmObj.state = ''
    }
    // ============getStateOfCountry End======================

    // *************************cKeditor Start**************************
    CKEDITOR.replace( 'details' );
    // *************************cKeditor End****************************
  });
  $scope.getStateOfCountry = function () {

    $scope.loaderPg = true;
      // ============getStateOfCountryy Start====================
    console.log('country Is ',$scope.frmObj.country);
    var data = {countryId : $scope.frmObj.country}
    var config = {
      headers : {
        'Content-Type': 'x-www-form-urlencoded;'
      }
    }

    $http.post('/country/backend-api-related-state', data, config)
      .then(function (response) {

       console.log(response);
        if(response.data.status == 'success'){
          $scope.country = response.data.country;
          $scope.states = response.data.states;
        }
      }).catch(function (response) {
      console.log('Fail backend-api-related-subcategory '+response);
    }).finally(function() {
      console.log("Finished backend-api-related-subcategory sails lift" );
      $scope.loaderPg = false;
    });
    // ============getStateOfCountryy End======================
  };





    //------startDate Datepeaker Start------------------

    $scope.initStartDate_old = function (date) {
      console.log('datedatedate1', date);
      moment.locale("fr");
      console.log(moment.locale()); // en 
      

      if(date){
        console.log('datedatedateSSS', moment(date).format('MMMM d, YYYY'));
        console.log('datedatedate2', moment(date).format("DD-MM-YYYY hh:mm A"));
        console.log('datedatedate2', moment(date, 'MM-DD-YYYY'));
        let make1 = moment(date, "YYYY-MM-DD hh:mm A", true);
        console.log('make1', make1);
        console.log('aaaaa', make1.format("L LT"))
        let isoMake1 = make1.toISOString();
        console.log('isoMake1 ISO===', isoMake1);
        let isoResult1 = moment(isoMake1).format("DD-MMM-YYYY hh:mm A");
        console.log('isoResult1===', isoResult1);   
        // console.log('datedatedate2', moment(date).format("L LT"));
        // $scope.startDate = new Date(date);
        $scope.startDate = date;
        // $scope.startDate = moment(date).format("DD-MM-YYYY");
      }
      else {
        console.log('datedatedate3', new Date(date));
        $scope.startDate = new Date();
      }
    };
    $scope.initStartDate = function (stDate, stTime) {
      console.log('datedatedate1', stDate);
      // moment.locale("fr");
      console.log(moment.locale()); // en 
      if(stDate){
        // console.log('datedatedateSSS', moment(date).format('MMMM d, YYYY'));
        $scope.startDate = new Date(stDate);
      }
      else {
        // console.log('datedatedate3', new Date(stDate));
        $scope.startDate = new Date();
        
        // $scope.startTime = null;
        
      }

      if(stTime){
            console.log('stTime 1 ==', stTime);
            // var conv24h = moment("2:15 AM", ["h:mm A"]).format("HH:mm");
            var conv24h = moment(stTime, ["h:mm A"]).format("HH:mm");
            console.log('dt==', conv24h);
            // console.log('dt==', moment('12:16','HH:mm').minutes());
            console.log('dt Hour==', moment(conv24h,'HH:mm').hour());
            console.log('dt minuit==', moment(conv24h,'HH:mm').minutes());

            let setTd = new Date();
            setTd.setHours( moment(conv24h,'HH:mm').hour() );
            setTd.setMinutes( moment(conv24h,'HH:mm').minutes() );
            $scope.startTime = setTd;
      }
      else {
        // console.log('stTime 2', new Date());
        // $scope.startTime = new Date();
          let setTd = new Date();
          setTd.setHours(0);
          setTd.setMinutes(0);
          $scope.startTime = setTd;
      }



    };
    // $scope.eventdate = '';
    // let date = new Date();

    $scope.clearStartDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.startDate = null;
      // $scope.startDate = new Date();
      $scope.startTime = new Date();
    };


    //datepicker
    $scope.today = function () {
      $scope.startDate = new Date();
    };
     // $scope.today();

    
    $scope.openStartDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.isOpenedStartDate = true;
      // $scope.datepicker = {'openedStartDate': true};
    };



    $scope.dateOptions = {
      // customClass: highlightDay,
      // maxDate: new Date(2020, 5, 22),
      // maxDate: new Date(),
      minDate: new Date(),
      formatYear: 'yy',
      startingDay: 6,
      showWeeks: false,
      // defaultDate : new Date(),
      // todayHighlight: true

    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd-MM-yyyy','yyyy-MM-dd', 'shortDate'];
    $scope.startDateFormat = $scope.formats[3];


    //-----startDate Datepeaker End--------------------


    //-----endDate Datepeaker Start------------------
    $scope.initEndDate = function (endDate, endTime) {
      // console.log('datedatedate1', endDate);
      if(endDate){
        $scope.endDate = new Date(endDate);
      }else {
        // console.log('datedatedate3', new Date(endDate));
        $scope.endDate = new Date();
      }

      if(endTime){
          var conv24h = moment(endTime, ["h:mm A"]).format("HH:mm");
          let setTd = new Date();
          setTd.setHours( moment(conv24h,'HH:mm').hour() );
          setTd.setMinutes( moment(conv24h,'HH:mm').minutes() );
          $scope.endTime = setTd;
      }else {
          // console.log('datedatedate3', new Date(endDate));
          // $scope.endTime = new Date();
          let setTd = new Date();
          setTd.setHours(0);
          setTd.setMinutes(0);
          $scope.endTime = setTd;
      }

    };
    $scope.endDateFormat = $scope.formats[3];

    $scope.openEndDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.isOpenedEndDate = true;
      // $scope.datepicker = {'openedStartDate': true};
    };

    $scope.clearEndDate = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.endDate = null;
      // $scope.endDate = new Date();
      $scope.endTime = new Date();
    };
    //-----endDate Datepeaker End--------------------

    // *************************Time picker Start*************************
    // $scope.startTime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };
  $scope.hstep = $scope.options.hstep[0];
  $scope.mstep = $scope.options.mstep[1];
  $scope.ismeridian = true;
  

  // $scope.update = function() {
  //   var d = new Date();
  //   d.setHours( 14 );
  //   d.setMinutes( 0 );
  //   $scope.startTime = d;
  // };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.startTime = null;
  };
    // *************************Time picker End***************************

  }]);
  // ===========siteEvent Controller End============


  // ===========Brand Controller Start==========
  app.controller('brandController', ["$scope", "$rootScope", '$http','adminFilter', 'slugify', function ($scope, $rootScope, $http, adminFilter, slugify) {
    // $scope.loaderPg = true;
    // alert('Hello i am Here');
        $scope.frmObj = {};
        angular.element(function () {
        console.log('page loading completed 11');
        $scope.slugify = function(slug) {
          $scope.frmObj.slug = slugify(slug);
        };
      // *************************cKeditor Start**************************
        CKEDITOR.replace( 'description' );
      // *************************cKeditor End****************************
    });
  }]);
  // ===========Brand Controller End============




  // ===========OrderIndex Controller Start==========
  app.controller('orderIndexController', ["$scope", "$rootScope", '$http','adminFilter','SweetAlert', '$uibModal', function ($scope, $rootScope, $http, adminFilter, SweetAlert, $uibModal) {
    // $scope.loaderPg = true;
    // alert('Hello i am Here');
    $scope.frmObj = {};
    angular.element(function () {
      console.log('page loading completed');


      // ====================== open Billing Address Modal Start===========================
      $scope.clickMeForBillingAddressModal = function ($event, orderId) {

        // alert('aaaa');
        $event.preventDefault();
        // $scope.loaderPg = true;
        $uibModal.open({
          backdrop: true,
          animation: true,
          windowClass: 'show',
          backdropClass: 'show',
          // backdrop: 'static',

          ariaLabelledBy: 'modal-title-bottom',
          ariaDescribedBy: 'modal-body-bottom',
          templateUrl: '../../admin-container/js/templates/modal/order-billing-address.html',
          size: 'lg',
          controller: function ($scope, $uibModalInstance) {
            // $scope.name = item;

            // ==============API call start===============

            let data = {orderId : orderId}
            let config = {
              headers : {
                'Content-Type': 'x-www-form-urlencoded;'
              }
            }
            $http.post('/order/backend-api-single-order-details', data, config)
            .then(function (response) {

            // console.log(response);
              if(response.data.status == 'success'){

                console.log('order details', response.data.order);
                $scope.sinOrder = response.data.order;
                // $scope.loaderPg = false;
              }
            }).catch(function (response) {
            console.log('Fail backend-api-status-change-complete '+response);
          }).finally(function() {
            console.log("Finished backend-api-status-change-complete sails lift" );
            // $scope.loaderPg = false;
          });
            // ==============API call start===============


            $scope.billingCancel = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };

            // $scope.billingOk = function () {
            //   document.getElementById("itemCustomerPurchaseForm"+id).submit();
            //   $scope.$close();
            // };
          }
        }).result.catch(function(resp) {
          // if (!(res === 'cancel' || res === 'escape key press')) {
          //   throw res;
          // }
          $scope.loaderPg = false;
          if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });

      };
      // ====================== open Billing Address Modal End===========================

      // ====================== open Shipping Address Modal Start===========================
      $scope.clickMeForShippingAddressModal = function ($event, orderId) {

        // alert('aaaa');
        $event.preventDefault();
        // $scope.loaderPg = true;
        $uibModal.open({
          backdrop: true,
          animation: true,
          windowClass: 'show',
          backdropClass: 'show',
          // backdrop: 'static',

          ariaLabelledBy: 'modal-title-bottom',
          ariaDescribedBy: 'modal-body-bottom',
          templateUrl: '../../admin-container/js/templates/modal/order-shipping-address.html',
          size: 'lg',
          controller: function ($scope, $uibModalInstance) {
            // $scope.name = item;

            // ==============API call start===============

            let data = {orderId : orderId}
            let config = {
              headers : {
                'Content-Type': 'x-www-form-urlencoded;'
              }
            }
            $http.post('/order/backend-api-single-order-details', data, config)
            .then(function (response) {

            // console.log(response);
              if(response.data.status == 'success'){

                console.log('order details', response.data.order);
                $scope.sinOrder = response.data.order;
                // $scope.loaderPg = false;
              }
            }).catch(function (response) {
            console.log('Fail backend-api-status-change-complete '+response);
          }).finally(function() {
            console.log("Finished backend-api-status-change-complete sails lift" );
            // $scope.loaderPg = false;
          });
            // ==============API call start===============


            $scope.billingCancel = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };

            // $scope.billingOk = function () {
            //   document.getElementById("itemCustomerPurchaseForm"+id).submit();
            //   $scope.$close();
            // };
          }
        }).result.catch(function(resp) {
          // if (!(res === 'cancel' || res === 'escape key press')) {
          //   throw res;
          // }
          $scope.loaderPg = false;
          if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });

      };
      // ====================== open Shipping Address Modal End===========================

      // ====================== open customer info Modal Start===========================
      $scope.clickMeForCustomerInfoModal = function ($event, orderId) {

        // alert('aaaa');
        $event.preventDefault();
        // $scope.loaderPg = true;
        $uibModal.open({
          backdrop: true,
          animation: true,
          windowClass: 'show',
          backdropClass: 'show',
          // backdrop: 'static',

          ariaLabelledBy: 'modal-title-bottom',
          ariaDescribedBy: 'modal-body-bottom',
          templateUrl: '../../admin-container/js/templates/modal/order-customer-info.html',
          size: 'lg',
          controller: function ($scope, $uibModalInstance) {
            // $scope.name = item;

            // ==============API call start===============

            let data = {orderId : orderId}
            let config = {
              headers : {
                'Content-Type': 'x-www-form-urlencoded;'
              }
            }
            $http.post('/order/backend-api-single-order-details', data, config)
            .then(function (response) {

            // console.log(response);
              if(response.data.status == 'success'){

                console.log('order details', response.data.order);
                $scope.sinOrder = response.data.order;
                // $scope.loaderPg = false;
              }
            }).catch(function (response) {
            console.log('Fail backend-api-status-change-complete '+response);
          }).finally(function() {
            console.log("Finished backend-api-status-change-complete sails lift" );
            // $scope.loaderPg = false;
          });
            // ==============API call start===============


            $scope.billingCancel = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };

            // $scope.billingOk = function () {
            //   document.getElementById("itemCustomerPurchaseForm"+id).submit();
            //   $scope.$close();
            // };
          }
        }).result.catch(function(resp) {
          // if (!(res === 'cancel' || res === 'escape key press')) {
          //   throw res;
          // }
          $scope.loaderPg = false;
          if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });

      };
      // ====================== open customer info Modal End===========================


      // ============Complete Start====================
      let complete_click_flag = false;
      $scope.clickMeForComplete = function ($event, orderId){
        $event.preventDefault();
        if(!complete_click_flag){
          // alert('i am here');
          SweetAlert.swal({
            title: "Are you sure?",
            text: "Complete this Order",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancle",
            closeOnConfirm: true,
            closeOnCancel: true
          }, function(isConfirm) {
            if (isConfirm) {
            console.log('confirm');
            let data = {orderId : orderId}
            let config = {
              headers : {
                'Content-Type': 'x-www-form-urlencoded;'
              }
            }
            $http.post('/order/backend-api-status-change-complete', data, config)
            .then(function (response) {

            // console.log(response);
              if(response.data.status == 'success'){
                $($event.target).removeClass('btn-warning').addClass('btn-success');
                $event.target.setAttribute("disabled",true);
                // $event.target.text('completed');
                // $event.target.innerHTML ='Completedaaa';
                $event.target.innerText ='Completed';
                document.getElementById("orderStatus_"+orderId).innerHTML = 'Complete';
              }
            }).catch(function (response) {
            console.log('Fail backend-api-status-change-complete '+response);
          }).finally(function() {
            console.log("Finished backend-api-status-change-complete sails lift" );
            $scope.loaderPg = false;
          });

            } else {
              console.log('unconfirm');
            }
          });

        }
        complete_click_flag = true;


      };
      // ============Complete End======================

      // ============Cancel Start====================
      let cancel_click_flag = false;
      $scope.clickMeForCancel = function ($event, orderId){
        $event.preventDefault();
        if(!cancel_click_flag){
          // alert('i am here');
          SweetAlert.swal({
            title: "Are you sure?",
            text: "Cancel this Order",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancle",
            closeOnConfirm: true,
            closeOnCancel: true
          }, function(isConfirm) {
            if (isConfirm) {
            console.log('confirm');
            let data = {orderId : orderId}
            let config = {
              headers : {
                'Content-Type': 'x-www-form-urlencoded;'
              }
            }
            $http.post('/order/backend-api-status-change-cancel', data, config)
            .then(function (response) {

            // console.log(response);
              if(response.data.status == 'success'){
                $($event.target).removeClass('btn-warning').addClass('btn-success');
                $event.target.setAttribute("disabled",true);
                // $event.target.text('completed');
                // $event.target.innerHTML ='Completedaaa';
                $event.target.innerText ='Canceled';
                document.getElementById("orderStatus_"+orderId).innerHTML = 'Cancel';
              }
            }).catch(function (response) {
            console.log('Fail backend-api-status-change-complete '+response);
          }).finally(function() {
            console.log("Finished backend-api-status-change-complete sails lift" );
            $scope.loaderPg = false;
          });

            } else {
              console.log('unconfirm');
            }
          });

        }
        complete_click_flag = true;


      };
      // ============Cancel End======================

  // ============getStateOfCountry Start====================
      if($scope.frmObj.category){
        $scope.getStateOfCountry();
      }
      else{
        $scope.frmObj.category = '';
        $scope.frmObj.subcategory = ''
      }
  // ============getStateOfCountry End======================

  // ============getSubsubcategoryOfSubcategory Start====================
       if($scope.frmObj.subcategory){
        $scope.getSubsubcategoryOfSubcategory();
      }
      else{
        $scope.frmObj.subcategory = '';
        $scope.frmObj.subsubcategory = ''
      }
  // ============getSubsubcategoryOfSubcategory End======================


    }); //<-- Document ready End

    $scope.getStateOfCountry = function () {

      $scope.loaderPg = true;
        // ============getStateOfCountryy Start====================
      console.log('Category Is ',$scope.frmObj.category);
      var data = {cateId : $scope.frmObj.category}
      var config = {
        headers : {
          'Content-Type': 'x-www-form-urlencoded;'
        }
      }

      $http.post('/category/backend-api-related-subcategory', data, config)
        .then(function (response) {

         // console.log(response);
          if(response.data.status == 'success'){
            $scope.category = response.data.category;
            $scope.subCategories = response.data.subCategory;
            $scope.subsubCategories = [];
          }
        }).catch(function (response) {
        console.log('Fail backend-api-related-subcategory '+response);
      }).finally(function() {
        console.log("Finished backend-api-related-subcategory sails lift" );
        $scope.loaderPg = false;
      });
      // ============getStateOfCountryy End======================
    };

    $scope.getSubsubcategoryOfSubcategory = function () {
      $scope.loaderPg = true;
      $scope.subsubCategories = [];
      var data = {subCatId : $scope.frmObj.subcategory}
      var config = {
        headers : {
          'Content-Type': 'x-www-form-urlencoded;'
        }
      }

      $http.post('/sub-category/backend-api-related-sub-sub-category', data, config)
        .then(function (response) {
          if(response.data.status == 'success'){
            $scope.subcategory = response.data.subcategory;
            $scope.subsubCategories = response.data.subSubCategory;
          }
        }).catch(function (response) {
        console.log('Fail backend-api-related-sub-sub-category'+response);
      }).finally(function() {
        console.log("Finished sub-category/backend-api-related-sub-sub-category");
        $scope.loaderPg = false;
      });

    };




  }]);
  // ===========OrderIndex Controller End============


})();
