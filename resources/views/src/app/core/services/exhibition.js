'use strict';

export default function (app) {
    app
        .factory('Exhibition', ['$q', '$http', function ($q, $http) {
            var exhibitions;
            return {
                createEx:function () {
                    return $http.post('/exhibition/create');
                },
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


                addFolder: function (params) {
                    return $http.post('/file/create-folder', params);
                },

                getDirFilesByID(params){
                    return $http.get('/file/list', {params: params});
                },

                getUrlToken: function () {
                    return $http.get('/file/up-picture');
                },
                getFileToken: function (orgid) {
                    return $http.get('/file/up-address',{params:{org_id:orgid}});
                },

                m_getfileShow:function (code) {
                    return $http.get('/file/show', {params: {unique_code:code}}).then(function (res) {
                        return res.data;
                    });
                },
                m_getFileInfo:function (param) {
                    return $http.get('/file/info',{params:param})
                }

            }
        }])

}