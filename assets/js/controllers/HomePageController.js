(function () {
    'use strict';
    angular.module('app')
        .controller('HomePageController', ['$scope', '$rootScope', '$state','$http', 'afService','Auth','CurrentUser', function ($scope, $rootScope, $state, $http, afService, Auth, CurrentUser) {
          $rootScope.setting.homeStickyMenu = true;

          $scope.loaderPg = true;
          $scope.glryLdr = true;

          console.log('Cart Count =Home page===', $rootScope.setting.cartitemCount);


          // $scope.loaderPg = false;

          angular.element(document).ready(function () {
            // $.getScript('../frontend/js/main.js');
            $.getScript('../frontend/js/apply/home-page-slider.js');
            $.getScript('../frontend/js/apply/mobile-menu-and-common.js');
            // $.getScript('../frontend/js/header.js');
            $.getScript('../frontend/js/apply/top-menu.js');
          });

// =========================finishedHomeMainGalleryLoad Start===============================
          $scope.finishedHomeMainGalleryLoad = function () {
            // alert('fired');
            // $scope.glryLdr = false;
          };
// =========================finishedHomeMainGalleryLoad End=================================
          // =========================initHomeMainGallery Start===============================

          $scope.initHomepageContent = function () {

            var data = {};
            var config = {};
            $http.post('/frontend/init-homepage-content', data, config)
              .then(function (response) {
                console.log('ImageGallery',response.data.allCatForContent);
                if(!response.data.errorFound){
                  $scope.imgGallery = response.data.imgGallery;
                  $scope.allCatForContent = response.data.allCatForContent;
                  $scope.allFetrdProduct = response.data.allFetrdProduct;
                }

              }).catch(function (response) {
              console.log('Response Fail Error',response);
            }).finally(function() {
              console.log("Finished response");
              $scope.glryLdr = false;
            });
          };
           // =========================initHomeMainGallery End=================================

          // =========================addToCartProduct Start===============================
          $scope.productQnty = 1;
          $scope.addToCartProduct = function ($event, productId ) {
            $event.preventDefault();
            $scope.forCartLodr = true;
            if(Auth.isAuthenticated()){
              // alert('Authanticate');
              // if(productId){
              //   $state.go('home', {}, {reload: true});
              // }else{
              //
              // }
// console.log('currentuser id is =',JSON.PARAuth.isAuthenticated());
// console.log('currentuser id is =',JSON.parse(Auth.isAuthenticated()).user.id);
              console.log('currentuser id is =',CurrentUser.user().id);
              // ===================== Start ================

              // var data = {quantity: $scope.productQnty, product: productId, userId: JSON.parse(Auth.isAuthenticated()).user.id};
              var data = {quantity: $scope.productQnty, product: productId, customer: CurrentUser.user().id};
              var config = {
                headers : {
                  'Content-Type': 'x-www-form-urlencoded;'
                }
              };

              $http.post('/frontend/add-to-cart', data, config)
                .then(function (response) {
                  if(response.data.status == 'success'){
                    $state.go('cart', {}, {reload: true});

                  }else{
                    Auth.logout();
                    $state.go('login-register', {}, {reload: true});
                  }
                }).catch(function (response) {
                console.log('Fail Add-to-cart',response);
              }).finally(function() {
                console.log("Finished add-to-cart");
                $scope.forCartLodr = false;
              });

              // ===================== End==================

            }else{
              afService.setAddToCartQnty($scope.productQnty);
              afService.setAddToCartProduct(productId);
              $state.go('login-register', {}, {reload: true});
            }



          };
          // =========================addToCartProduct End=================================


        }]);
})();
