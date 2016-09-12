'use strict';

import collectTpl from './collect.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('collect', {
            url: '/collect/:code',
            templateUrl: collectTpl,
            controller: require('./collect.controller'),
            resolve: {
                currentExhibition: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
                    console.log("$stateParams", $stateParams);
                    return Exhibition.m_getfileShow($stateParams.code);
                }]
            }
        })

}

export default routeConfig;