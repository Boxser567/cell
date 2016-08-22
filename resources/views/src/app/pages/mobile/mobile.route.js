'use strict';

import mobileTpl from './mobile.html';

function routeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('mobile', {
      url: '/mobile',
      templateUrl: mobileTpl,
      controller: require('./mobile.controller')
    })

}

export default routeConfig;