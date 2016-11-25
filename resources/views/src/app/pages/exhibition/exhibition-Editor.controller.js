'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';
import "angular-bootstrap-datetimepicker/src/js/datetimepicker";
import datetimepicker from  "angular-bootstrap-datetimepicker/src/js/datetimepicker.templates";
// import datetimepicker from "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min";


function ExhibitionDetailController($scope, $rootScope, $window, $stateParams, $timeout, currentExhibition, $location, Exhibition, $warning) {
    'ngInject';
    console.log("返回详情数据", currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
    $scope.collectLoading = true;       //资料收集
    $scope.siteHost = $location.host() + '/admin';
    $scope.collectUrl = "http://" + $location.host() + "/mobile/#/collect/" + $stateParams.unicode + "";
    //logo上传加载
    $scope.imgloading = false;
    $scope.stateMode = true;
    $scope.fileloading = true;//常用文件的加载
    $scope.localFilesJSON = [];   //用于缓存正在上传文件信息
    $scope.uploadstate = "files";
    $scope.selectArray = [{
        name: '永久有效',
        value: 1
    }, {
        name: '自定义时间',
        value: 0
    }];

    //常用文件的获取
    $scope.FilesList = [];
    Exhibition.getFileInfoByPath({
        ex_id: $scope.currentExbt.id,
        fullpath: $scope.currentExbt.base_folder,
        size: 200
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

    $scope.ExDataflow = {
        space: 0,

    }
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
                ++$scope.ExDataflow['class'];
                $scope.GroupList[index].folder.push(data);
                group.folder_loding = false;
            })
        });
    }

    $scope.dateRange = {};
    $scope.topicDate = {};

    //选中分组信息
    $scope.selectGroupFn = function (e, index, group) {
        $(".slide-note").find(".grouping").show().siblings().hide();
        // $(".mui_group").prop("checked", Boolean(group.hidden));
        group.gidx = index;
        group.hidden = Boolean(group.hidden);
        $scope.groSelectTime = group.forever;
        group.IsShow = group.forever;
        console.log("groupglobal", group);
        $scope.dateRange.start = group.start_time == null ? "" : group.start_time;
        $scope.dateRange.end = group.end_time == null ? "" : group.end_time;
        $timeout(function () {
            $scope.groupglobal = group;
        })
    }


    $scope.endDateBeforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate, states) {
        if (states == "topic") {
            if ($scope.topicDate.start) {
                var activeDate = moment($scope.topicDate.start).subtract(1, $view).add(1, 'minute');
                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        } else {
            if ($scope.dateRange.start) {
                var activeDate = moment($scope.dateRange.start).subtract(1, $view).add(1, 'minute');
                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
    }
    $scope.endDateOnSetTime = function (newDate, oldDate, states) {
        if (states == "topic") {
        } else {
        }
    }


    $scope.startDateBeforeRender = function ($dates, states) {
        if (states == "topic") {
            if ($scope.topicDate.end) {
                var activeDate = moment($scope.topicDate.end);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        } else {
            if ($scope.dateRange.end) {
                var activeDate = moment($scope.dateRange.end);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }
        }
    }
    $scope.startDateOnSetTime = function (newDate, oldDate, states) {
        if (states == "topic") {
            // $scope.$broadcast('topic-start-changed');
        } else {
            // $scope.$broadcast('start-date-changed');
        }
    }


    //分组信息删除
    $scope.delGroupFn = function () {
        if (confirm("确定要删除当前分组吗? \n 删除后,该分组内的专题及文件都将不可查看!")) {
            Exhibition.delGroupInfo($scope.groupglobal.id).then(function (res) {
                $(".slide-note").find(".defaults").show().siblings().hide();
                $timeout(function () {
                    $scope.getExCount(true);
                    $scope.GroupList.splice($scope.groupglobal.gidx, 1);
                })
            })
        }
    }

    //分组信息修改--时间
    $scope.editGroupTimeFn = function () {
        if ($scope.dateRange.start && $scope.dateRange.start.length && $scope.dateRange.end && $scope.dateRange.end.length) {
            Exhibition.editGroupInfo({
                group_id: $scope.groupglobal.id,
                forever: 0,
                start_time: $scope.dateRange.start,
                end_time: $scope.dateRange.end
            }).then(function (res) {
                $scope.groupglobal.IsShow = 0;
                $scope.GroupList[$scope.groupglobal.gidx].forever = 0;
                $scope.GroupList[$scope.groupglobal.gidx].start_time = $scope.dateRange.start;
                $scope.GroupList[$scope.groupglobal.gidx].end_time = $scope.dateRange.end;
                console.log($scope.groupglobal, "时间修改信息", $scope.GroupList);
            })
        } else {
            alert("请将正确输入分组有效时间!");
        }
    }

    //分组信息修改-- 时间限制切换
    $scope.changeGroTimeFn = function () {
        if ($scope.groSelectTime == 1) {
            Exhibition.editGroupInfo({
                group_id: $scope.groupglobal.id,
                forever: 1,
                start_time: '',
                end_time: ''
            }).then(function (res) {
                $timeout(function () {
                    $scope.groupglobal.start_time = null;
                    $scope.groupglobal.end_time = null;
                    $scope.groupglobal.forever = 1;
                    $warning("");
                })

            })
        }
    }

    //分组信息修改--是否隐藏
    $scope.editGroupOfferFn = function () {
        var flag = Number($scope.groupglobal.hidden);
        console.log("是否隐藏的值", flag);
        Exhibition.editGroupInfo({
            group_id: $scope.groupglobal.id,
            hidden: flag
        }).then(function (res) {
            $scope.groupglobal.hidden = Boolean(flag);
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


    //单个文件选中
    $scope.oneSelectFn = function (list, types) {
        $scope.collectArray = [];
        if (types == 'exist') {
            $scope.collectArray = $scope.dataExsitList;
        } else {
            $scope.collectArray = $scope.dataCollectList;
        }
        if (list.selects) {
            if ($scope.collectArray.selectAll) {
                $timeout(function () {
                    $scope.collectArray.selectAll = false;
                })
            }
        } else {
            let ck = true;
            _.each($scope.collectArray, function (f) {
                if (f.filehash != list.filehash) {
                    if (f.selects) {
                        ck = true;
                    }
                }
            })
            $scope.collectArray.selectAll = ck;
        }
        list.selects = !list.selects;
    }


    //收集资料全选事件
    $scope.ckb_selectFn = function (list) {
        if (list.selectAll) {
            $timeout(function () {
                _.each(list, function (ck) {
                    ck.selects = true;
                })
            })
        } else {
            $timeout(function () {
                _.each(list, function (ck) {
                    ck.selects = false;
                })
            })
        }
    };

    //收集资料全选----添加选中文件
    $scope.addSelectFile = function (list, collected) {
        console.log("选中的文件信息", list)
        $scope.btnloading = true;
        var params = {
            org_id: $scope.currentExbt.org_id,
            ex_id: $scope.currentExbt.id,
            files: []
        };
        var totalSize = 0, count = 0;
        if (collected === 'exist') {
            params.type = 0;
            _.each(list, function (r) {
                if (r.selects) {
                    ++count;
                    totalSize += Number(r.size);
                    params.files.push({
                        filename: r.property.title,
                        hash: r.hash,
                        size: r.size
                    });
                }
            });
        }

        if (collected === 'collect') {
            _.each(list, function (r) {
                if (r.selects) {
                    ++count;
                    totalSize += Number(r.filesize);
                    params.files.push({
                        filename: r.filename,
                        hash: r.filehash,
                        size: r.filesize
                    });
                }
            });
        }
        if ($scope.uploadstate == "files") {
            Exhibition.copyFilFromHad(params).then(function (res) {
                $scope.btnloading = false;
                $scope.ExDataflow.space += Number(totalSize);
                _.each(res, function (r) {
                    r.property = JSON.parse(r.property);
                    $scope.FilesList.push(r);
                })
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
                $scope.ExDataflow.space += Number(totalSize);
                $scope.topDetails.file_count += count;
                $scope.topicDetails.file_size += Number(totalSize);
            })
        }
        $("#fileFromCollect").modal('hide');
        $("#fileFromExist").modal('hide');
        $scope.btnloading = false;
    };


    $scope.delFileFn = function () {        //删除常用文件
        if (confirm("确定要删除该文件吗?")) {
            var params = {
                org_id: $scope.currentExbt.org_id,
                file_id: $scope.fileglobal.id
            }
            if ($scope.uploadstate == "files") {
                Exhibition.delFileinfo(params).then(function (res) {
                    $(".slide-note").find(".defaults").show().siblings().hide();
                    $timeout(function () {
                        $scope.ExDataflow.space -= $scope.fileglobal.size;
                        $scope.FilesList.splice($scope.fileglobal.Indexer, 1);
                    })
                })
            }
            if ($scope.uploadstate == "topic") {
                params.hash = $scope.topDetails.folder_hash;
                params.folder_id = $scope.topDetails.id;
                console.log($scope.topDetails.lists, "专题文件删除", params);
                Exhibition.delFileinfo(params).then(function (res) {
                    $(".slide-note").find(".topic_con").show().siblings().hide();
                    $timeout(function () {
                        $scope.ExDataflow.space -= $scope.fileglobal.size;
                        --$scope.topDetails.file_count;
                        $scope.topDetails.file_size -= $scope.fileglobal.size;
                        $scope.topDetails.lists.splice($scope.fileglobal.Indexer, 1);
                    })
                })
            }
        }
    }

    //文件预览
    $scope.filePreviewFn = function () {
        Exhibition.m_getFileInfo({
            org_id: $scope.currentExbt.org_id,
            hash: $scope.fileglobal.hash
        }).then(function (res) {
            console.log("预览的信息", res);
            window.open('' + res.data.preview + '', "_target");
        })
    }

    $scope.delTopicFn = function () { //删除专题
        if (confirm("确定要删除吗? \n 删除后,该专题及内部文件都将不可查看!")) {
            Exhibition.delExFile({
                org_id: $scope.currentExbt.org_id,
                fullpath: $scope.topDetails.title,
                is_dir: "1",
                hash: $scope.topDetails.folder_hash
            }).then(function (res) {
                --$scope.ExDataflow['class'];
                $scope.slideBakcFn();
                var listfolder = $scope.GroupList[$scope.topDetails.groupIdx].folder;
                for (let i = 0; i < listfolder.length; i++) {
                    if (listfolder[i].id == $scope.topDetails.id) {
                        $scope.GroupList[$scope.topDetails.groupIdx].folder.splice(i, 1);
                    }
                }
            })
        }
    }


    if ($scope.currentExbt.res_collect_lock == 1) {     //收集按钮是否选中
        $(".mui_collect").attr("checked", true);
    }

    //选中常用文件
    $scope.selectFileFn = function (e, index, file, type) {
        if ($scope.uploadstate == "files")
            _.each($scope.FilesList, function (r) {
                r.classActive = false;
            })
        if ($scope.uploadstate == "topic")
            _.each($scope.topDetails.lists, function (r) {
                r.classActive = false;
            })
        $(".slide-note").find(".filemask").show().siblings().hide();
        file.Indexer = index;
        file.classActive = true;    //用于控制激活的类
        file.loadStatus = false;
        file.oldTitle = file.property.title;
        $scope.fileglobal = file;
        $scope.uploadstate = type;
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
        if (Util.RegExp.Date.test(time.startDate) || Util.RegExp.Date.test(time.endDate)) {
            $scope.date.startDate = $scope.currentExbt.start_date;
            $scope.date.endDate = $scope.currentExbt.end_date;
        } else {
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
                        $warning("站点时间修改成功!");
                    })
                }
            }
        }
    }, false);


    //资料收集状态
    $scope.checkCollecFn = function () {
        var va = $(".mui_collect").val();
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
                    fullpath: $scope.currentExbt.res_collect//res.fullpath
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
    $scope.collectList = [];
    $scope.openCollection = function () {
        $("#msgCollectFile").modal('show');
        Exhibition.openCollection({exhibition_id: $scope.currentExbt.id, action: "open"}).then(function (res) {
            $("#openCollectFile").modal('hide');
            $scope.collectLoading = false;
            $timeout(function () {
                $scope.currentExbt.res_collect_lock = 1;
                $(".mui_collect").prop("checked", true);
            })
            // Exhibition.getDirFilesByID({
            //     org_id: $scope.currentExbt.org_id,
            //     fullpath: res.fullpath
            // }, false).then(function (data) {
            //     $scope.collectLoading = false;
            //     $scope.collectList = data.list;
            //     $timeout(function () {
            //         $scope.currentExbt.res_collect_lock = 1;
            //         $(".mui_collect").prop("checked", true);
            //     })
            // })

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
        $(".hosted-phones").slideUp(0, function () {
            $(".topic-page").animate({left: '0px'});
        });
        $(".slide-note").find(".topic_con").show().siblings().hide();
        list.oldtitle = list.title;
        list.groupIdx = groindex;
        $scope.topicSelectTime = list.forever;
        list.IsShow = list.forever;
        $scope.topDetails = list;
        $scope.topDetails.fileloading = true;
        $scope.topDetails.lists = [];
        $scope.uploadstate = "topic";
        $scope.topDetails.hidden = Boolean($scope.topDetails.hidden);
        $scope.topicDate.start = list.start_time == null ? '' : list.start_time;
        $scope.topicDate.end = list.end_time == null ? '' : list.end_time;
        console.log("选中的专题信息", $scope.topDetails);
        Exhibition.getFileInfoByPath({
            ex_id: $scope.currentExbt.id,
            size: 1000,
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

    //专题时间修改
    $scope.editTopicTimeFn = function () {
        // console.log($scope.topDetails, "专题时间修改", $scope.topicDate);
        if ($scope.topicDate.start && $scope.topicDate.start.length && $scope.topicDate.end && $scope.topicDate.start.length) {
            Exhibition.editTopicDetail({
                hash: $scope.topDetails.folder_hash,
                forever: 0,
                start_time: $scope.topicDate.start,
                end_time: $scope.topicDate.end
            }).then(function (res) {
                $timeout(function () {
                    $scope.topDetails.forever = 0;
                    $scope.topDetails.start_time = $scope.topicDate.start;
                    $scope.topDetails.end_time = $scope.topicDate.end;
                    $scope.topicSelectTime = 0;
                    $warning("");
                })

                // let group = $scope.GroupList[$scope.topDetails.groupIdx].folder;
                // for (let g = 0; g < group.length; g++) {
                //     if ($scope.GroupList[$scope.topDetails.groupIdx].folder[g].id == $scope.topDetails.id) {
                //         $scope.GroupList[$scope.topDetails.groupIdx].folder[g].start_time = $scope.topicDate.start;
                //         $scope.GroupList[$scope.topDetails.groupIdx].folder[g].end_time = $scope.topicDate.end;
                //     }
                // }
            })
        }
    }

    //修改专题隐藏
    $scope.topicIsHideFn = function () {
        var len = Number(Boolean($scope.topDetails.hidden));
        Exhibition.editTopicDetail({hash: $scope.topDetails.folder_hash, hidden: len}).then(function (res) {
            $scope.topDetails.hidden = Boolean($scope.topDetails.hidden);
        })
    }

    //专题时间切换
    $scope.changeTopicTimeFn = function () {
        if ($scope.topicSelectTime == 1) {
            Exhibition.editTopicDetail({
                hash: $scope.topDetails.folder_hash,
                forever: 1,
                start_time: null,
                end_time: null
            }).then(function (res) {
                $timeout(function () {
                    $scope.topDetails.forever = 1;
                    $scope.topDetails.start_time = null;
                    $scope.topDetails.end_time = null;
                    $warning("专题时间修改成功!");
                })
            })
        }
    }

    //删除专题图片
    $scope.delTopicImgFn = function () {
        if ($scope.topDetails.img_url.length > 1) {
            $scope.del_img_loading = true;
            Exhibition.updateTopicImg({
                hash: $scope.topDetails.folder_hash,
                img_url: $scope.topDetails.img_url[0],
                type: 0
            }).then(function (res) {
                $scope.del_img_loading = false;
                $scope.topDetails.img_url.shift();
            })
        }
    }

    //专题内部文件数据更新
    $scope.updateLocalTpoicSize = function (rb_cFile) {
        let group = $scope.GroupList[$scope.topDetails.groupIdx].folder;
        for (let g = 0; g < group.length; g++) {
            if ($scope.GroupList[$scope.topDetails.groupIdx].folder[g].id == $scope.topDetails.id) {
                if (rb_cFile.stateBase === "add") {
                    ++$scope.topDetails.file_count;
                    $scope.topDetails.file_size += rb_cFile.size;
                    //++$scope.GroupList[$scope.topDetails.groupIdx].folder[g].file_count;
                    //$scope.GroupList[$scope.topDetails.groupIdx].folder[g].file_size += rb_cFile.size;
                }
                if (rb_cFile.stateBase === "del") {
                    --$scope.topDetails.file_count;
                    $scope.topDetails.file_size -= rb_cFile.size;
                    //--$scope.GroupList[$scope.topDetails.groupIdx].folder[g].file_count;
                    //$scope.GroupList[$scope.topDetails.groupIdx].folder[g].file_size -= rb_cFile.size;
                }
            }
        }
    }


    //删除正在上传的文件
    $scope.delUploaderFile = function (backFile) {
        if (backFile)
            $timeout(function () {
                backFile.loadStatus = true;
            })
    }
    //删除上传出错文件
    $scope.delErrorFileFn = function (errFile) {
        console.log(errFile, $scope.FilesList);
        if (errFile.indexID) {
            for (let e = 0; e < $scope.FilesList.length; e++) {
                if ($scope.FilesList[e].indexID == errFile.indexID) {
                    $scope.FilesList.splice(e, 1);
                    break;
                }
            }
        }
    }


}

export default ExhibitionDetailController;