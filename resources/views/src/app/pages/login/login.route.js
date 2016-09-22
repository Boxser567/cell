'use strict';

import loginTpl from './login.html';

import registerTpl from './register.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: loginTpl,
            controller: require('./login.controller')
        })

        .state('register', {
            url: '/register',
            templateUrl: registerTpl,
            controller: require('./register.controller')
        })

}

export default routeConfig;