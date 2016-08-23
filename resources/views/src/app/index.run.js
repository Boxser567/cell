'use strict';

import ZeroClipboard from "zeroclipboard/dist/ZeroClipboard"

function runBlock($log,$rootScope) {
	'ngInject';

	// $log.debug('Hello from run block!');

	$rootScope.$on('$stateChangeError',function(){
		$log.error('$stateChangeError',arguments);
	})

	try {
		ZeroClipboard && ZeroClipboard.config({
			swfPath: "assets/scripts/ZeroClipboard.swf"
		});
	} catch (e) {}
}

export default runBlock;
