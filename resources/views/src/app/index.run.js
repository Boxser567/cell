'use strict';


function runBlock($log,$rootScope) {
	'ngInject';

	// $log.debug('Hello from run block!');

	$rootScope.$on('$stateChangeError',function(){
		$log.error('$stateChangeError',arguments);
	});


}

export default runBlock;
