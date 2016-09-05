'use strict';


function runBlock($log,$rootScope,Exhibition,localStorageService) {
	'ngInject';

	// $log.debug('Hello from run block!');

	$rootScope.$on('$stateChangeError',function(){
		$log.error('$stateChangeError',arguments);
	});

	var user = localStorageService.get('user');
	if(!user){
		Exhibition.login().then(function (res) {
			user = {
				loginName:res.name
			};
			localStorageService.set('user', user);
			$rootScope.user = user;
			window.location.href = "/#/exhibition";
		})
	}else{
		$rootScope.user = user;
	}


}

export default runBlock;
