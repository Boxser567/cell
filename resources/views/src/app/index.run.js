'use strict';


function runBlock($log,$rootScope) {
	'ngInject';

	// $log.debug('Hello from run block!');

	$rootScope.$on('$stateChangeError',function(){
		$log.error('$stateChangeError',arguments);
	});
	$rootScope.projectTitle = "会文件";


}

export default runBlock;
