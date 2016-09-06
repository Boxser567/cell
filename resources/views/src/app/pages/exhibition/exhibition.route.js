'use strict';

import exhibitionListTpl from './exhibition-list.html';

import exhibitionDetailTpl from './exhibition-detail.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('main.exhibition-list', {
            url: '^/exhibition',
            templateUrl: exhibitionListTpl,
            controller: require('./exhibition-list.controller')
        })
        .state('main.exhibition-detail', {
            url: '^/exhibition/:unicode',
            templateUrl: exhibitionDetailTpl,
            controller: require('./exhibition-detail.controller'),
            resolve: {
                currentExhibition: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {

                    console.log("$stateParams", $stateParams);

                    return Exhibition.getById($stateParams.unicode);
                }]
            }
        });

}

export default routeConfig;