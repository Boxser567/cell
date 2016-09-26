'use strict';

import WebUploader from 'webuploader/dist/webuploader';

import Clipboard from "clipboard/dist/clipboard";

export default function (app) {

    app.directive('validationTest', validationTestDirective);

    //会展列表翻转动画
    app.directive('hoverTrans', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                var isQrCode = false;
                elem.find(".code-img").on("mouseenter", function () {
                    if (!isQrCode) {
                        isQrCode = true;
                        elem.find(".thumcode").css("z-index", "11").show();
                        elem.css("transform", "rotateY(180deg)");
                    }
                });
                elem.on('mouseleave', function () {
                    isQrCode = false;
                    elem.find('.thumcode').css("z-index", "1").hide();
                    elem.css("transform", "rotateY(0deg)");

                });
            },
        };
    });

    //页面刷新提示
    app.directive('refreshLoad', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $(window).on('beforeunload', function () {
                    return "刷新后上传的文件将不显示!";
                });
            },
        };
    });

    //提交注册信息
    app.directive('registerForm', function (Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $('.regform .go input').on('focus', function () {
                    $('.regform .col-md-3').empty();
                });


                elem.on('click', function () {
                    var UID = Util.String.getNextStr(window.location.href, "=");
                    console.log(UID, "$stateParams", window.location.href);
                    var name = $(".for_name").val().trim();
                    var firm = $(".for_firm").val().trim();
                    var mobile = $(".for_mobile").val().trim();
                    var code = $(".for_code").val().trim();
                    var incode = $(".for_incode").val().trim();
                    if (name.length < 2 || name == "") {
                        $(".name_vau").text("最少包含2个字符");
                        return;
                    }
                    if (firm.length < 2 || firm == "") {
                        $(".firm_vau").text("最少包含2个字符");
                        return;
                    }
                    if (Util.RegExp.PhoneNumber.test(mobile) == false || mobile == "") {
                        $(".mobile_vau").text("手机号输入错误");
                        return;
                    }
                    if (code.length < 2 || code == "") {
                        $(".code_vau").text("验证码输入错误");
                        return;
                    }
                    if (incode.length < 2 || incode == "") {
                        $(".incode_vau").text("邀请码输入错误");
                        return;
                    }

                    var params = {
                        invitation_code: incode,
                        phone: mobile,
                        verify_code: code,
                        user_id: UID,
                        account: name,
                        org_name: firm
                    };

                    Exhibition.registerFrom(params).then(function (res) {
                        console.log("表单提交时间", params, res);
                        //if(res)
                        window.location.href = "/#/exhibition";
                        // $(".error_msg").text(res.error_msg);
                    });


                })
            },
        };
    });
    //发送验证码
    app.directive('sendCode', function (Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                console.log("yemian加载哪里出来问题了")
                elem.on('click', function () {
                    console.log("是否进入")
                    var mobile = $('.for_mobile').val();
                    if (mobile == "" || mobile == undefined || Util.RegExp.PhoneNumber.test(mobile) == false) {
                        $(".mobile_vau").text("手机号输入错误");
                        return false;
                    }
                    elem.prop('disabled', true);

                    //倒计时
                    var timeing = 60;
                    var deltime = function () {
                        if (timeing == 0) {
                            elem.prop('disabled', false);
                            elem.text("获取验证码");
                            timeing = 60;
                        } else {
                            elem.prop('disabled', true);
                            elem.text("重新发送(" + timeing + ")");
                            timeing--;
                            setTimeout(function () {
                                deltime();
                            }, 1000);
                        }
                    }
                    deltime();
                    Exhibition.getcode(mobile).then(function (res) {
                        console.log("验证码", res);
                    });

                });
            },
        };
    });


    app.directive('imgHovers', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                elem.on("mouseenter", function () {
                    $(".img-text-warning").show();
                });
                elem.on('mouseleave', function () {
                    $(".img-text-warning").hide();
                });
            },
        };
    });

    //复制制定文本信息
    app.directive("copyWebsite", function ($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                var clipboard = new Clipboard(elem[0], {
                    text: function (trigger) {
                        return trigger.getAttribute('data-clipboard-text');
                    }
                });
                clipboard.on('success', function (e) {
                    $timeout(function () {
                        $rootScope.alertMsg = true;
                    })
                    $timeout(function () {
                        $rootScope.alertMsg = false;
                    }, 750);
                });
            },
        };
    });


    //获取管理员信息
    app.directive("commanManger", function ($rootScope, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                elem.on('click', function () {
                    $rootScope.magList = [];
                    //获取管理员列表
                    Exhibition.getAssistantList($rootScope.user.ent_id).then(function (res) {
                        _.each(res, function (m) {
                            if (m.main_member === 1) {
                                $rootScope.manager = m;
                            } else {
                                $rootScope.magList.push(m);
                            }
                        })
                    })
                })
            },
        };
    });

    //删除管理员信息
    app.directive("delManger", function ($timeout, $rootScope, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {
                    //获取管理员列表
                    Exhibition.delAssistant(attrs.dataid).then(function (res) {
                        console.log("删除管理员信息", res);
                        for (var i = 0; i < $rootScope.magList.length; i++) {
                            if ($rootScope.magList[i].id === attrs.dataid) {
                                $timeout(function () {
                                    $rootScope.magList.splice(i, 1);
                                })
                                break;
                            }
                        }
                    })
                })
            },
        };
    });

    //普通文件上传
    app.directive('uploadFiles', function ($timeout, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    Exhibition.getFileToken(attrs.dataorgid).then(function (da) {
                        uploadimg(da.data.url, da.data.org_client_id);
                    });
                });
                function uploadimg(url, clientid) {
                    var uploader = WebUploader.create({
                        pick: {
                            id: elem,
                        },
                        auto: true,
                        swf: 'http://cdn.staticfile.org/webuploader/0.1.0/Uploader.swf',
                        server: url,
                        formData: {
                            org_client_id: clientid,
                            name: '',
                            filefield: 'file',
                            file: 'file',
                            // overwrite: 0
                        },

                        duplicate: true,//重复文件
                        // fileNumLimit: 100,
                        fileSizeLimit: 1024 * 1024 * 1024,  //最大文件 1 个G
                        fileSingleSizeLimit: 10240 * 1024 * 1024 //文件上传总量 10 个G
                    });
                    uploader.on('fileQueued', function (file) {
                        uploader.options.formData.name = file.name;
                        $("#uploadFileModal").modal('hide');
                        $timeout(function () {
                            scope.FilesList.push({
                                filename: file.name,
                                fullpath: file.name,
                                filesize: file.size,
                                filewidth: 0,
                                wid: file.id
                            })
                        })
                    });
                    uploader.on('uploadSuccess', function (uploadFile, returnFile) {
                        // console.log("上传成功", arguments, scope.FilesList);
                        var len = scope.FilesList.length;
                        for (var i = len; i >= 0; i--) {
                            if (scope.FilesList[i] && scope.FilesList[i].wid) {
                                if (scope.FilesList[i].wid == uploadFile.id) {
                                    $timeout(function () {
                                        scope.FilesList[i].filename = returnFile.fullpath;
                                        scope.FilesList[i].hash = returnFile.hash;
                                        scope.FilesList[i].fullpath = returnFile.fullpath;
                                        scope.currentExbt.property.file_count = Number(scope.currentExbt.property.file_count) + 1;
                                        scope.currentExbt.property.size_use = Number(scope.currentExbt.property.size_use) + scope.FilesList[i].filesize;
                                    })
                                    break;
                                }
                            }
                        }
                    });
                    uploader.on('uploadProgress', function (fileObj, progress) {
                        console.log("上传进度", arguments);
                        var file = _.findWhere(scope.FilesList, {
                            wid: fileObj.id
                        });
                        var index = "";
                        _.each(scope.FilesList, function (r) {
                            if (r.wid == fileObj.id) {
                                index = scope.FilesList.indexOf(r);
                            }
                        });
                        $(".eb-fileload .row .col-md-4:nth-child(" + (index + 1) + ")").find(".slide-line i").on('click', function () {
                            console.log("fileObj", fileObj.id, scope.FilesList);
                            uploader.cancelFile(fileObj.id);
                            scope.$apply(function () {
                                scope.FilesList.splice(index, 1);
                                console.log("fileObj2asdasdddddd", scope.FilesList);
                            })
                        });

                        if (file) {
                            scope.$apply(function () {
                                file.filewidth = Number(progress) * 100;
                            })
                        }

                    });
                    uploader.on('error', function (err) {
                        console.log("文件上传报错", err);
                        alert("上传有误! \n\n 温馨提示您:单次上传文件大小不得大于1G。");
                    });

                }


            },


        };
    });

    //上传logo
    app.directive('uploadLogo', function ($timeout, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    Exhibition.getUrlToken().then(function (da) {
                        uploadimg(da.data.upload_domain, da.data.token, da.data.file_name);
                    });
                });

                function uploadimg(server, token, file_name) {
                    var uploader = WebUploader.create({
                        pick: {
                            id: elem,
                            mimeTypes: 'image/*'
                        },
                        auto: true,
                        swf: 'http://cdn.staticfile.org/webuploader/0.1.0/Uploader.swf',
                        server: "http://upload.qiniu.com/",
                        formData: {
                            key: '',
                            token: token
                        },
                        duplicate: true,//重复文件
                        accept: {
                            title: 'logo',
                            extensions: 'gif,jpg,jpeg,bmp,png',
                            mimeTypes: 'image/*'
                        },
                        fileNumLimit: 10,
                        fileSizeLimit: 1 * 1024 * 1024,
                        fileSingleSizeLimit: 1 * 1024 * 1024
                    });
                    uploader.on('fileQueued', function (file) {
                        scope.imgloading = true;
                        uploader.options.formData.key = file_name + '.' + Util.String.getExt(file.name);
                    });
                    uploader.on('uploadSuccess', function () {
                        var arg = server + "/" + arguments[1].key + "-160";
                        Exhibition.editExTitle({exhibition_id: attrs.dataid, logo: arg}).then(function (res) {
                            $timeout(function () {
                                scope.currentExbt.logo = arg;
                                scope.imgloading = false;
                            })
                        });
                    });
                    uploader.on('error', function (err) {
                        console.log("图片上传报错", err);
                        alert("上传有误! \n\n 温馨提示您:会展logo不能上传大于1MB的文件。");
                    });

                }


            },


        };
    });

    //上传分类所需文件
    app.directive('uploadDirFiles', function ($timeout, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    Exhibition.getFileToken(attrs.dataorgid).then(function (da) {
                        uploadimg(da.data.url, da.data.org_client_id);
                    });
                });
                function uploadimg(url, clientid) {
                    var uploader = WebUploader.create({
                        pick: {
                            id: elem,
                        },
                        auto: true,
                        swf: 'http://cdn.staticfile.org/webuploader/0.1.0/Uploader.swf',
                        server: url,
                        formData: {
                            org_client_id: clientid,
                            name: '',
                            filefield: 'file',
                            file: 'file',
                            // overwrite: 0
                        },
                        duplicate: true,//重复文件
                        //fileNumLimit: 100,
                        fileSizeLimit: 10240 * 1024 * 1024,  //最大文件 10 个G
                        fileSingleSizeLimit: 1024 * 1024 * 1024
                    });
                    uploader.on('uploadStart', function () {
                        uploader.options.formData.path = attrs.datadirpath
                        // console.log("datadirpath", uploader.options.formData.path);
                    });

                    uploader.on('fileQueued', function (file) {
                        // console.log("文件队列", file);
                        uploader.options.formData.name = file.name;
                        var timestamp = Date.parse(new Date());
                        timestamp = timestamp / 1000;
                        $timeout(function () {
                            scope.dirList.push({
                                filename: file.name,
                                filesize: file.size,
                                create_dateline: timestamp,
                                filewidth: 0,
                                wid: file.id
                            })
                            $("#uploadFileModal").modal('hide');
                        })
                    });
                    uploader.on('uploadSuccess', function (wufile, succfile) {
                        // console.log("队列文件上传成功", arguments);
                        succfile.fullpath = Util.String.baseName(succfile.fullpath);
                        Exhibition.fileUploadSuss({
                            hash: attrs.datadirhash,
                            type: 'add',
                            size: succfile.filesize
                        }).then(function (res) {
                            // console.log("数据上传ces", scope.DirsList, scope.thisDirPath);

                            //替换文件上传成功后文件的名称
                            var len = scope.dirList.length;
                            for (var i = len; i >= 0; i--) {
                                if (scope.dirList[i] && scope.dirList[i].wid) {
                                    if (scope.dirList[i].wid == wufile.id) {
                                        $timeout(function () {
                                            scope.dirList[i].filename = succfile.fullpath;
                                            scope.dirList[i].hash = succfile.hash;
                                            scope.dirList[i].fullpath = succfile.fullpath;
                                        })
                                        break;
                                    }
                                }
                            }

                            Exhibition.getDirCountSize({hash: attrs.datadirhash}).then(function (data) {
                                console.log("数据上传成功后更新", data)
                                for (var n = 0; n < scope.DirsList.length; n++) {
                                    if (scope.DirsList[n].fullpath == scope.thisDirPath) {
                                        break;
                                    }
                                }
                                $timeout(function () {
                                    scope.DirsList[n].info = {
                                        file_count: data.file_count,
                                        file_size: data.file_size,
                                        img_url: [scope.DirsList[n].info.img_url[0]]
                                    };
                                    var allCount = Number(scope.currentExbt.property.file_count);
                                    scope.currentExbt.property.file_count = allCount + 1;
                                    scope.currentExbt.property.size_use = Number(scope.currentExbt.property.size_use) + data.file_size;
                                })
                            })
                        })
                    });


                    uploader.on('uploadProgress', function (fileObj, progress) {
                        // console.log("上传进度", arguments);
                        var file = _.findWhere(scope.dirList, {
                            wid: fileObj.id
                        });
                        var index = "";
                        _.each(scope.dirList, function (r) {
                            if (r.wid == fileObj.id) {
                                index = scope.dirList.indexOf(r);
                            }
                        });
                        $("#loadFileList ul li:nth-child(" + (index + 1) + ")").find(".col-sm-12 i").on('click', function () {
                            uploader.cancelFile(fileObj.id);
                            scope.$apply(function () {
                                scope.dirList.splice(index, 1);
                            })
                        });

                        if (file) {
                            scope.$apply(function () {
                                file.filewidth = Number(progress) * 100;
                            })
                        }

                    });
                    uploader.on('error', function (err) {
                        console.log("图片上传报错", err);
                        alert("上传有误! \n\n 温馨提示您:单次上传文件大小不得大于1G。");
                    });

                }


            }

            ,


        };
    });

    //修改各种文件的名称
    app.directive('editName', function (Exhibition, $timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.click(function (event) {
                    if (event.target.nodeName == "INPUT") {
                        return;
                    }
                    $timeout(function () {
                        var name = $.trim(elem.text());
                        if (attrs.dataedit == "sitename") {
                            name = attrs.datasite;
                        }
                        var input = '<input type="text" class="exhibitionName" value="' + name + '" />';
                        $(elem).empty().append(input);
                        if (attrs.dataedit == "filename") {
                            var selectionEnd = name.length;
                            var lenIndex = name.lastIndexOf('.');
                            console.log("selectionEnd", selectionEnd, lenIndex);
                            if (lenIndex > 0) {
                                selectionEnd = lenIndex;
                            }
                            elem.find('input')[0].selectionStart = 0;
                            elem.find('input')[0].selectionEnd = selectionEnd;
                            elem.find('input').focus();
                        }
                        else {
                            $(elem).find('input').focus().select();
                        }
                        $(elem).find('input').blur(function () {
                            var text = $.trim($(this).val());
                            console.log(text);
                            if (text == "" || text == name) {
                                $(elem).empty().text(name);
                            } else {
                                if (attrs.dataedit == "title") {
                                    if (text.length > 48) {
                                        alert("会展名称不得长于48个字节!");
                                        elem.empty().text(name);
                                        return false;
                                    }
                                    Exhibition.editExTitle({
                                        exhibition_id: attrs.dataid,
                                        title: text
                                    }).then(function (res) {
                                        $(elem).empty().text(text);
                                        $rootScope.projectTitle = text + " - 会文件";
                                    })
                                }
                                if (attrs.dataedit == "filename") {
                                    scope.file.fullpath = text;
                                    Exhibition.editExFilename({
                                        org_id: attrs.dataid,
                                        fullpath: attrs.datapath,
                                        newpath: text
                                    }).then(function (res) {
                                        $(elem).empty().text(text);
                                        var idx = elem.parents('.col-md-4').index();
                                        scope.FilesList[idx].fullpath = text;
                                        scope.FilesList[idx].filename = text;
                                    })
                                }
                                if (attrs.dataedit == "dirname") {
                                    scope.dir.fullpath = text;
                                    Exhibition.editExDirname({
                                        org_id: attrs.dataid,
                                        fullpath: attrs.datapath,
                                        newpath: text
                                    }).then(function (res) {
                                        console.log(res);
                                        $(elem).empty().text(text);
                                        var idx = elem.parents('.col-md-4').index();
                                        scope.DirsList[idx].fullpath = text;
                                        scope.DirsList[idx].filename = text;
                                    })
                                }

                                if (attrs.dataedit == "sitename") {
                                    Exhibition.editExTitle({
                                        exhibition_id: attrs.dataid,
                                        website: text
                                    }).then(function (res) {
                                        $timeout(function () {
                                            $(elem).empty().text("点击编辑主页地址");
                                            scope.currentExbt.property.web_site = text;
                                        })

                                    })
                                }


                            }
                        })
                    })
                })

                scope.$watch(attrs.editName, function (value) {
                    if (value === true) {
                        elem.trigger('click');
                        scope[attrs.editName] = false;
                    }
                });

            },


        };
    });

    //添加分类
    app.directive('filesortAdd', function (Exhibition, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.click(function () {
                    var arr = attrs;
                    var state = false;
                    _.each(scope.DirsList, function (d) {
                        if (d.filename == "请填写分类名称" || d.fullpath == "请填写分类名称") {
                            alert("请先给原始文件夹命名!");
                            state = true;
                        }
                    })
                    if (state) {
                        return;
                    }
                    scope.sort_maskloading = true;
                    Exhibition.addFolder({org_id: arr.dataorgid, fullpath: "请填写分类名称"}).then(function (r) {
                        var data = r.data;
                        console.log(data);
                        $timeout(function () {
                            scope.DirsList.push({
                                fullpath: data.fullpath,
                                hash: data.hash,
                                filename: data.fullpath,
                                autoEditName: true,
                                info: {file_count: 0, file_size: 0, img_url: [data.img_url[0]]}
                            });
                            scope.sort_maskloading = false;
                            scope.currentExbt.property.dir_count = Number(scope.currentExbt.property.dir_count) + 1;
                        })
                    });
                })

            },
        };
    });

    //从云库中选择文件
    app.directive('gokuaiCloud', function (Exhibition, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.click(function () {
                    console.log("attrs", attrs);
                    try {
                        var el = document.createElement('script');
                        el.src = location.protocol + '//yunku.goukuai.cn/widget/index?_' + Math.random();
                        el.type = 'text/javascript';
                        document.body.appendChild(el);
                        el.onload = el.onreadystatechange = function () {
                            if (!/*@cc_on!@*/0 || this.readyState == 'loaded' || this.readyState == 'complete') {
                                new GKC({
                                    //options
                                    client_id: '60f3cd399bffa0b9a13926689d0a5cca',
                                    style: {
                                        'borderRadius': '3px',
                                        'MozBorderRadius': '3px',
                                        'WebkitBorderRadius': '3px',
                                        'borderColor': '#fff',
                                        'borderWidth': '0',
                                        'borderStyle': 'solid',
                                        'backgroundColor': '#fff',
                                        'position': 'fixed',
                                        'top': '30px',
                                        'left': '50%',
                                        'margin-left': '-305px',
                                        'height': '620px',
                                        'width': '610px',
                                        'zIndex': 99999
                                    },
                                    ok: function (files) {
                                        files = files[0];
                                        console.log(files);
                                        var name = Util.String.baseName(files.fullpath);
                                        var params = {
                                            org_id: scope.orgid,
                                            filename: name,
                                            hash: files.filehash,
                                            size: files.filesize
                                        }
                                        if (scope.exportFilename == "file") {
                                            Exhibition.copyFilrFromCloud(params).then(function (res) {
                                                // console.log("返回给我很多数据噢", res);
                                                $("#uploadFileModal").modal('hide');
                                                $timeout(function () {
                                                    scope.FilesList.push({
                                                        filename: name,
                                                        fullpath: name,
                                                        filesize: files.filesize
                                                    })
                                                    scope.currentExbt.property.file_count = Number(scope.currentExbt.property.file_count) + 1;
                                                    scope.currentExbt.property.size_use = Number(scope.currentExbt.property.size_use) + files.filesize;
                                                })
                                            });
                                        }
                                        if (scope.exportFilename == "dirFile") {
                                            params.filename = scope.thisDirPath + "/" + name;
                                            Exhibition.copyFilrFromCloud(params).then(function (res) {
                                                // console.log("返回给我很多数据噢123123", res);
                                                $("#uploadFileModal").modal('hide');
                                                var backFilename = Util.String.baseName(res.fullpath);
                                                scope.dirList.push({
                                                    filename: backFilename,
                                                    fullpath: res.fullpath,
                                                    filesize: files.filesize,
                                                    create_dateline: Date.parse(new Date()) / 1000
                                                })
                                                Exhibition.fileUploadSuss({
                                                    hash: scope.thisDirHash,
                                                    type: 'add',
                                                    size: files.filesize
                                                }).then(function (res) {
                                                    // console.log("数据上传ces", res, scope.dirList);
                                                    //替换文件上传成功后文件的名称
                                                    var len = scope.DirsList.length;
                                                    console.log("lenlenme", scope.DirsList);
                                                    for (var i = 0; i < len; i++) {
                                                        if (scope.DirsList[i]) {
                                                            if (scope.DirsList[i].fullpath == scope.thisDirPath) {
                                                                $timeout(function () {
                                                                    scope.DirsList[i].info = {
                                                                        file_count: Number(scope.DirsList[i].info.file_count) + 1,
                                                                        file_size: Number(scope.DirsList[i].info.file_size) + files.filesize,
                                                                        img_url: [scope.DirsList[i].info.img_url[0]]
                                                                    };
                                                                    scope.currentExbt.property.file_count = Number(scope.currentExbt.property.file_count) + 1;
                                                                    scope.currentExbt.property.size_use = Number(scope.currentExbt.property.size_use) + files.filesize;
                                                                })
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    // Exhibition.getDirCountSize({hash: scope.thisDirHash}).then(function (data) {
                                                    //     console.log("数据上传成功后更新aaa", data);
                                                    //     var len = scope.DirsList.length;
                                                    //     for (var i = len; i >= 0; i--) {
                                                    //         if (scope.DirsList[i].fullpath == scope.thisDirPath) {
                                                    //             $timeout(function () {
                                                    //                 scope.DirsList[i].info = {
                                                    //                     file_count: data.file_count,
                                                    //                     file_size: data.file_size,
                                                    //                     img_url: [scope.DirsList[i].info.img_url[0]]
                                                    //                 };
                                                    //                 var allCount = Number(scope.currentExbt.property.file_count);
                                                    //                 scope.currentExbt.property.file_count = allCount + 1;
                                                    //                 scope.currentExbt.property.size_use = Number(scope.currentExbt.property.size_use) + data.file_size;
                                                    //             })
                                                    //             break;
                                                    //         }
                                                    //     }
                                                    //
                                                    // })
                                                })


                                            });

                                        }


                                    }


                                });
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }

                })

            },
        };
    });


    //资料收集夹文件上传
    app.directive('collectUpload', function ($timeout, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                $timeout(function () {
                    Exhibition.getFileToken(attrs.dataorgid).then(function (da) {
                        uploadimg(da.data.url, da.data.org_client_id);
                    });
                });

                function uploadimg(url, clientid) {
                    var uploader = WebUploader.create({
                        pick: {
                            id: elem,
                        },
                        auto: true,
                        swf: 'http://cdn.staticfile.org/webuploader/0.1.0/Uploader.swf',
                        server: url,
                        formData: {
                            org_client_id: clientid,
                            name: '',
                            filefield: 'file',
                            file: 'file',
                            path: ''
                        },
                        duplicate: true,//重复文件
                        fileSizeLimit: 1024 * 1024 * 1024,  //最大文件 1 个G
                        fileSingleSizeLimit: 10240 * 1024 * 1024 //文件上传总量 10 个G
                    });
                    uploader.on('fileQueued', function (file) {
                        uploader.options.formData.path = attrs.datacollect;
                        uploader.options.formData.name = file.name;

                        console.log("队列上茶123", uploader.options.formData.name);


                        $timeout(function () {
                            scope.fileCollect.push({
                                filename: file.name,
                                fullpath: attrs.datacollect + '/' + file.name,
                                filesize: file.size,
                                filewidth: 0,
                                create_dateline: Date.parse(new Date()),
                                wid: file.id
                            })


                        })
                    });
                    uploader.on('uploadSuccess', function (uploadFile, returnFile) {

                        console.log("上传成功", arguments, scope.fileCollect);

                    });
                    uploader.on('uploadProgress', function (fileObj, progress) {
                        // console.log("上传进度", arguments);
                        var file = _.findWhere(scope.fileCollect, {
                            wid: fileObj.id
                        });
                        var index = "";
                        _.each(scope.fileCollect, function (r) {
                            if (r.wid == fileObj.id) {
                                index = scope.fileCollect.indexOf(r);
                            }
                        });
                        $(".C_fileList ul li:nth-child(" + (index + 1) + ")").find(".diff i").on('click', function () {
                            uploader.cancelFile(fileObj.id);
                            scope.$apply(function () {
                                scope.fileCollect.splice(index, 1);
                            })
                        });
                        if (file) {
                            scope.$apply(function () {
                                file.filewidth = Number(progress) * 100;
                            })
                        }

                    });
                    uploader.on('error', function (err) {
                        console.log("文件上传报错", err);
                        alert("上传有误! \n\n 温馨提示您:单次上传文件大小不得大于1G。");
                    });

                }


            },


        };
    });


    // 点击选中当前文件
    app.directive('chooseCollect', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {
                    var state = elem.find("input[type=checkbox]").prop("checked");
                    // console.log(state, elem.find("input[type=checkbox]").val());
                    if (state == false) {
                        scope.dataCollectList.selects = true;
                        elem.find("input[type=checkbox]").prop("checked", true);
                    } else {
                        scope.dataCollectList.selects = false;
                        elem.find("input[type=checkbox]").prop("checked", false);
                    }
                })
            },
        };
    });


    //从已有文件或资料收集夹中选取文件
    app.directive('selectUpload', function ($timeout, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.on('click', function () {
                    $("#uploadFileModal").modal('hide');
                    scope.dataCollectList = [];

                    if (attrs.dataselect == "collect") {
                        if (scope.currentExbt.res_collect_lock == 0) {
                            $("#openCollectFile").modal('show');
                            return;
                        }
                        $("#fileFromCollect").modal('show');
                        scope.collectTitle = "从资料收集选择文件";
                        Exhibition.getDirFilesByID({
                            org_id: scope.orgid,
                            fullpath: scope.currentExbt.res_collect
                        }).then(function (res) {
                            console.log("加载列表信息", res);
                            $timeout(function () {
                                scope.collectLoading = false;
                                _.each(res.list, function (r) {
                                    r.selects = false;
                                })
                                scope.dataCollectList = res.list;
                            })
                        });
                    } else {  //已有分类中选择
                        $("#fileFromCollect").modal('show');
                        scope.collectTitle = "从已有分类选择文件";
                        var paras = {
                            org_id: scope.orgid,
                            has_col: scope.currentExbt.res_collect_lock
                        };
                        if (scope.uploadstate == "dirs") {
                            paras = {
                                org_id: scope.orgid,
                                has_col: scope.currentExbt.res_collect_lock,
                                fullpath: scope.thisDirPath
                            }
                        }
                        Exhibition.getAllOfFile(paras).then(function (res) {
                            console.log("发明痕迹", res)
                            $timeout(function () {
                                scope.collectLoading = false;
                                _.each(res, function (re) {
                                    re.selects = false;
                                })
                                scope.dataCollectList = res;
                            })
                        })
                    }

                })

            }
        }
    })

    function validationTestDirective() {
        'ngInject';

        return {
            restrict: 'A',
            link: linkFn,
            require: 'ngModel'
        };

        function linkFn(scope, elem, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newVal) {
                if (newVal === 'test') {
                    ngModelCtrl.$setValidity('test', true);
                } else {
                    ngModelCtrl.$setValidity('test', false);
                }
            });
        }
    }
}