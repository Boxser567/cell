'use strict';

function ExhibitionDetailController($scope, $stateParams, Exhibition) {
    'ngInject';
    Exhibition.getById($stateParams.id).then(function (data) {
        console.log(data.data);
        data.data.property=JSON.parse(data.data.property);
        $scope.currentExbt = data.data;
    });

}

export default ExhibitionDetailController;