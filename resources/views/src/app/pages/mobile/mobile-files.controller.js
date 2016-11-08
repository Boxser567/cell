'use strict';

function MobileFilesController($scope, $stateParams, currentMobileExbt, Exhibition) {
    'ngInject';
    console.log("currentMobileExbt123123", $stateParams, currentMobileExbt);
    $scope.loading = true;
    currentMobileExbt.img_url = JSON.parse(currentMobileExbt.img_url);
    $scope.topicInfo = currentMobileExbt;

    Exhibition.getFileInfoByPath({
        ex_id: $stateParams.ex_id,
        size: 1000,
        folder_id: currentMobileExbt.id
    }).then(function (res) {
        _.each(res.data, function (t) {
            t.property = JSON.parse(t.property);
        })
        $scope.topicList = res.data;
        $scope.loading = false;
    })
}

export default MobileFilesController;