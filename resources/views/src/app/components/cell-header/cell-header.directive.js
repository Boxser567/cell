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
        Exhibition.login().then(function (res) {
            $scope.loginName = res.name;
            window.location.href = "/#/exhibition";
        })
    }
}

export default cellHeaderComponent;
