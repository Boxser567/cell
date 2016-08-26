'use strict';

import ZeroClipboard from "zeroclipboard/dist/ZeroClipboard";


function ExhibitionDetailController($scope, $stateParams, $timeout, currentExhibition,Exhibition) {
    'ngInject';


            console.log("返回详情数据",currentExhibition);
            // currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
           $scope.currentExbt = currentExhibition.data;
    var dataLoad = function () {
        Exhibition.getById(parseInt($stateParams.id)).then(function (data) {
            $scope.currentExbt = data.data;
        })
    }
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
        Exhibition.getDirFilesByID({org_id: $scope.currentExbt.org_id, fullpath: path}).then(function (res) {
            $timeout(function () {
                $scope.dirList = res.data.list;
            })
        });
    }


    $scope.getSize = function (num) {
        return Util.Number.bitSize(num);
    }

}

export default ExhibitionDetailController;