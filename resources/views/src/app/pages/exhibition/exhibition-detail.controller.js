'use strict';


function ExhibitionDetailController($scope, $stateParams, $timeout, currentExhibition, Exhibition) {
    'ngInject';
    console.log("返回详情数据", $stateParams, currentExhibition);


    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $scope.orgid = currentExhibition.data.org_id;
    $scope.imgloading = false;
    Exhibition.getDirFilesByID({org_id: $scope.orgid}).then(function (data) {
        var files = [], dirs = [];
        _.each(data.data.list, function (list) {
            if (list.dir) {
                dirs.push(list);
            }
            else {
                files.push(list);
            }
        })
        $scope.FilesList = files;
        $scope.DirsList = dirs;
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
        var that = $(event.currentTarget);
        if (confirm("确定要删除该文件(夹)吗?")) {
            var params = {
                org_id: id,
                fullpath: path
            };
            Exhibition.delExFile(params).then(function (res) {
                $scope.currentExbt.property.file_count = Number($scope.currentExbt.property.file_count) - 1;
                $scope.currentExbt.property.size_use = Number($scope.currentExbt.property.size_use) - size;
                that.parents('.col-md-4').remove();
            })
        }
    }

    $scope.getDirList = function (path, hash) {
        $timeout(function () {
            $scope.thisDirPath = path;
            $scope.thisDirHash = hash;
        })

        $timeout(function () {
            $scope.dirList = [];
        })
        // $("#loadFileList").modal('show');
        Exhibition.getDirFilesByID({org_id: $scope.orgid, fullpath: path}).then(function (res) {
            console.log("加载列表信息", res);
            $timeout(function () {
                $scope.dirList = res.data.list;
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
                $timeout(function () {
                    Exhibition.getDirCountSize({hash: hash}).then(function (data) {

                        $scope.dirList[index].info = {
                            file_count: data.file_count,
                            file_size: data.file_size
                        }
                        $scope.currentExbt.property.file_count = Number($scope.currentExbt.property.file_count) - 1;
                        $scope.currentExbt.property.size_use = Number($scope.currentExbt.property.size_use) - filesize;
                        $scope.dirList.splice(index, 1);
                    });
                })
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


}

export default ExhibitionDetailController;