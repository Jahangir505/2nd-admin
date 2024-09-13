(function () {
    'use strict';
  // angular.module('app', ['ui.bootstrap', 'ui.router', 'ui.router.state.events', 'ngMessages', 'apptemplates', 'ngAnimate', 'ngSanitize', 'angularMoment'])
  angular.module('app', ['ui.bootstrap','ui.router', 'ui.router.state.events', 'ngMessages', 'apptemplates', 'ngFlash', 'ngAnimate', 'ngSanitize', 'oc.lazyLoad'])

        .run(['$rootScope', '$state', '$http', '$templateCache', '$q','Auth', 'setting', function ($rootScope, $state, $http, $templateCache, $q, Auth, setting) {
          // $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

          $rootScope.$state = $state;
          $rootScope.setting = setting;

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
              // event.preventDefault();
              // var canceler = $q.defer();
              // canceler.resolve();

              // $rootScope.$on('$viewContentLoaded', function() {
              //   $templateCache.removeAll();
              // });

              // console.log('I am here');
              // console.log('App State : ', toState.data.access);
                if (!Auth.authorize(toState.data.access)) {
                    event.preventDefault();
                    // $state.go('login');
                    $state.go('login-register', {}, {reload: true});
                }
                // else{
                //   console.log('Appjs Authorization',Auth.authorize(toState.data.access));
                // }
            });
        }]);



})();

