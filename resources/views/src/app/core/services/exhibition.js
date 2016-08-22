'use strict';

export default function (app) {
    app
        .factory('Exhibition', ['$q', '$http', function ($q, $http) {
            var exhibitions;
            return {
                getById: function (id) {
                    return $http.get('/exhibition/detail', {params: {exhibition_id: id}});
                },
                list: function () {
                    return $http.get('/exhibition/list');
                }
            }
        }])

}