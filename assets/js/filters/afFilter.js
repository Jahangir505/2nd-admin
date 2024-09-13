
/*
* http://jsfiddle.net/b2fCE/1/
*https://stackoverflow.com/questions/12008908/angularjs-how-can-i-pass-variables-between-controllers
* */

(function () {
    'use strict';
    angular.module('app')
  //     .filter('checkmark', function() {
  //   return function(input) {
  //     return input ? '\u2713' : '\u2718';
  //   };
  // })

      .filter('takaWithDecimal', function () {
        return function (value) {
          if (value) {
            return value.toFixed(2)+' BDT';
          }
          else {
            return '0.00 BDT';
          }
        };
      })


      .filter('removeHTMLTags', function() {

    return function(text) {

      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';

    };

  });

;

})();
