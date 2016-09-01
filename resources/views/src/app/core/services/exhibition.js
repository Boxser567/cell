'use strict';

export default function (app) {
    app
        .factory('Exhibition', ['$q', '$http', function ($q, $http) {
            var exhibitions;
            return {
                login: function () {
                    return $http.get('/auth/login').then(function (res) {
                        return res.data;
                    });
                },

                //创建会展
                createEx: function () {
                    return $http.post('/exhibition/create');
                },

                //开启/关闭站点
                setExState: function () {
                    return $http.post('/exhibition/res-collection').then(function (res) {
                        return res.data;
                    });
                },

                //根据ID获取会展详情
                getById: function (id) {
                    return $http.get('/exhibition/detail', {params: {exhibition_id: id}});
                },

                //获取会展列表信息
                list: function () {
                    return $http.get('/exhibition/list');
                },

                //修改会展详情基本信息
                editExTitle: function (params) {
                    return $http.post('/exhibition/info', params);
                },

                //修改文件(夹)的名称
                editExFilename: function (params) {
                    return $http.post('/file/reset-name', params);
                },
                editExDirname: function (params) {
                    return $http.post('/file/reset-name', params);
                },

                //删除文件(夹)
                delExFile: function (params) {
                    return $http.post('/file/del', params);
                },

                //添加文件夹
                addFolder: function (params) {
                    return $http.post('/file/create-folder', params);
                },

                //获取文件夹的文件列表
                getDirFilesByID(params){
                    return $http.get('/file/list', {params: params});
                },
                getDirCountSize(params){
                    return $http.get('/file/folder-detail', {params: params}).then(function (res) {
                        return res.data;
                    })
                },

                getUrlToken: function () {
                    return $http.get('/file/up-picture');
                },
                getFileToken: function (orgid) {
                    return $http.get('/file/up-address', {params: {org_id: orgid}});
                },

                m_getfileShow: function (code) {
                    return $http.get('/file/show', {params: {unique_code: code}}).then(function (res) {
                        return res.data;
                    });
                },
                m_getFileInfo: function (param) {
                    return $http.get('/file/info', {params: param})
                },


                //文件上传成功
                fileUploadSuss: function (params) {
                    return $http.post("/file/update-folder", params);
                }

            }
        }])

}