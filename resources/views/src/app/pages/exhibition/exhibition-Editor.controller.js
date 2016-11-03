'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';
import "angular-bootstrap-datetimepicker/src/js/datetimepicker";
import datetimepicker from  "angular-bootstrap-datetimepicker/src/js/datetimepicker.templates";

function ExhibitionDetailController($scope, $rootScope, $window, $stateParams, $timeout, currentExhibition, Exhibition) {
    'ngInject';
    console.log("返回详情数据", currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
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
            r.property.title = Util.String.baseName(r.property.title);
        })
        $scope.FilesList = file.data;
        console.log("常用文件信息", $scope.FilesList);
    });


    // 以下代码用于调整页面布局
    $scope.mobilesize = {
        top: "20px",
        left: "120px"
    }
    $window.onresize = function () {
        var $height = $window.innerHeight - 580;
        //最低高度760px     //最高处理950px  相差190px
        $height = ($height - 70) / 2;
        if (0 < $height < 200) {
            $scope.$apply(function () {
                $scope.mobilesize.top = $height + "px";
            })
        } else {
            $scope.$apply(function () {
                $scope.mobilesize.top = "120px";
            })
        }
    }


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
    })
    //添加新专题
    $scope.addProjectFn = function (group, index) {
        for (let d = 0; d < group.folder.length; d++) {
            if (group.folder[d].title == "请填写专题名称") {
                alert("请先给原始专题命名!");
                return false;
                break;
            }
        }
        group.folder_loding = true;
        Exhibition.addFolder({
            org_id: $scope.currentExbt.org_id,
            group_id: group.id,
            fullpath: "请填写专题名称"
        }).then(function (data) {
            data.property = JSON.parse(data.property);
            data.img_url = JSON.parse(data.img_url);
            $timeout(function () {
                $scope.GroupList[index].folder.push(data);
                group.folder_loding = false;
            })
        });
    }

    //选中分组信息
    $scope.selectGroupFn = function (e, index, group) {
        console.log("分组信息", group);
        $(".slide-note").find(".grouping").show().siblings().hide();
        $timeout(function () {
            $scope.dateRangeStart = group.start_time;
            $scope.dateRangeEnd = group.end_time;
            $(".group-time").val(group.forever);
            $(".mui_group").prop("checked", Boolean(group.hidden));
            group.gidx = index;
            $scope.groupglobal = group;
        })
    }
    //分组信息删除
    $scope.delGroupFn = function () {
        if (confirm("确定要删除当前分组吗? \n 删除后,该分组内的专题及文件都将不可查看!")) {
            Exhibition.delGroupInfo($scope.groupglobal.id).then(function (res) {
                $(".slide-note").find(".defaults").show().siblings().hide();
                $timeout(function () {
                    $scope.GroupList.splice($scope.groupglobal.gidx, 1);
                })
            })
        }
    }
    //分组信息修改--是否隐藏
    $scope.editGroupOfferFn = function () {
        var flag = Number(!Boolean($scope.groupglobal.hidden));
        Exhibition.editGroupInfo({
            group_id: $scope.groupglobal.id,
            hidden: flag
        }).then(function (res) {
            $scope.groupglobal.hidden = flag;
            $(".mui_group").prop("checked", !Boolean($scope.groupglobal.hidden));
        })
    }

    //显示上传文件弹出窗口
    $scope.fileChooser = function () {
        $("#uploadFileModal").modal('show');
        $scope.uploadstate = "files";
    }
    $scope.topicChooser = function () {
        $("#uploadFileModal").modal('show');
        $scope.uploadstate = "topic";
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
        _.each($scope.dataCollectList, function (r) {
            if (r.selects) {
                params.files.push({
                    filename: r.filename,
                    hash: r.filehash,
                    size: r.filesize
                });
            }
        });
        if ($scope.uploadstate == "files") {
            Exhibition.copyFilFromHad(params).then(function (res) {
                $scope.btnloading = false;
                _.each(res, function (r) {
                    r.property = JSON.parse(r.property);
                    $scope.FilesList.push(r);
                })
                $("#fileFromCollect").modal('hide');
            })
        }
        if ($scope.uploadstate == "topic") {
            params.folder_id = $scope.topDetails.id;
            Exhibition.copyFilFromHad(params).then(function (res) {
                $scope.btnloading = false;
                _.each(res, function (r) {
                    r.property = JSON.parse(r.property);
                    $scope.topDetails.lists.push(r);
                })
                $("#fileFromCollect").modal('hide');
            })
        }

    };


    $scope.delFileFn = function () {        //删除常用文件
        if (confirm("确定要删除该文件吗?")) {
            if ($scope.uploadstate == "files") {
                Exhibition.delFileinfo({
                    org_id: $scope.currentExbt.org_id,
                    file_id: $scope.fileglobal.id
                }).then(function (res) {
                    $(".slide-note").find(".defaults").show().siblings().hide();
                    $timeout(function () {
                        $scope.FilesList.splice($scope.fileglobal.Indexer, 1);
                    })
                })
            }
            if ($scope.uploadstate == "topic") {
                Exhibition.delFileinfo({
                    org_id: $scope.currentExbt.org_id,
                    file_id: $scope.fileglobal.id,
                    hash: $scope.topDetails.folder_hash,
                    folder_title: $scope.topDetails.title
                }).then(function (res) {
                    $(".slide-note").find(".topic_con").show().siblings().hide();
                    $timeout(function () {
                        $scope.topDetails.lists.splice($scope.fileglobal.Indexer, 1);
                    })
                })
            }
        }
    }
    $scope.delTopicFn = function () { //删除专题

        Exhibition.delExFile({
            org_id: $scope.currentExbt.org_id,
            fullpath: $scope.topDetails.title,
            is_dir: "1",
            hash: $scope.topDetails.folder_hash
        }).then(function (res) {
            $scope.slideBakcFn();

            var listfolder = $scope.GroupList[$scope.groupIndex].folder;
            for (let i = 0; i < listfolder.length; i++) {
                if (listfolder[i].id == $scope.topDetails.id) {
                    $scope.GroupList[$scope.groupIndex].folder.splice(i, 1);
                }
            }
        })

    }


    if ($scope.currentExbt.res_collect_lock == 1) {     //收集按钮是否选中
        $(".mui_collect").attr("checked", true);
    }

    //选中常用文件
    $scope.selectFileFn = function (e, index, file) {
        $(e.currentTarget).addClass("active").parent().siblings().find("a").removeClass("active");
        $(".slide-note").find(".filemask").show().siblings().hide();
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


    //手机模版  专题页面设置
    $scope.slideTopicFn = function (groindex, list) {
        $scope.groupIndex = groindex;
        $(".hosted-phones").slideUp(0, function () {
            $(".topic-page").animate({left: '0px'});
        });
        $(".slide-note").find(".topic_con").show().siblings().hide();
        list.oldtitle = list.title;
        $scope.topDetails = list;
        $scope.topDetails.fileloading = true;
        $scope.topDetails.lists = [];
        $scope.uploadstate = "topic";
        $(".mui-topic").prop("checked", Boolean($scope.topDetails.hidden));
        $(".topic-time").val($scope.topDetails.forever);
        Exhibition.getFileInfoByPath({
            ex_id: $scope.currentExbt.id,
            size: 200,
            folder_id: list.id
        }).then(function (res) {
            _.each(res.data, function (m) {
                m.property = JSON.parse(m.property);
                $scope.topDetails.lists.push(m);
                console.log("topDetails123", $scope.topDetails)

            })
            $scope.topDetails.fileloading = false;
        })
    }

    $scope.slideBakcFn = function () {
        $(".topic-page").animate({left: '320px'}, function () {
            $(".hosted-phones").show();
        });
        $(".slide-note").find(".defaults").show().siblings().hide();
        $scope.uploadstate = "files";
    }
    //切换到专题设置
    $scope.setTopicFn = function () {
        $(".slide-note").find(".topic_con").show().siblings().hide();
    }

    //修改专题隐藏
    $scope.topicIsHideFn = function () {
        var len = Number(!Boolean($scope.topDetails.hidden));
        Exhibition.editTopicDetail({hash: $scope.topDetails.folder_hash, hidden: len}).then(function (res) {
            $scope.topDetails.hidden = len;
        })
    }

    //删除专题图片
    $scope.delTopicImgFn = function () {
        Exhibition.updateTopicImg({
            hash: $scope.topDetails.folder_hash,
            img_url: $scope.topDetails.img_url[0],
            type: 0
        }).then(function (res) {
            $scope.topDetails.img_url.shift();
        })
    }


}

export default ExhibitionDetailController;