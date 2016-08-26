'use strict';

function MobileController($scope, Exhibition) {
    'ngInject';


    Exhibition.m_getfileShow("2147483647").then(function (res) {
        $scope.EXfileList = res.data;
        console.log(res);
    })

}

export default MobileController;
