'use strict';

import cellHeaderTpl from './cell-header.html';

function cellHeaderComponent($log) {
    'ngInject';

    var directive = {
        restrict: 'E',
        templateUrl: cellHeaderTpl,
        controller: cellHeaderController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

    function cellHeaderController($scope, Exhibition) {
        'ngInject';
        $scope.reload = function () {
            Exhibition.login().then(function (res) {
                $scope.loginName = res.name;
                window.location.href="/#/exhibition";
            })
        }
        $scope.register=function () {
            $scope.loginName = "";
        }
    }

}

export default cellHeaderComponent;
