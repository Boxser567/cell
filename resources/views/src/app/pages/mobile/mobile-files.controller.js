'use strict';

function MobileFilesController($scope, $stateParams, currentExhibition) {
    'ngInject';


    $scope.ExbtCurrent = currentExhibition.data;
    $scope.ExbtCurrent.dirName=$stateParams.path;
    console.log("列表文件",$stateParams, $scope.ExbtCurrent);

}

export default MobileFilesController;