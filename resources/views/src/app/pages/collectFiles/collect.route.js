'use strict';

import collectTpl from './collect.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('collect', {
            url: '/collect/:code',
            templateUrl: collectTpl,
            controller: require('./collect.controller')
        })

}

export default routeConfig;