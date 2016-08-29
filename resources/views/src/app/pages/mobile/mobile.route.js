'use strict';

import mobileTpl from './mobile.html';
import mobileFileTpl from './mobile-files.html';
import mobileViewsTpl from './mobile-preview.html';

function routeConfig($stateProvider) {
    'ngInject';
    var resolves = {
        currentMobileExbt: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
            return Exhibition.m_getfileShow($stateParams.code);
        }]
    };

    $stateProvider
        .state('mobile', {
            url: '/mobile/:code',
            templateUrl: mobileTpl,
            controller: require('./mobile.controller'),
            resolve: resolves
        })

        .state('mobile_folder', {
            url: '/mobile_folder/:code/:path',
            templateUrl: mobileFileTpl,
            controller: require('./mobile-files.controller'),
            resolve: resolves
        })

        .state('mobile_file', {
            url: '/mobile_file/:code/:path',
            templateUrl: mobileViewsTpl,
            controller: require('./mobile-preview.controller'),
            resolve: resolves
        });

}

export default routeConfig;