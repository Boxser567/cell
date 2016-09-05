'use strict';

function MobileController($scope, currentMobileExbt, Exhibition) {
    'ngInject';
    $scope.EXfileList = currentMobileExbt;
    $scope.pageCode = window.location.href;
    $scope.pageunicode = Util.String.baseName(currentMobileExbt.unique_code);
    $scope.showMore = false;
    $scope.loading = true;
    $scope.AllFileList = [], $scope.FilesList = [];
    var files = [], dirs = [];
    var Loadlist = function (orgid) {
        Exhibition.getDirFilesByID({org_id: currentMobileExbt.org_id, type: "mobile"}).then(function (data) {
            _.each(data.data.list, function (list) {
                if (list.dir) {
                    list.info.img_url = JSON.parse(list.info.img_url);
                    dirs.push(list);
                }
                else {
                    files.push(list);
                }
            })
            if (files.length > 3) {
                $scope.showMore = true;
                for (var i = 0; i < 3; i++) {
                    $scope.AllFileList.push(files[i]);
                }
                $scope.FilesList = $scope.AllFileList;
            } else {
                $scope.FilesList = files;
            }
            $scope.loading = false;
            $scope.DirsList = dirs;
            console.log($scope.DirsList);
        })
    }

    Loadlist($scope.orgid);

    $scope.showCode = function () {
        $("#ModalCode").modal('show');
    }

    $scope.showMoreFile = function () {
        $scope.FilesList = files;
        $scope.showMore = false;
    }
    $scope.showLessFile = function () {
        $scope.FilesList = $scope.AllFileList;
        $scope.showMore = true;
    }

}

export default MobileController;
