'use strict';

function LoginController($scope, $rootScope, Exhibition, localStorageService) {
    'ngInject';

    $rootScope.projectTitle = "会文件";
    // Login.getLoginInfo();
    $scope.loginIn = function () {
        // var user = localStorageService.get('user');
        // if (!user) {
        $rootScope.alertMsg = false;
        Exhibition.login().then(function (res) {
            var user = {
                loginName: res.name
            };
            //localStorageService.set('user', user);
            $rootScope.user = user;
            window.location.href = "/#/exhibition";
        })
        //} else {
        //     $rootScope.user = user;
        //}

    }

}

export default LoginController;
