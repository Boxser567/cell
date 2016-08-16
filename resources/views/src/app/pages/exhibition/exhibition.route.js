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
      url: '^/exhibition/:id',
      templateUrl: exhibitionDetailTpl,
      controller: require('./exhibition-detail.controller'),
      resolve: {
        currentExhibition: ['Exhibition', '$stateParams', function(Exhibition, $stateParams) {
          return Exhibition.getById(parseInt($stateParams.id));
        }]
      }
    });;

}

export default routeConfig;