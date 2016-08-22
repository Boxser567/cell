'use strict';

export default function (app) {
    app
        .factory('Exhibition', ['$q', '$http',function ($q,$http) {
            var exhibitions;
            return {
                getById: function (id) {
                    console.log('_', _);
                    return {
                        id: 1,
                        name: '展会1'
                    };
                },
                list: function () {
                    return $http.get('/exhibition/list');
                }
            }
        }])

}