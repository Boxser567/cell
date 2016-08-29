'use strict';

function MobileFilesController($scope, $stateParams, currentMobileExbt, Exhibition) {
    'ngInject';


    $scope.dirName = $stateParams.path;
    Exhibition.getDirFilesByID({org_id: currentMobileExbt.org_id, fullpath: $stateParams.path}).then(function (data) {
        console.debug("data",data);
        $scope.ExbtCurrent = data.data;
    })


}

export default MobileFilesController;