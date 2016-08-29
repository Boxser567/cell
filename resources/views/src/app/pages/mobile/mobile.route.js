'use strict';

import mobileTpl from './mobile.html';
import mobileFileTpl from './mobile-files.html';
import mobileViewsTpl from './mobile-preview.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('mobile', {
            url: '/mobile',
            templateUrl: mobileTpl,
            controller: require('./mobile.controller')
        })

        .state('mobile-files', {
            url: '/mobile_file/:path/:id',
            templateUrl: mobileFileTpl,
            controller: require('./mobile-files.controller'),
            resolve: {
                currentExhibition: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
                    console.log("参数集合", $stateParams);
                    return Exhibition.m_getfileShow("2147483647");
                }]
            }
        })

        .state('mobile-preview', {
            url: '/preview/:url',
            templateUrl: mobileViewsTpl,
            controller: require('./mobile-preview.controller'),
            resolve: {}
        });

}

export default routeConfig;