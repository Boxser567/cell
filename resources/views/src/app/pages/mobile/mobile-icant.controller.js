'use strict';

function MobileIcantController($scope, $state) {
    'ngInject';
    $scope.pageBackFn = function () {
        history.go(-1);
    };
}

export default MobileIcantController;