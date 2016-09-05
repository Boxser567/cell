'use strict';

function ExhibitionListController($scope, $state, Exhibition) {
    'ngInject';
    $scope.newMask = false;
    Exhibition.list().then(function (res) {

        var start = [], end = [];
        var date = new Date();
        _.each(res.data, function (d) {
            d.property = JSON.parse(d.property);
            var t = new Date(Date.parse(d.end_date.replace("-", "/")));
            t.setDate(t.getDate() + 1);
            if (t < date) {
                end.push(d);
            } else {
                start.push(d);
            }

        });
        $scope.start_ebts = start;
        $scope.end_ebts = end;

    });


    $scope.GetexState = function (a, b) {
        var date = new Date();
        var states = "";
        a = new Date(Date.parse(a.replace("-", "/")));
        b = new Date(Date.parse(b.replace("-", "/")));
        return "";
    }


    //创建一个新的会展页面
    $scope.createExbt = function () {
        $scope.newMask = true;
        Exhibition.createEx().then(function (res) {
            $state.go('main.exhibition-detail', {id: res.data.id});
        })
    }


}

export default ExhibitionListController;
