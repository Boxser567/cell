'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';

function ExhibitionDetailController($scope, $rootScope, $stateParams, $timeout, currentExhibition, Exhibition, usSpinnerService) {
    'ngInject';
    console.log("返回详情数据", $stateParams, currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
    $scope.orgid = currentExhibition.data.org_id;
    $scope.groupList = currentExhibition.data.group;


    if ($scope.currentExbt.res_collect_lock == 1) {
        $(".mui-switch").attr("checked", true);
    }
    $scope.collectUrl = "http://cell.meetingfile.com/#/collect/" + $stateParams.unicode + "";
    $scope.imgloading = false;
    $scope.collectLoading = true;
    $scope.fileloading = true;
    $scope.FilesList = [];
    $scope.DirsList = [];
    $scope.dataCollectList = [];
    $scope.warpMask = false;
    $scope.btnloading = false;
    $scope.collectTitle = "从资料收集选择文件";
    $timeout(function () {
        $(".slide_warp li:nth-child(1)").addClass("active");
        Exhibition.getGroupDetail($scope.groupList[0].id).then(function (res) {
            $scope.DirsList = res.folder;
        })
    })
    // $scope.endDateBeforeRender = $scope.aendDateBeforeRender;
    // $scope.endDateOnSetTime = $scope.aendDateOnSetTime;
    // $scope.startDateBeforeRender = $scope.astartDateBeforeRender;
    // $scope.startDateOnSetTime = $scope.astartDateOnSetTime;
    // $scope.astartDateOnSetTime = function () {
    //     $scope.$broadcast('start-date-changed');
    // }
    // $scope.aendDateOnSetTime = function () {
    //     $scope.$broadcast('end-date-changed');
    // }
    // $scope.astartDateBeforeRender = function ($dates) {
    //     if ($scope.dateRangeEnd) {
    //         var activeDate = moment($scope.dateRangeEnd);
    //         $dates.filter(function (date) {
    //             return date.localDateValue() >= activeDate.valueOf()
    //         }).forEach(function (date) {
    //             date.selectable = false;
    //         })
    //     }
    // }
    // $scope.aendDateBeforeRender = function ($view, $dates) {
    //     if ($scope.dateRangeStart) {
    //         var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');
    //         $dates.filter(function (date) {
    //             return date.localDateValue() <= activeDate.valueOf()
    //         }).forEach(function (date) {
    //             date.selectable = false;
    //         })
    //     }
    // }


    // Exhibition.getDirFilesByID({org_id: $scope.orgid}, false).then(function (data) {
    //     var files = [], dirs = [];
    //     _.each(data.list, function (list) {
    //         if (list.dir) {
    //             if (typeof list.info.img_url == "string") {
    //                 list.info.img_url = JSON.parse(list.info.img_url);
    //             }
    //             dirs.push(list);
    //         }
    //         else {
    //             files.push(list);
    //         }
    //     })
    //     $scope.fileloading = false;
    //     $scope.FilesList = files;
    //     $scope.DirsList = dirs;
    //     // console.log("文件夹信息", $scope.DirsList);
    // });


    //$scope.Extiming = false;
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
                    $scope.currentExbt.res_collect_lock = 1;
                    $(".mui-switch-anim").prop("checked", true);
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
        var isCheck = $(".ckb_selectAll").prop("checked");
        if (!isCheck) {
            $timeout(function () {
                _.each($scope.dataCollectList, function (ck) {
                    ck.selects = false;
                })
            })
        } else {
            $timeout(function () {
                _.each($scope.dataCollectList, function (ck) {
                    ck.selects = true;
                })
            })
        }
    };


    //添加选中文件
    $scope.addSelectFile = function () {
        $scope.btnloading = true;
        var params = {
            org_id: $scope.orgid,
            files: []
        };
        var dirsize = 0, dircount = 0;
        if ($scope.uploadstate == "files") {
            _.each($scope.dataCollectList, function (r) {
                if (r.selects) {
                    params.files.push({
                        filename: r.filename,
                        hash: r.filehash,
                        size: r.filesize
                    });
                    dirsize += Number(r.filesize);
                    dircount++;
                }
            });
        } else {
            _.each($scope.dataCollectList, function (r) {
                if (r.selects) {
                    params.files.push({
                        filename: $scope.thisDirPath + "/" + r.filename,
                        hash: r.filehash,
                        size: r.filesize
                    })
                    dirsize += Number(r.filesize);
                    dircount++;
                }
            });
            params.hash = $scope.thisDirHash;
            params.dirsize = dirsize;
            params.dircount = dircount;
        }
        if (dircount == 0) {
            $scope.btnloading = false;
            return;
        }


        $scope.currentExbt.property.file_count += dircount;
        $scope.currentExbt.property.size_use += dirsize;

        Exhibition.copyFilFromHad(params).then(function (res) {
            // console.log("返回给我很多数据噢", params, res);
            if ($scope.uploadstate == "dirs") {
                $timeout(function () {
                    _.each(res, function (r) {
                        $scope.dirList.push({
                            hash: r.hash,
                            filename: Util.String.baseName(r.fullpath),
                            filesize: r.filesize,
                            create_dateline: (Date.parse(new Date())) / 1000
                        })
                    });

                    for (var n = 0; n < $scope.DirsList.length; n++) {
                        if ($scope.DirsList[n].fullpath == $scope.thisDirPath) {
                            $scope.DirsList[n].info.file_count += dircount;
                            $scope.DirsList[n].info.file_size += dirsize;
                        }
                    }
                })
            } else {
                $timeout(function () {
                    _.each(res, function (f) {
                        $scope.FilesList.push({
                            hash: f.hash,
                            fullpath: f.fullpath,
                            filename: Util.String.baseName(f.fullpath),
                            filesize: f.filesize,
                            create_dateline: (Date.parse(new Date())) / 1000
                        })
                    })
                })
            }
            $scope.dataCollectList = [];
            $("#fileFromCollect").modal('hide');
        });
    };


    $scope.uploadStateFn = function () {
        $scope.uploadstate = "dirs";
    };

    $scope.fileChooser = function () {
        $scope.uploadstate = "files";
        $timeout(function () {
            $scope.exportFilename = "file";
            $scope.thisDirPath = false;
            $scope.thisDirHash = false;
        })

    }


    //获取banner列表
    $scope.bannerloading = true;
    $scope.bannerList = [];
    $scope.getBannerFn = function () {
        $("#changeBannerModal").modal('show');
        if ($scope.bannerList <= 0) {
            Exhibition.getBannerList().then(function (res) {
                $scope.bannerList = res;
            })
        }
    }


    //切换分组
    $scope.grouploading = false;
    $scope.changeGroup = function (event, groid) {
        $scope.grouploading = true;
        $(event.currentTarget).parent('li').addClass('active').siblings().removeClass('active');
        Exhibition.getGroupDetail(groid).then(function (res) {
            console.log("切换分组返回数据", res);
            $timeout(function () {
                $scope.DirsList = res.folder;
                $scope.grouploading = false;
                $scope.select_groid = groid;
            })
        })
    }


    $scope.groupSetting = {};

    //获取分组详细信息
    $scope.getGroupFn = function (groid) {
        console.log("group", groid, arguments);
        Exhibition.getGroupDetail(groid).then(function (res) {
            console.log(res);
            $timeout(function () {
                $(".gro_data_select").val(res.forever.toString());
                // $(".ipt_hidden").prop("checked", Boolean(res.hidden));
                $scope.groupSetting = {
                    id: res.id,
                    name: res.name,
                    start_time: res.start_time,
                    end_time: res.end_time,
                    hidden: Boolean(res.hidden),
                    forever: res.forever
                }
                $("#groupSettingModal").modal("show");
            })
        })
    };

    //分组设置修改
    $scope.saveGroupInfoFn = function () {
        // console.log("修改后的信息", $scope.groupSetting);
        var params = {};
        if (Number($scope.groupSetting.forever) == 1) {
            params = {
                group_id: $scope.groupSetting.id,
                name: $scope.groupSetting.name,
                hidden: Number($scope.groupSetting.hidden),
                forever: Number($scope.groupSetting.forever)
            }
        } else {
            params = {
                group_id: $scope.groupSetting.id,
                name: $scope.groupSetting.name,
                hidden: Number($scope.groupSetting.hidden),
                forever: Number($scope.groupSetting.forever),
                start_time: $scope.groupSetting.start_time,
                end_time: $scope.groupSetting.end_time,
            }
        }
        Exhibition.editGroupInfo(params).then(function (res) {
            console.log("分组是否修改成功", res);
            _.each($scope.groupList, function (g) {
                if (g.id == $scope.groupSetting.id) {
                    g.name = $scope.groupSetting.name;
                }
            })
            $("#groupSettingModal").modal('hide');
        })
    }


    //删除分组
    $scope.delGroup = function () {
        //console.log($scope.groupList);
        if (confirm("确定要删除分组吗? \n 删除后分组和分组内的专题将全部不存在!")) {
            Exhibition.delGroupInfo($scope.groupSetting.id).then(function (res) {
                //console.log("删除分组", res);
                var index;
                for (var i = 0; i < $scope.groupList.length; i++) {
                    if ($scope.groupList[i].id == $scope.groupSetting.id) {
                        index = i;
                        break;
                    }
                }
                $timeout(function () {
                    $scope.groupList.splice(index, 1);
                })
                $("#groupSettingModal").modal('hide');
            })
        }

    }

}

export default ExhibitionDetailController;