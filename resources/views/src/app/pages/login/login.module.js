'use strict';

import route from './login.route';

const LoginModule = angular.module('login-module', [
    'ui.router'
]);

LoginModule.config(route);

export default LoginModule;
