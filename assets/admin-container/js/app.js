(function () {
    'use strict';
    angular.module('adminapp', ['ngAnimate', 'ui.bootstrap'])

        .run(["$rootScope", function ($rootScope) {
          $rootScope.baseUrl = 'http://127.0.01:1337';
          // $rootScope.baseUrl = 'http://combosoft.com';

        }]);




})();

