'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';
import "angular-bootstrap-datetimepicker/src/js/datetimepicker";
import datetimepicker from  "angular-bootstrap-datetimepicker/src/js/datetimepicker.templates";
// import datetimepicker from "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min";


function ExhibitionDetailController($scope, $rootScope, $window, $stateParams, $timeout, currentExhibition, $location, Exhibition, $warning) {
    'ngInject';
    console.log("返回详情数据", currentExhibition);
    $scope.siteHost = $location.host()+"/admin";
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
    $scope.collectLoading = true;       //资料收集
    $scope.collectUrl = "http://" + $scope.siteHost + "/#/collect/" + $stateParams.unicode + "";
    //logo上传加载
    $scope.fileloading = true;//常用文件的加载

    //常用文件的获取
    $scope.FilesList = [];
    Exhibition.getFileInfoByPath({
        ex_id: $scope.currentExbt.id,
        fullpath: $scope.currentExbt.base_folder
    }, false).then(function (file) {
        $scope.fileloading = false;
        _.each(file.data, function (r) {
            r.property = JSON.parse(r.property);
            r.property.title = Util.String.baseName(r.property.title);
        })
        $scope.FilesList = file.data;
        console.log("常用文件信息", $scope.FilesList);
    });

    // 以下代码用于调整页面布局
    $scope.reHeightFn = function () {
        var $height = $window.innerHeight - 732;
        $height = ($height + 70) / 2;
        $scope.$apply(function () {
            $(".slide-mobile").css("top", "" + $height + "px");
        });
    }
    $window.onresize = function () {
        $scope.reHeightFn();
    }
    $timeout(function () {
        $scope.reHeightFn();
    })


    //分组及专题信息查询
    $scope.GroupList = [];
    Exhibition.getGroupInfoByPath($scope.currentExbt.id).then(function (res) {
        _.each(res, function (r) {
            _.each(r.folder, function (t) {
                t.img_url = JSON.parse(t.img_url);
                t.property = JSON.parse(t.property);
            })
        })
        $scope.GroupList = res;
        $scope.getExCount();
        //登陆用户信息
        Exhibition.loginss().then(function (res) {
            $scope.wxuser = res;
        })
    })


    $scope.getExCount = function (bool) {
        let params = {
            unique_code: $stateParams.unicode
        };
        if (bool)
            params.kind = 1;
        Exhibition.getExcount(params).then(function (res) {      //会文件数据总量统计
            $scope.ExDataflow = res;
        })
    }


    //选中分组信息
    $scope.selectGroupFn = function (e, index, group) {
        group.gidx = index;
        group.hidden = Boolean(group.hidden);
        $timeout(function () {
            $scope.groupglobal = group;
        })
    }



    if ($scope.currentExbt.res_collect_lock == 1) {     //收集按钮是否选中
        $(".mui_collect").attr("checked", true);
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
            // Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "open"}).then(function (res) {
            Exhibition.getDirFilesByID({
                org_id: $scope.currentExbt.org_id,
                fullpath: $scope.currentExbt.res_collect//res.fullpath
            }, false).then(function (data) {
                console.log("返回所有的资料信息", data);
                $scope.collectLoading = false;
                $scope.collectList = data.list;
                $(".mui_collect").attr("checked", true);
                $scope.currentExbt.res_collect_lock = 1;
            })
            // });
        }
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
    //删除资料收集文件
    $scope.delCollectfile = function (event, path) {
        var that = $(event.currentTarget).parents("li").index();
        if (confirm("确定要删除该文件吗?")) {
            $scope.collectLoading = true;
            var params = {
                org_id: $scope.currentExbt.org_id,
                fullpath: path
            };
            Exhibition.delExFile(params).then(function (res) {
                $scope.collectList.splice(that, 1);
                $scope.collectLoading = false;
            })
        }

    };


    //手机模版  专题页面设置
    $scope.slideTopicFn = function (groindex, list) {
        $(".hosted-phones").slideUp(0, function () {
            $(".topic-page").animate({left: '0px'});
        });
        list.oldtitle = list.title;
        list.groupIdx = groindex;
        $scope.topDetails = list;
        $scope.topDetails.fileloading = true;
        $scope.topDetails.lists = [];
        $scope.topDetails.hidden = Boolean($scope.topDetails.hidden);
        Exhibition.getFileInfoByPath({
            ex_id: $scope.currentExbt.id,
            size: 1000,
            folder_id: list.id
        }).then(function (res) {
            _.each(res.data, function (m) {
                m.property = JSON.parse(m.property);
                $scope.topDetails.lists.push(m);
            })
            $scope.topDetails.fileloading = false;
        })
    }

    $scope.slideBakcFn = function () {
        $(".topic-page").animate({left: '320px'}, function () {
            $(".hosted-phones").show();
        });
    }



}

export default ExhibitionDetailController;