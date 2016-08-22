'use strict';

const shared = angular.module('core.shared', []);

require('./directives/validation-test/validation-test.directive')(shared);

require('./services/constants')(shared);
require('./services/exhibition')(shared);
require('./services/login')(shared);

export default shared;
