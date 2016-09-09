'use strict';

export default function (app) {
    app
        .factory('Exhibition', ['$q', '$http', 'md5', function ($q, $http, md5) {
            var exhibitions;
            var fileList = [];
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
                getById: function (code) {
                    return $http.get('/exhibition/detail', {params: {unique_code: code}});
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
                getDirFilesByID: function (params, cache) {
                    var defer = $q.defer();
                    var key = md5.createHash(params.org_id + '/' + (params.fullpath || ''));
                    if (cache !== false && angular.isDefined(fileList[key])) {
                        defer.resolve(fileList[key]);
                    } else {
                        $http.get('/file/list', {params: params}).then(function (res) {
                            res.data.list = _.map(res.data.list, function (item) {
                                if (item.info && item.info.img_url) {
                                    item.info.img_url = JSON.parse(item.info.img_url);
                                }
                                return item;
                            });
                            fileList[key] = res.data;
                            defer.resolve(fileList[key]);
                        }, function () {
                            defer.reject.apply(defer, arguments);
                        })
                    }
                    return defer.promise;
                },

                //获取文件夹总文件大小信息
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
                },


                //将云库的文件同步到会文件列表
                copyFilrFromCloud: function (params) {
                    return $http.get('/file/yunku-file', {params: params}).then(function (res) {
                        return res.data;
                    })
                },

                //开启资料收集
                openCollection: function (params) {
                    return $http.post("exhibition/res-collection", params).then(function (res) {
                        return res.data;
                    });
                }


            }
        }])

}