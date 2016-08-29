'use strict';

import ZeroClipboard from "zeroclipboard/dist/ZeroClipboard";


function ExhibitionDetailController($scope, $stateParams, $timeout, currentExhibition, Exhibition) {
    'ngInject';


    console.log("返回详情数据", currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $scope.orgid = currentExhibition.data.org_id;

    var dataLoad = function () {
        Exhibition.getDirFilesByID({org_id: $scope.orgid}).then(function (data) {
            var files = [], dirs = [];
            _.each(data.data.list, function (list) {
                if (list.dir) {
                    // Exhibition.m_getFileInfo({org_id: $scope.orgid, fullpath: list.fullpath}).then(function (resp) {
                    //     list.filecount = resp.data.file_count;
                    //     list.filesize = resp.data.filesize;
                    // });
                    dirs.push(list);
                }
                else {
                    files.push(list);
                }
            })
            $scope.FilesList = files;
            $scope.DirsList = dirs;
        })
    }

    dataLoad();
    $scope.imgloading = false;


    $scope.copyHttp = function () {
        var client = new ZeroClipboard($("#copyme"));
        console.log(client);
        client.on("ready", function (readyEvent) {
            console.log(readyEvent);
            client.on("aftercopy", function (event) {
                console.log(event);
                event.target.style.display = "none";
                alert("Copied text to clipboard: " + event.data["text/plain"]);
            });
        });
    }

    $scope.addFolder = function (id) {
        var _name = $.trim($(".txt_dirname").val());
        if (_name == "") {
            alert("请输入新建文件夹名称");
            return;
        }
        Exhibition.addFolder({org_id: id, fullpath: _name}).then(function (r) {
            console.log(r);
            $("#modalAddDir").modal("hide");
            dataLoad();
            $(".txt_dirname").val("");
        });
    }
    $scope.delFile = function (id, path) {
        if (confirm("确定要删除该文件(夹)吗?")) {
            var params = {
                org_id: id,
                fullpath: path
            };
            Exhibition.delExFile(params).then(function (res) {
                console.log(res);
                dataLoad();
            })
        }
    }

    $scope.getDirList = function (path) {
        $scope.thisDirPath = path;
        $timeout(function () {
            $scope.dirList = [];
        })
        $("#loadFileList").modal('show');
        Exhibition.getDirFilesByID({org_id: $scope.orgid, fullpath: path}).then(function (res) {
            console.log("加载列表信息", res);
            $timeout(function () {
                $scope.dirList = res.data.list;
            })
        });
    }
    $scope.delDirFiles = function (id, filename) {
        var dir = $scope.thisDirPath;
        if (confirm("确定要删除该文件吗?")) {
            var params = {
                org_id: id,
                fullpath: dir + "/" + filename
            };
            console.log("参数", params);
            Exhibition.delExFile(params).then(function (res) {
                console.log(res);
                dataLoad();
            })
        }
    }


    $scope.getSize = function (num) {
        return Util.Number.bitSize(num);
    }

}

export default ExhibitionDetailController;