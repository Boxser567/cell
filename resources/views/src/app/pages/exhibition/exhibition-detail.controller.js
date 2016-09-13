'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';

function ExhibitionDetailController($scope, $rootScope, $stateParams, $timeout, currentExhibition, Exhibition) {
    'ngInject';


    console.log("返回详情数据", $stateParams, currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
    $scope.orgid = currentExhibition.data.org_id;
    if ($scope.currentExbt.res_collect_lock == 1) {
        $(".mui-switch").attr("checked", true);
    }
    $scope.collectUrl = "http://cell.meetingfile.com/#/collect/" + $stateParams.unicode + "";
    $scope.imgloading = false;
    $scope.collectLoading = true;
    $scope.FilesList = [];
    $scope.DirsList = [];
    $scope.dataCollectList = [];
    $scope.warpMask = false;
    Exhibition.getDirFilesByID({org_id: $scope.orgid}, false).then(function (data) {
        var files = [], dirs = [];
        _.each(data.list, function (list) {
            if (list.dir) {
                if (typeof list.info.img_url == "string") {
                    list.info.img_url = JSON.parse(list.info.img_url);
                }
                dirs.push(list);
            }
            else {
                files.push(list);
            }
        })
        $scope.FilesList = files;
        $scope.DirsList = dirs;
        // console.log("文件夹信息", $scope.DirsList);
    });


    // $scope.Extiming = false;
    $scope.date = {
        startDate: $scope.currentExbt.start_date,
        endDate: $scope.currentExbt.end_date
    };
    $scope.opts = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "确认",
            fromLabel: "From",
            format: "YYYY-MM-DD",
            toLabel: "To",
            cancelLabel: '取消',
            dateLimit: 120,     //最大只能选择120天
        },
    };

    $scope.$watch('date', function (time) {
        if (typeof time.startDate == "object") {
            var start = time.startDate.format('YYYY-MM-DD');
            var end = time.endDate.format('YYYY-MM-DD');
            if (start == $scope.currentExbt.start_date && end == $scope.currentExbt.end_date) {
            } else {
                Exhibition.editExTitle({
                    exhibition_id: currentExhibition.data.id,
                    start_date: start,
                    end_date: end
                }).then(function (res) {
                    console.log("时间", res);
                })
            }
        }
    }, false);


    //普通文件的删除
    $scope.delFile = function (event, id, path, size) {
        var that = $(event.currentTarget).parents(".col-md-4").index();
        if (confirm("确定要删除该文件(夹)吗?")) {
            var params = {
                org_id: id,
                fullpath: path
            };
            Exhibition.delExFile(params).then(function (res) {
                $scope.currentExbt.property.file_count = Number($scope.currentExbt.property.file_count) - 1;
                $scope.currentExbt.property.size_use = Number($scope.currentExbt.property.size_use) - size;
                $scope.FilesList.splice(that, 1);
            })
        }
    }

    //查看上传文件列表
    $scope.getDirList = function (event, img, path, hash) {
        $scope.warpMask = true;
        $scope.exportFilename = "dirFile";
        $timeout(function () {
            $scope.dirList = [];
            $scope.thisDirImg = img;
            $scope.thisDirPath = path;
            $scope.thisDirHash = hash;
            $scope.thisDirIndex = $(event.currentTarget).parents(".col-md-4").index();
        });
        // $("#loadFileList").modal('show');
        Exhibition.getDirFilesByID({org_id: $scope.orgid, fullpath: path}).then(function (res) {
            console.log("加载列表信息", res);
            $timeout(function () {
                $scope.dirList = res.list;
                $scope.warpMask = false;
            })
        });
    }

    //文件夹内部文件的删除
    $scope.delDirFiles = function (event, filesize, filename, filehash) {
        var index = $(event.currentTarget).parents("li").index() - 1;
        var dir = $scope.thisDirPath;
        var hash = $scope.thisDirHash;
        if (confirm("确定要删除该文件吗?")) {
            var params = {
                org_id: $scope.orgid,
                is_dir: 0,
                hash: hash,
                size: filesize,
                fullpath: dir + "/" + filename
            };
            Exhibition.delExFile(params).then(function (respon) {
                Exhibition.getDirCountSize({hash: hash}).then(function (data) {
                    console.log("数据删除", data);
                    $timeout(function () {
                        //文件夹内部文件列表
                        // $scope.dirList[index].info = {
                        //     file_count: data.file_count,
                        //     file_size: data.file_size
                        // }
                        //文件夹信息修改
                        $scope.DirsList[$scope.thisDirIndex].info = {
                            file_count: data.file_count,
                            file_size: data.file_size,
                            img_url: [$scope.thisDirImg]
                        }
                        $scope.currentExbt.property.file_count = Number($scope.currentExbt.property.file_count) - 1;
                        $scope.currentExbt.property.size_use = Number($scope.currentExbt.property.size_use) - filesize;
                        $scope.dirList.splice(index, 1);
                    })
                });

            })
        }
    };

    //文件夹的删除
    $scope.delDirs = function (event, filename, hash) {
        var index = $(event.currentTarget).parents('.col-md-4').index();
        if (confirm("确定要删除该文件夹吗?")) {
            var params = {
                org_id: $scope.orgid,
                is_dir: 1,
                hash: hash,
                fullpath: filename
            };
            Exhibition.getDirCountSize({hash: hash}).then(function (data) {
                $scope.currentExbt.property.dir_count = Number($scope.currentExbt.property.dir_count) - 1;
                $scope.currentExbt.property.file_count = Number($scope.currentExbt.property.file_count) - data.file_count;
                $scope.currentExbt.property.size_use = Number($scope.currentExbt.property.size_use) - data.file_size;
                Exhibition.delExFile(params).then(function (res) {
                    $scope.DirsList.splice(index, 1);
                });
            })
        }
    };

    //资料收集状态
    $scope.checkCollecFn = function () {
        var va = $(".mui-switch").val();
        console.log("vava", va)
        if (va == 0) {
            $(".mui-switch").prop("checked", false);
            $("#openCollectFile").modal('show');
        }
        if (va == 1) {
            $("#closeCollectFile").modal('show');
            $(".mui-switch").prop("checked", true);
        }
        if (va == -1) {

            $("#msgCollectFile").modal('show');
            Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "open"}).then(function (res) {
                Exhibition.getDirFilesByID({org_id: $scope.orgid, fullpath: res.fullpath}, false).then(function (data) {
                    console.log("返回所有的资料信息", data);
                    $scope.collectLoading = false;
                    $scope.collectList = data.list;
                    $(".mui-switch").attr("checked", true);
                    $scope.currentExbt.res_collect_lock = 1;
                })
            });

        }


    }


//正式开启资料收集
    $scope.openCollection = function () {
        $("#msgCollectFile").modal('show');
        Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "open"}).then(function (res) {
            $("#openCollectFile").modal('hide');
            Exhibition.getDirFilesByID({org_id: $scope.orgid, fullpath: res.fullpath}, false).then(function (data) {
                $scope.collectLoading = false;
                $scope.collectList = data.list;
                $timeout(function () {
                    $(".mui-switch").attr("checked", true);
                    $scope.currentExbt.res_collect_lock = 1;
                })

            })

        });

    };

//关闭资料收集夹
    $scope.closeCollection = function () {
        Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "close"}).then(function (res) {
            $("#closeCollectFile").modal('hide');
            $(".mui-switch").prop("checked", false);
            $scope.currentExbt.res_collect_lock = -1;
        })
    };

    //删除资料收集
    $scope.delCollectfile = function (event, path) {
        // $("#msgCollectFile").modal('show');
        var that = $(event.currentTarget).parents("li").index();
        if (confirm("确定要删除该文件吗?")) {
            var params = {
                org_id: $scope.orgid,
                fullpath: path
            };
            Exhibition.delExFile(params).then(function (res) {
                $scope.collectList.splice(that, 1);
            })
        }

    };

    //查看资料收集信息
    $scope.showCollection = function () {
        $("#msgCollectFile").modal('show');
        Exhibition.getDirFilesByID({
            org_id: $scope.orgid,
            fullpath: $scope.currentExbt.res_collect
        }, false).then(function (data) {
            $scope.collectLoading = false;
            $scope.collectList = data.list;
        })
    };

    //全选事件
    $scope.ckb_selectFn = function () {
        // var flag = $(".ckb_selectAll").attr("checked");
        // $("[name=cb_choose]:checkbox").each(function () {
        //     $(this).attr("checked", flag);
        // })
    };


    //添加选中文件
    $scope.addSelectFile = function () {
        var params = {
            org_id: $scope.orgid,
            files: []
        };
        _.each($scope.dataCollectList, function (r) {
            if (r.selects) {
                params.files.push({
                    filename: r.filename,
                    hash: r.filehash,
                    size: r.filesize
                })
            }
        })

        Exhibition.copyFilFromHad(params).then(function (res) {
            console.log("返回给我很多数据噢", params, res);
        });
    };



    $scope.uploadStateFn=function () {
      $scope.uploadstate="dirs";
    };


    $scope.fileChooser = function () {
        $scope.uploadstate="files";
        $timeout(function () {
            $scope.exportFilename = "file";
            $scope.thisDirPath = false;
            $scope.thisDirHash = false;
        })

    }
}

export default ExhibitionDetailController;