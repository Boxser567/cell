'use strict';

import route from './collect.route';

const CollectModule = angular.module('collect-module', [
    'ui.router'
]);

CollectModule
    .config(route);

export default CollectModule;
