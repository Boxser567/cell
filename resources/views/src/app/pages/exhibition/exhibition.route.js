'use strict';

import exhibitionListTpl from './exhibition-list.html';

import exhibitionDetailTpl from './exhibition-detail.html';

import exhibitionEditorTpl from './exhibition-Editor.html';

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
        // .state('main.exhibition-detail', {
        //     url: '^/exhibition/:unicode',
        //     templateUrl: exhibitionDetailTpl,
        //     controller: require('./exhibition-detail.controller'),
        //     resolve: {
        //         currentExhibition: ['Exhibition', '$stateParams', function (Exhibition, $stateParams) {
        //
        //             console.log("$stateParams", $stateParams);
        //
        //             return Exhibition.getById($stateParams.unicode);
        //         }]
        //     }
        // })


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