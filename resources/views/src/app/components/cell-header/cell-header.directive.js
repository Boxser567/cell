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

        Exhibition.loginss().then(function (res) {
            var user = {
                loginName: res.name,
                main_member: res.main_member,
                ent_id: res.ent_id
            };
            $("#inviteManager").prop("src", "/assistant/add?ent_id=" + res.ent_id);
            localStorageService.set('user', user);
            $rootScope.user = user;
           // window.location.href = "/#/exhibition";
        });


    }
}

export default cellHeaderComponent;
