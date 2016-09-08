'use strict';


function ExhibitionDetailController($scope, $rootScope, $stateParams, $timeout, currentExhibition, Exhibition) {
    'ngInject';
    console.log("返回详情数据", $stateParams, currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
    $scope.orgid = currentExhibition.data.org_id;
    $scope.imgloading = false;
    $scope.FilesList = [];
    $scope.DirsList = [];
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
        console.log();
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
    }


    $scope.fileChooser = function () {
        $timeout(function () {
            $scope.exportFilename = "file";
            $scope.thisDirPath = false;
            $scope.thisDirHash = false;
        })

    }
}

export default ExhibitionDetailController;