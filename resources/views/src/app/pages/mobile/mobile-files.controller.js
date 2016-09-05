'use strict';

function MobileFilesController($scope, $stateParams, currentMobileExbt, Exhibition) {
    'ngInject';

    $scope.loading = true;
    $scope.dirName = $stateParams.path;
    //$scope.dirlistCount = currentMobileExbt.data.count;
    Exhibition.getDirCountSize({hash: $stateParams.hash}).then(function (respon) {
        respon.img_url = JSON.parse(respon.img_url);
        $scope.dirInfo = respon;
        console.log("getDirCountSize", respon);

    })


    Exhibition.getDirFilesByID({org_id: currentMobileExbt.org_id, fullpath: $stateParams.path}).then(function (data) {
        console.debug("data", data);
        $scope.pageunicode = $stateParams.code;
        $scope.ExbtCurrent = data.list;
        $scope.loading = false;
    })


}

export default MobileFilesController;