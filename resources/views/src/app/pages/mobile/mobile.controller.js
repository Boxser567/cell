'use strict';

function MobileController($scope, Exhibition) {
    'ngInject';


    // console.log(currentExhibition);
    Exhibition.m_getfileShow("2147483647").then(function (res) {
        $scope.EXfileList = res.data;
        $scope.orgid = res.data.org_id;
        Loadlist($scope.orgid);
        console.log("移动端数据列表", res);
    })


    var Loadlist = function (orgid) {
        Exhibition.getDirFilesByID({org_id: $scope.orgid, type: "mobile"}).then(function (data) {
            var files = [], dirs = [];
            _.each(data.data.list, function (list) {
                if (list.dir) {
                    Exhibition.m_getFileInfo({org_id: $scope.orgid, fullpath: list.fullpath}).then(function (resp) {
                        list.filecount = resp.data.file_count;
                        list.filesize = resp.data.filesize;
                        dirs.push(list);
                    });
                }
                else {
                    files.push(list);
                }
            })
            $scope.FilesList = files;
            $scope.DirsList = dirs;
        })
    }


}

export default MobileController;
