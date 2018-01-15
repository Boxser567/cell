'use strict';

function MobileDragController($scope, $timeout) {
    'ngInject';
    $scope.list = [
        {'title': 'L', 'drag': true},
        {'title': 'O', 'drag': true},
        {'title': 'M', 'drag': true},
        {'title': 'L', 'drag': true},
        {'title': 'G', 'drag': true},
        {'title': 'U', 'drag': true}
    ];

    $scope.onItemStart=function () {
        console.log("wanht")
    }

    $scope.dropCallback = function (event, title, $index) {
        if ($scope.list1.map(function (item) {
                return item.title;
            }).join('') === 'GOLLUM') {
            $scope.list1.forEach(function (value, key) {
                $scope.list1[key].drag = false;
            });
        }
    };

    $scope.dropCallback = function () {

    }

    $scope.list2 = {};


}

export default MobileDragController;