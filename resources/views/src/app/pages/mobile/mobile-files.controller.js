'use strict';

function MobileFilesController($scope, $stateParams, currentMobileExbt, Exhibition) {
    'ngInject';


    $scope.dirName = $stateParams.path;
    //$scope.dirlistCount = currentMobileExbt.data.count;
    Exhibition.getDirCountSize({hash: $stateParams.hash}).then(function (respon) {
        console.log("getDirCountSize", respon);
        respon.img_url = JSON.parse(respon.img_url);
        $scope.dirInfo = respon;
    })


    Exhibition.getDirFilesByID({org_id: currentMobileExbt.org_id, fullpath: $stateParams.path}).then(function (data) {
        console.debug("data", data);
        $scope.pageunicode = $stateParams.code;
        $scope.ExbtCurrent = data.data;

    })


}

export default MobileFilesController;