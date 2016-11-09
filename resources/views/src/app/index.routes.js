'use strict';

function routeConfig($urlRouterProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/exhibition');

}

export default angular

  .module('index.routes', [])
    .config(routeConfig);

