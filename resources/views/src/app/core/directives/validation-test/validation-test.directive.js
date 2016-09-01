'use strict';

import WebUploader from 'webuploader/dist/webuploader';

import Clipboard from "clipboard/dist/clipboard";



export default function (app) {

    app.directive('validationTest', validationTestDirective);

    app.directive('hoverTrans', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                var isQrCode = false;
                elem.find(".code-img").on("mouseenter", function () {
                    if (!isQrCode) {
                        isQrCode = true;
                        $(elem).find(".thumcode").css("z-index", "11").show();
                        $(elem).css("transform", "rotateY(180deg)");
                    }
                });
                elem.on('mouseleave', function () {
                    isQrCode = false;
                    $(elem).find('.thumcode').css("z-index", "1").hide();
                    $(elem).css("transform", "rotateY(0deg)");

                });
            },


        };
    });

    //设置会展时间
    // app.directive('exhitionTime', function ($timeout, Exhibition) {
    //     return {
    //         restrict: 'A',
    //         link: function (scope, elem) {
    //             elem.click(function () {
    //                 scope.Extiming = true;
    //                 $('#Extiming').daterangepicker({
    //                     "startDate": scope.currentExbt.start_date,
    //                     "endDate": scope.currentExbt.end_date,
    //                     locale: {
    //                         format: 'YYYY-MM-DD',
    //                     },
    //
    //                 }, function (start, end) {
    //                     if (confirm("您确定将会展时间设置为当前选中的时间吗?")) {
    //                         Exhibition.editExTitle({
    //                             start_date: start.format('YYYY-MM-DD'),
    //                             end_date: end.format('YYYY-MM-DD')
    //                         }).then(function (res) {
    //                             $timeout(function () {
    //                                 scope.Extiming = false;
    //                                 scope.currentExbt.start_date = start.format('YYYY-MM-DD');
    //                                 scope.currentExbt.end_date = end.format('YYYY-MM-DD');
    //                             })
    //                         })
    //                     }
    //                     console.log("" + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'))
    //                 });
    //
    //
    //             })
    //         },
    //
    //
    //     };
    // });

    app.directive("copyWebsite", function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                var clipboard = new Clipboard(elem[0], {
                    text: function (trigger) {
                        return trigger.getAttribute('data-clipboard-text');
                    }
                });
            },
        };
    });


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

                        },
                        duplicate: true,
                        // fileNumLimit: 100,
                        fileSizeLimit: 1024 * 1024 * 1024,  //最大文件 1 个G
                        fileSingleSizeLimit: 10240 * 1024 * 1024 //文件上传总量 10 个G
                    });
                    uploader.on('fileQueued', function (file) {
                        uploader.options.formData.name = file.name;
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
                    uploader.on('uploadSuccess', function () {
                        console.log("上传成功", arguments);

                    });
                    uploader.on('uploadProgress', function (fileObj, progress) {
                        //console.log("上传进度", arguments);
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
                            uploader.cancelFile(fileObj.id);
                            scope.$apply(function () {
                                scope.FilesList.splice(index, 1);
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
                        },
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
                        })
                    });
                    uploader.on('uploadSuccess', function (wufile, succfile) {
                        Exhibition.fileUploadSuss({
                            hash: attrs.datadirhash,
                            type: 'add',
                            size: succfile.filesize
                        }).then(function (res) {

                            console.log("数据上传ces", scope.DirsList, scope.thisDirPath);


                            Exhibition.getDirCountSize({hash: attrs.datadirhash}).then(function (data) {
                                // console.log("数据上传成功后更新", data)
                                for (var n = 0; n < scope.DirsList.length; n++) {
                                    if (scope.DirsList[n].fullpath == scope.thisDirPath) {
                                        break;
                                    }
                                }
                                $timeout(function () {
                                    scope.DirsList[n].info = {
                                        file_count: data.file_count,
                                        file_size: data.file_size
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
                        $("#loadFileList ul li:nth-child(" + (index + 2) + ")").find(".col-sm-12 i").on('click', function () {
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


    app.directive('editName', function (Exhibition, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                $(elem).click(function (event) {
                    if (event.target.nodeName == "INPUT") {
                        return;
                    }
                    $timeout(function () {
                        var name = $.trim(elem.text());
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
                            if (text == "") {
                                $(elem).empty().text(name);
                            } else {
                                if (attrs.dataedit == "title") {
                                    Exhibition.editExTitle({
                                        exhibition_id: attrs.dataid,
                                        title: text
                                    }).then(function (res) {
                                        $(elem).empty().text(text);
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
                            }
                        })
                    })
                })

            },


        };
    });

    app.directive('filesortAdd', function ($compile, Exhibition, $timeout) {
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


                    Exhibition.addFolder({org_id: arr.dataorgid, fullpath: "请填写分类名称"}).then(function (r) {
                        var data = r.data;
                        $timeout(function () {
                            scope.DirsList.push({
                                fullpath: data.fullpath,
                                hash: data.hash,
                                filename: data.fullpath,
                                info: {file_count: 0, file_size: 0}
                            });
                        })
                    });
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