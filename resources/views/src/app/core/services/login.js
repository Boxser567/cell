'use strict';

export default function (app) {
    app
        .factory('Login', ['$q','$http', function ($q,$http) {
            var loginitem;
            return {
                getLoginInfo: function () {
                    return $http.get('/auth/login');
                },
                getByID: function () {
                    return "99";
                }
            }
        }]);

}