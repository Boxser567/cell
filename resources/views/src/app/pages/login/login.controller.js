'use strict';

function LoginController($scope, $rootScope, Exhibition, localStorageService) {
    'ngInject';

    $rootScope.projectTitle = "会文件";
    $scope.loginIn = function () {
        $rootScope.alertMsg = false;
        // Exhibition.login().then(function (res) {
        //     var user = {
        //         loginName: res.name
        //     };
        //     localStorageService.set('user', user);
        //     $rootScope.user = user;
        //     window.location.href = "/#/exhibition";
        // })

        window.location.href = "/#/register";

    }

}

export default LoginController;
