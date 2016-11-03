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
                loginss: function () {
                    return $http.get('/account/info').then(function (res) {
                        return res.data;
                    });
                },

                //发送验证码
                getcode: function (phone) {
                    return $http.get('/baseinfo/sms', {params: {phone: phone}}).then(function (res) {
                        return res;
                    });
                },
                //验证验证码
                checkcode: function (params) {
                    return $http.get('/baseinfo/verify', {params: params}).then(function (res) {
                        return res;
                    });
                },
                //验证邀请码
                checkincode: function (incode) {
                    return $http.get('/baseinfo/verify－invitation', {params: {invitation_code: incode}}).then(function (res) {
                        return res;
                    });
                },
                //注册表单提交
                registerFrom: function (params) {
                    return $http.post('/auth/optimize', params).then(function (res) {
                        return res.data;
                    });
                },

                //获取管理员列表信息
                getAssistantList(entid){
                    return $http.get('/assistant/list', {params: {ent_id: entid}}).then(function (res) {
                        return res.data;
                    })
                },
                // 删除管理员
                delAssistant: function (memberid) {
                    return $http.post('/assistant/delete', {member_id: memberid}).then(function (res) {
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

                //获取banner背景图列表
                getBannerList: function () {
                    return $http.get('/baseinfo/banner-list').then(function (res) {
                        return res.data;
                    });
                },

                //获取会展列表信息
                list: function () {
                    return $http.get('/exhibition/list').then(function (res) {
                        return res.data;
                    });
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
                    return $http.post('/file/del', params).then(function (res) {
                        return res.data;
                    });
                },

                //创建新分组
                addNewGroup: function (entid) {
                    return $http.post('/exhibition/group', {ex_id: entid}).then(function (res) {
                        return res.data;
                    });
                },
                //修改分组信息
                editGroupInfo: function (params) {
                    return $http.post('/exhibition/group-update', params).then(function (res) {
                        return res.data;
                    });
                },
                //删除分组信息
                delGroupInfo: function (id) {
                    return $http.post('/exhibition/delete-group', {group_id: id}).then(function (res) {
                        return res.data;
                    });
                },

                //获取分组详细信息
                getGroupDetail: function (groid) {
                    return $http.get('/file/group', {params: {group_id: groid}}).then(function (res) {
                        return res.data;
                    })
                },

                //获取专题详细信息
                getTopicDetail: function (topicid) {
                    return $http.get('/file/folder-info', {params: {folder_id: topicid}}).then(function (res) {
                        return res.data;
                    })
                },
                //修改专题详细信息
                editTopicDetail: function (params) {
                    return $http.post('/file/validate-time', params).then(function (res) {
                        return res.data;
                    })
                },
                //添加修改专题封面图片信息
                updateTopicImg: function (params) {
                    return $http.post('/file/update-img', params).then(function (res) {
                        return res.data;
                    })
                },


                //添加文件夹
                addFolder: function (params) {
                    return $http.post('/file/create-folder', params).then(function (res) {
                        return res.data;
                    });
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


                //手机端根据uniqueCode获取会展信息
                m_getfileShow: function (code) {
                    return $http.get('/file/show', {params: {unique_code: code}}).then(function (res) {
                        return res.data;
                    });
                },

                //获取常用文件信息
                getFileInfoByPath: function (param) {
                    return $http.get('/file/module', {params: param}).then(function (res) {
                        return res.data;
                    })
                },
                //添加常用文件夹
                addFileinfo: function (params) {
                    return $http.post('/exhibition/module', params).then(function (res) {
                        return res.data;
                    })
                },

                //修改常用文件夹
                editFileinfo: function (params) {
                    return $http.post('/exhibition/update-module', params).then(function (res) {
                        return res.data;
                    })
                },

                //删除常用文件夹
                delFileinfo: function (params) {
                    return $http.post('/exhibition/delete-module', params).then(function (res) {
                        return res.data;
                    })
                },

                //获取所有专题及详细信息
                getGroupInfoByPath: function (exid) {
                    return $http.get('/file/ex-group', {params: {ex_id: exid}}).then(function (res) {
                        return res.data;
                    })
                },


                //文件上传成功
                fileUploadSuss: function (params) {
                    return $http.post("/file/update-folder", params);
                },


                //将云库的文件同步到会文件列表-----无效了
                // copyFilrFromCloud: function (params) {
                //     return $http.get('/file/yunku-file', {params: params}).then(function (res) {
                //         return res.data;
                //     })
                // },

                //从已有文件中选择文件
                copyFilFromHad: function (params) {
                    return $http.post('/file/self-file', params).then(function (res) {
                        return res.data;
                    })
                },

                getAllOfFile: function (params) {
                    return $http.get('/file/all-files', {params: params}).then(function (res) {
                        return res.data;
                    })
                },


                //开启资料收集
                openCollection: function (params) {
                    return $http.post("exhibition/res-collection", params).then(function (res) {
                        return res.data;
                    });
                },

                //获取微信token值
                getWXToken: function (params) {
                    return $http.get('/file/wechat-parameters').then(function (res) {
                        return res.data;
                    });
                },
            }
        }])

}