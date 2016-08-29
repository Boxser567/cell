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
                console.debug("登录信息显示", res);
            })
        }
    }

}

export default cellHeaderComponent;
