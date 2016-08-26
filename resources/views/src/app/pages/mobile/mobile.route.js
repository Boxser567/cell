'use strict';

import mobileTpl from './mobile.html';
import mobileFileTpl from './mobile-files.html';
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
                    console.log("参数集合",$stateParams);
                    return Exhibition.getDirFilesByID({fullpath:$stateParams.path, org_id:$stateParams.id});
                }]
            }
        });

}

export default routeConfig;