'use strict';

import mobileTpl from './mobile.html';
import mobileFileTpl from './mobile-files.html';
import mobileViewsTpl from './mobile-preview.html';
import mobileIcantTpl from './mobile-icant.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('mobile', {
            url: '/mobile/:code',
            templateUrl: mobileTpl,
            controller: require('./mobile.controller'),
            resolve: {
                currentMobileExbt: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
                    return Exhibition.m_getfileShow($stateParams.code);
                }]
            }
        })

        .state('mobile_file', {
            url: '/mobile_file/:ex_id/:hash',
            templateUrl: mobileFileTpl,
            controller: require('./mobile-files.controller'),
            resolve: {
                currentMobileExbt: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
                    return Exhibition.getDirCountSize({hash: $stateParams.hash})
                }]
            }
        })

        .state('mobile_icant', {
            url: '/mobile_icant',
            templateUrl: mobileIcantTpl,
            controller: require('./mobile-icant.controller'),
            resolve: {}
        })



        .state('mobile-preview', {
            url: '/mobile-preview/:orgid/:hash',
            templateUrl: mobileViewsTpl,
            controller: require('./mobile-preview.controller'),
            resolve: {
                currentPreview: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
                    return Exhibition.m_getFileInfo({
                        org_id: $stateParams.orgid,
                        hash: $stateParams.hash
                    })
                }]
            }
        });

}

export default routeConfig;