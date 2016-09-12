'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';

function CollectController($scope, currentExhibition) {
    'ngInject';
    console.log("会展信息", currentExhibition);
    $scope.ExbtMessage = currentExhibition;
    $scope.fileCollect = [];

    $scope.$wa


}

export default CollectController;
