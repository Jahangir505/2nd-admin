(function () {
    'use strict';

    angular.module('ngReallyClickModule', ['ui.bootstrap'])
        .directive('ngReallyClick', ['$modal',
            function ($modal) {

                var ModalInstanceCtrl = function ($scope, $modalInstance) {
                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                };
                ModalInstanceCtrl.$inject = ["$scope", "$modalInstance"];

                return {
                    restrict: 'A',
                    scope: {
                        ngReallyClick: "&"
                    },
                    link: function (scope, element, attrs) {
                        element.bind('click', function () {
                            var message = attrs.ngReallyMessage || "Are you sure ?";

                            var modalHtml = '<div class="modal-body">' + message + '</div>';
                            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

                            var modalInstance = $modal.open({
                                template: modalHtml,
                                controller: ModalInstanceCtrl
                            });

                            modalInstance.result.then(function () {
                                scope.ngReallyClick();
                            }, function () {
                                //Modal dismissed
                            });

                        });

                    }
                }
            }
        ]);

})();
