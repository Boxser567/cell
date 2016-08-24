'use strict';

import route from './exhibition.route';

const ExhibitionModule = angular.module('exhibition-module', [
  'ui.router'
]);

ExhibitionModule
    .config(route);

export default ExhibitionModule;
