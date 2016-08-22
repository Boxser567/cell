'use strict';

import route from './mobile.route';

const MobileModule = angular.module('mobile-module', [
  'ui.router'
]);

MobileModule
    .config(route);

export default MobileModule;
