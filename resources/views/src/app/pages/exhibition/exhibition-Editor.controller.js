'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';
import "angular-bootstrap-datetimepicker/src/js/datetimepicker";
import datetimepicker from  "angular-bootstrap-datetimepicker/src/js/datetimepicker.templates";

function ExhibitionDetailController($scope, $rootScope, $stateParams, $timeout, currentExhibition, Exhibition) {
    'ngInject';
    console.log("返回详情数据", currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
    $scope.stateMode = true;
    $scope.collectLoading = true;       //资料收集
    $scope.collectUrl = "http://cell.meetingfile.com/#/collect/" + $stateParams.unicode + "";
    //logo上传加载
    $scope.imgloading = false;
    $scope.fileloading = true;//常用文件的加载
    $scope.localFilesJSON = [];   //用于缓存正在上传文件信息

    //常用文件的获取
    $scope.FilesList = [];
    Exhibition.getFileInfoByPath({
        ex_id: $scope.currentExbt.id,
        fullpath: $scope.currentExbt.base_folder
    }, false).then(function (file) {
        $scope.fileloading = false;
        _.each(file.data, function (r) {
            r.property = JSON.parse(r.property);
        })
        $scope.FilesList = file.data;
        console.log("常用文件信息", $scope.FilesList);
    });

    //显示上传文件弹出窗口
    $scope.fileChooser = function () {
        $("#uploadFileModal").modal('show');
        $scope.uploadstate = "files";
    }

    //收集资料全选事件
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

    //收集资料全选----添加选中文件
    $scope.addSelectFile = function () {
        $scope.btnloading = true;
        var params = {
            org_id: $scope.currentExbt.org_id,
            ex_id: $scope.currentExbt.id,
            files: []
        };


        // id: '',
        //     ex_id: scope.currentExbt.id,
        //     hash: '',
        //     size: file.size,
        //     title: file.name,
        //     property: {
        //     style: 1,
        //         back_pic: "http://res.meetingfile.com/2168a80ad9c3a8b1a07eb78751e37e4d2491041a.jpg",
        //         title: file.name
        // }

        _.each($scope.dataCollectList, function (r) {
            if (r.selects) {
                params.files.push({
                    filename: r.filename,
                    hash: r.filehash,
                    size: r.filesize
                });
            }
        });
        Exhibition.copyFilFromHad(params).then(function (res) {
            $scope.btnloading = false;
            _.each(res, function (r) {
                r.property = JSON.parse(r.property);
                $scope.FilesList.push(r);
            })
            $("#fileFromCollect").modal('hide');
        })
    };


    $scope.delFileFn = function () {        //删除常用文件
        if (confirm("确定要删除该文件吗?")) {
            Exhibition.delFileinfo({
                org_id: $scope.currentExbt.org_id,
                file_id: $scope.fileglobal.id
            }).then(function (res) {
                $timeout(function () {
                    $scope.FilesList.splice($scope.fileglobal.Indexer, 1);
                })
            })
        }
    }


    if ($scope.currentExbt.res_collect_lock == 1) {     //收集按钮是否选中
        $(".mui_collect").attr("checked", true);
    }


    $scope.selectFileFn = function (e, index, file) {
        $(e.currentTarget).addClass("active").parent().siblings().find("a").removeClass("active");
        file.Indexer = index;
        $timeout(function () {
            $scope.fileglobal = file;
        })
        console.log(file);
    }
    $scope.resetfilebgFn = function () {
        if (confirm("确定要重置背景吗?")) {
            var arg = "http://res.meetingfile.com/2168a80ad9c3a8b1a07eb78751e37e4d2491041a.jpg";
            Exhibition.editFileinfo({
                file_id: $scope.fileglobal.id,
                back_pic: arg
            }).then(function (res) {
                $timeout(function () {
                    $scope.fileglobal.property.back_pic = arg;
                })
            })
        }
    }

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
                    $scope.currentExbt.start_date = start;
                    $scope.currentExbt.end_date = end;
                })
            }
        }
    }, false);

    $scope.endDateBeforeRender = endDateBeforeRender;
    $scope.endDateOnSetTime = endDateOnSetTime;
    $scope.startDateBeforeRender = startDateBeforeRender;
    $scope.startDateOnSetTime = startDateOnSetTime;

    function startDateOnSetTime() {
        $scope.$broadcast('start-date-changed');
    }

    function endDateOnSetTime() {
        $scope.$broadcast('end-date-changed');
    }

    function startDateBeforeRender($dates) {
        if ($scope.dateRangeEnd) {
            var activeDate = moment($scope.dateRangeEnd);
            $dates.filter(function (date) {
                return date.localDateValue() >= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
            $scope.dateRangeEnd = moment($scope.dateRangeEnd).format('YYYY-MM-DD HH:mm');
        }
    }

    function endDateBeforeRender($view, $dates) {
        if ($scope.dateRangeStart) {
            var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

            $dates.filter(function (date) {
                return date.localDateValue() <= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
            $scope.dateRangeStart = moment($scope.dateRangeStart).format('YYYY-MM-DD HH:mm');
        }
    }

    //资料收集状态
    $scope.checkCollecFn = function () {
        var va = $(".mui_collect").val();
        console.log("vava", va)
        if (va == 0) {
            $(".mui_collect").prop("checked", false);
            $("#openCollectFile").modal('show');
        }
        if (va == 1) {
            $("#closeCollectFile").modal('show');
            $(".mui_collect").prop("checked", true);
        }
        if (va == -1) {
            $("#msgCollectFile").modal('show');
            Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "open"}).then(function (res) {
                Exhibition.getDirFilesByID({
                    org_id: $scope.currentExbt.org_id,
                    fullpath: res.fullpath
                }, false).then(function (data) {
                    console.log("返回所有的资料信息", data);
                    $scope.collectLoading = false;
                    $scope.collectList = data.list;
                    $(".mui_collect").attr("checked", true);
                    $scope.currentExbt.res_collect_lock = 1;
                })
            });
        }
    }

    //首次开启资料收集
    $scope.openCollection = function () {
        $("#msgCollectFile").modal('show');
        Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "open"}).then(function (res) {
            $("#openCollectFile").modal('hide');
            Exhibition.getDirFilesByID({
                org_id: $scope.currentExbt.org_id,
                fullpath: res.fullpath
            }, false).then(function (data) {
                $scope.collectLoading = false;
                $scope.collectList = data.list;
                $timeout(function () {
                    $scope.currentExbt.res_collect_lock = 1;
                    $(".mui_collect").prop("checked", true);
                })

            })

        });
    }
    //查看资料收集信息
    $scope.showCollection = function () {
        $("#msgCollectFile").modal('show');
        Exhibition.getDirFilesByID({
            org_id: $scope.currentExbt.org_id,
            fullpath: $scope.currentExbt.res_collect
        }, false).then(function (data) {
            $scope.collectLoading = false;
            $scope.collectList = data.list;
        })
    };
    //关闭资料收集夹
    $scope.closeCollection = function () {
        Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "close"}).then(function (res) {
            $("#closeCollectFile").modal('hide');
            $(".mui_collect").prop("checked", false);
            $scope.currentExbt.res_collect_lock = -1;
        })
    };


    //更换banner背景图
    $scope.bannerList = [];
    $scope.getBannerFn = function () {
        $("#changeBannerModal").modal('show');
        if ($scope.bannerList.length <= 0) {
            Exhibition.getBannerList().then(function (res) {
                console.log("bannerList", res)
                $scope.bannerList = res;
            })
        }
    }


}

export default ExhibitionDetailController;