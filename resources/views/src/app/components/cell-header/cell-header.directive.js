'use strict';

import cellHeaderTpl from './cell-header.html';

function cellHeaderComponent($log) {
    'ngInject';

    var directive = {
        restrict: 'E',
        templateUrl: cellHeaderTpl,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

}

export default cellHeaderComponent;
