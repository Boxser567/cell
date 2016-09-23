'use strict';

function LoginController($scope, $rootScope, Exhibition, localStorageService) {
    'ngInject';

    $rootScope.projectTitle = "会文件";
    $scope.loginIn = function () {
        $rootScope.alertMsg = false;
        Exhibition.login().then(function (res) {
            var user = {
                    loginName: res.name,
                    main_member: res.main_member,
                    ent_id: res.ent_id
                }
                ;
            localStorageService.set('user', user);
            $rootScope.user = user;
            window.location.href = "/#/exhibition";
        })

        // window.location.href = "/#/register";

    }

}

export default LoginController;
