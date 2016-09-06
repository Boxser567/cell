'use strict';

function routeConfig($urlRouterProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/login');

}

export default angular

  .module('index.routes', [])
    .config(routeConfig);

