'use strict';

function MobileViewsController($scope, currentPreview, $stateParams) {
    'ngInject';

    // $scope.dirName = $stateParams.path;

    console.log("预览信息", currentPreview);

    $scope.previewExbt = currentPreview.data;


}

export default MobileViewsController;