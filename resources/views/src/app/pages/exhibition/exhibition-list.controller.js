'use strict';

function ExhibitionListController($scope, Exhibition) {
    'ngInject';

    Exhibition.list().then(function (res) {
        console.debug("123123",res.data);
        $scope.exhibitions = res.data;
    })


    $scope.GetexState=function (a,b) {

        return "";
    }


}

export default ExhibitionListController;
