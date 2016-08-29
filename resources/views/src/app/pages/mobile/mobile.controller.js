'use strict';

function MobileController($scope, currentMobileExbt, Exhibition) {
    'ngInject';
    console.log("二维码扫描进来", currentMobileExbt);
    $scope.EXfileList = currentMobileExbt;
    var Loadlist = function (orgid) {
        Exhibition.getDirFilesByID({org_id: $scope.EXfileList.org_id, type: "mobile"}).then(function (data) {
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

    Loadlist($scope.orgid);


}

export default MobileController;
