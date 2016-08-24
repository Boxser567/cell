'use strict';

import loginTpl from './login.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: loginTpl,
            controller: require('./login.controller')
        })

}

export default routeConfig;