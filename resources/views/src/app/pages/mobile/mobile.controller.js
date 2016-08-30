'use strict';

function MobileController($scope, currentMobileExbt, Exhibition) {
    'ngInject';
    console.log("二维码扫描进来", currentMobileExbt);
    $scope.EXfileList = currentMobileExbt;
    $scope.pageCode = window.location.href;
    console.log("123123123",);

    $scope.pageunicode = Util.String.baseName(currentMobileExbt.unique_code);


    var Loadlist = function (orgid) {
        Exhibition.getDirFilesByID({org_id: $scope.EXfileList.org_id, type: "mobile"}).then(function (data) {
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
            console.log($scope.DirsList);

        })
    }

    Loadlist($scope.orgid);


}

export default MobileController;
