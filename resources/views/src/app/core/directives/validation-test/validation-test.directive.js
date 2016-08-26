'use strict';

import WebUploader from 'webuploader/dist/webuploader';

export default function (app) {

    app.directive('validationTest', validationTestDirective);

    app.directive('hoverTrans', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $(elem).on("mouseenter", function () {
                    $timeout(function () {
                        $(elem).parents('.trans').find(".thumcode").css("z-index", "11").show();
                        $(elem).parents('.trans').css("transform", "rotateY(180deg)");
                    })
                })
            },


        };
    });
    app.directive('codeLeave', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $(elem).mouseout(function () {
                    $(elem).css("z-index", "1").hide();
                    $(elem).parent('.trans').css("transform", "rotateY(0deg)");
                })

            },


        };
    });


    app.directive('uploadFiles', function ($timeout, Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    $timeout(function () {
                        Exhibition.getFileToken(attrs.dataorgid).then(function (da) {
                            uploadimg(da.data.url, da.data.org_client_id);
                        });
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

                        },
                        fileNumLimit: 100,
                        fileSizeLimit: 10240 * 1024 * 1024,  //最大文件 10 个G
                        fileSingleSizeLimit: 1024 * 1024 * 1024
                    });
                    uploader.on('fileQueued', function (file) {
                        console.log("文件队列", file);
                        uploader.options.formData.name = file.name;
                        $timeout(function () {
                            scope.currentExbt.files.list.push({
                                filename: file.name,
                                fullpath: file.name,
                                filesize: file.size,
                                filewidth: 0,
                                wid: file.id
                            })
                        })
                    });
                    uploader.on('uploadSuccess', function () {
                        console.log("12313", arguments);

                    });
                    uploader.on('uploadProgress', function (fileObj, progress) {
                        console.log("上传进度", arguments);
                        var file = _.findWhere(scope.currentExbt.files.list, {
                            wid: fileObj.id
                        });
                        var index = "";
                        _.each(scope.currentExbt.files.list, function (r) {
                            if (r.wid == fileObj.id) {
                                index = scope.currentExbt.files.list.indexOf(r);
                            }
                        });
                        console.log("当前索引", index);
                        $(".eb-fileload .row .col-md-4:nth-child(" + (index + 1) + ")").find(".slide-line i").on('click', function () {
                            uploader.cancelFile(fileObj.id);
                        });

                        if (file) {
                            scope.$apply(function () {
                                file.filewidth = Number(progress) * 100;
                            })
                        }

                    });
                    uploader.on('error', function (err) {
                        console.log("图片上传报错", err);
                        alert("上传有误! \n\n 温馨提示您:。");
                    });

                }


            },


        };
    });


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
                        uploader.options.formData.key = file_name + '.' + Util.String.getExt(file.name);
                    });
                    uploader.on('uploadSuccess', function () {
                        var arg = server + "/" + arguments[1].key + "-160";
                        Exhibition.editExTitle({exhibition_id: attrs.dataid, logo: arg}).then(function (res) {
                            $timeout(function () {
                                scope.currentExbt.logo = arg;
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


    app.directive('editName', function (Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $(elem).click(function () {
                    var name = $(elem).text();
                    var input = '<input type="text" class="exhibitionName" value="' + name + '" />';
                    $(elem).empty().append(input);
                    $(elem).find('input').focus().select();
                    $(elem).find('input').blur(function () {
                        var text = $(this).val();
                        console.log(text);
                        if (text.trim() == "") {
                            $(elem).empty().text(name);
                        } else {
                            if (attrs.dataedit == "title") {
                                Exhibition.editExTitle({exhibition_id: attrs.dataid, title: text}).then(function (res) {
                                    $(elem).empty().text(text);
                                })
                            }
                            if (attrs.dataedit == "filename") {
                                Exhibition.editExFilename({
                                    org_id: attrs.dataid,
                                    fullpath: attrs.datapath,
                                    newpath: text
                                }).then(function (res) {
                                    $(elem).empty().text(text);
                                })
                            }
                            if (attrs.dataedit == "dirname") {
                                Exhibition.editExDirname({
                                    org_id: attrs.dataid,
                                    fullpath: attrs.datapath,
                                    newpath: text
                                }).then(function (res) {
                                    console.log(res);
                                    $(elem).empty().text(text);
                                })
                            }
                        }
                    })
                })

            },


        };
    });

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