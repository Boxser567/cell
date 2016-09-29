'use strict';

import cellHeaderTpl from './cell-header.html';

function cellHeaderComponent($log) {
    'ngInject';

    var directive = {
        restrict: 'E',
        templateUrl: cellHeaderTpl,
        controllerAs: 'vm',
        controller: cellHeaderController,
        bindToController: true
    };

    return directive;

    function cellHeaderController($scope, $rootScope, Exhibition, localStorageService) {
        'ngInject';
        if (!$rootScope.user) {
            $rootScope.user = localStorageService.get('user');
            $("#inviteManager").prop("src", "/assistant/add?ent_id=" + $rootScope.user.ent_id);
        }


    }
}

export default cellHeaderComponent;
