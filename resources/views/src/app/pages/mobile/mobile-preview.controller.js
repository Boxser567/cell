'use strict';

function MobileViewsController($scope, $stateParams, currentMobileExbt, Exhibition) {
    'ngInject';

    $scope.dirName = $stateParams.path;

    Exhibition.m_getFileInfo({org_id: currentMobileExbt.org_id, fullpath: $stateParams.path}).then(function (res) {
        console.log("文件预览详情页面", res.data);
        $scope.previewExbt = res.data;


        console.debug("src", $scope.previewExbt.preview);


    })


}

export default MobileViewsController;