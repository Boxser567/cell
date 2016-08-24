'use strict';

import ZeroClipboard from "zeroclipboard/dist/ZeroClipboard"

function ExhibitionDetailController($scope, $stateParams, Exhibition) {
    'ngInject';
    var dataLoad = function () {
        Exhibition.getById($stateParams.id).then(function (data) {
            console.log(data.data);
            data.data.property = JSON.parse(data.data.property);
            $scope.currentExbt = data.data;
        });
    }
    dataLoad();


    $scope.getboard = function () {
        // main.js
        var client = new ZeroClipboard(document.getElementById("copy-button"));

        client.on("ready", function (readyEvent) {
            // alert( "ZeroClipboard SWF is ready!" );

            client.on("aftercopy", function (event) {
                // `this` === `client`
                // `event.target` === the element that was clicked
                event.target.style.display = "none";
                alert("Copied text to clipboard: " + event.data["text/plain"]);
            });
        });
    },

        $scope.addFolder = function (id) {
            Exhibition.addFolder(id).then(function (r) {
                console.log(r);
                dataLoad();
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
            })
        }
    }


    $scope.getSize = function (num) {
        return Util.Number.bitSize(num);
    }

}

export default ExhibitionDetailController;