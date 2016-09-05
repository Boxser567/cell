'use strict';

function config($logProvider, $sceProvider) {
    'ngInject';

    // Enable log
    $logProvider.debugEnabled(true);

    $sceProvider.enabled(false);

}

export default config;
