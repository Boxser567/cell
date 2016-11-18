'use strict';

import route from './dialog.route';

const DialogModule = angular.module('dialog-module', [
    'ui.router'
]);

DialogModule
    .config(route);

export default DialogModule;
