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
                },
                editExTitle: function (params) {
                    return $http.post('/exhibition/info', params);
                },
                editExFilename: function (params) {
                    return $http.post('/file/reset-name', params);
                },
                editExDirname: function (params) {
                    return $http.post('/file/reset-name', params);
                },

                delExFile: function (params) {
                    return $http.post('/file/del', params);
                },


                addFolder: function (id) {
                    return $http.post('/file/create-folder', {org_id: id, fullpath: "请输入分类名称"});
                },


                getUrlToken: function () {
                    return $http.get('/file/up-picture');
                },

            }
        }])

}