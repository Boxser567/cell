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


    if ($scope.currentExbt.res_collect_lock == 1) {     //收集按钮是否选中
        $(".mui-switch").attr("checked", true);
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
                Exhibition.getDirFilesByID({
                    org_id: $scope.currentExbt.org_id,
                    fullpath: res.fullpath
                }, false).then(function (data) {
                    console.log("返回所有的资料信息", data);
                    $scope.collectLoading = false;
                    $scope.collectList = data.list;
                    $(".mui-switch").attr("checked", true);
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
                    $(".mui-switch-anim").prop("checked", true);
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
            $(".mui-switch").prop("checked", false);
            $scope.currentExbt.res_collect_lock = -1;
        })
    };


}

export default ExhibitionDetailController;