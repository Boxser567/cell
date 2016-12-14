'use strict';

import exhibitionListTpl from './exhibition-list.html';

import exhibitionFailureTpl from './exhibition-failure.html';

import exhibitionEditorTpl from './exhibition-Editor.html';

import clippingTpl from './clipping.html';

function routeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('main.exhibition-list', {
            url: '^/exhibition',
            templateUrl: exhibitionListTpl,
            controller: require('./exhibition-list.controller'),
            resolve: {
                currentExhibition: ['Exhibition', function (Exhibition) {
                    return Exhibition.list();
                }]
            }
        })

        .state('main.clipping', {
            url: '^/clipping',
            templateUrl: clippingTpl,
            controller: require('./clipping.controller'),
            resolve: {}
        })



        .state('main.exhibition-failure', {
            url: '^/exfailure/:unicode',
            templateUrl: exhibitionFailureTpl,
            controller: require('./exhibition-failure.controller'),
            resolve: {
                currentExhibition: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
                    return Exhibition.getById($stateParams.unicode);
                }]
            }
        })


        .state('main.exhibition-Editor', {
            url: '^/exhibition/:unicode',
            templateUrl: exhibitionEditorTpl,
            controller: require('./exhibition-Editor.controller'),
            resolve: {
                currentExhibition: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {

                    console.log("$stateParams", $stateParams);

                    return Exhibition.getById($stateParams.unicode);
                }]
            }
        });


}

export default routeConfig;