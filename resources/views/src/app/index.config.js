'use strict';

import  wx from 'weixin-js-sdk';
function config($logProvider, $sceProvider) {
    'ngInject';

    // Enable log
    $logProvider.debugEnabled(true);

    $sceProvider.enabled(false);





}

export default config;
