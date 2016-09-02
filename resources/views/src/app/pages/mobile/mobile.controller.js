'use strict';

function MobileController($scope, currentMobileExbt, Exhibition) {
    'ngInject';

    $scope.EXfileList = currentMobileExbt;
    $scope.pageCode = window.location.href;
    $scope.pageunicode = Util.String.baseName(currentMobileExbt.unique_code);


    var Loadlist = function (orgid) {
        Exhibition.getDirFilesByID({org_id: $scope.EXfileList.org_id, type: "mobile"}).then(function (data) {
            var files = [], dirs = [];
            _.each(data.data.list, function (list) {
                if (list.dir) {
                    list.info.img_url = JSON.parse(list.info.img_url);
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

    $scope.showCode=function () {
        $("#ModalCode").modal('show');
    }



}

export default MobileController;
