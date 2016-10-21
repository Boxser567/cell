'use strict';

function ExhibitionListController($scope, $rootScope, $state, Exhibition, currentExhibition) {
    'ngInject';
    $scope.newMask = false;
    $rootScope.alertMsg = false;
    $scope.start_ebts = [];
    $scope.end_ebts = [];
    _.each(currentExhibition, function (e) {
        e.property = JSON.parse(e.property);
        if (e.finished === 1) {
            $scope.end_ebts.push(e);
        } else {
            $scope.start_ebts.push(e);
        }
    });

    //创建一个新的会展页面
    $scope.createExbt = function () {
        $scope.newMask = true;
        Exhibition.createEx().then(function (res) {
            var unicode = Util.String.baseName(res.data.unique_code);
            $state.go('main.exhibition-Editor', {unicode: unicode});
        })
    }

    Exhibition.loginss().then(function (res) {
        var user = {
            loginName: res.name,
            main_member: res.main_member,
            ent_id: res.ent_id
        };
        $("#inviteManager").prop("src", "/assistant/add?ent_id=" + res.ent_id);
        $scope.user = user;
    });

    //打开设置管理员信息
    $scope.setManagerFn = function () {
        $("#setManagerModal").modal('show');
        //获取管理员列表
        Exhibition.getAssistantList($scope.user.ent_id).then(function (res) {
            _.each(res, function (m) {
                if (m.main_member === 1) {
                    $scope.manager = m;
                } else {
                    $scope.magList.push(m);
                }
            })
        })
    }
    $scope.ExtralManagerFn=function () {
        $("#setManagerModal").modal('hide');
        $("#addmanagerModal").modal('show');
    }

    $scope.delManagerFn = function () {
        //删除管理员
        Exhibition.delAssistant($scope.user.ent_id).then(function (res) {
            for (var i = 0; i < $scope.magList.length; i++) {
                if ($scope.magList[i].id === $scope.user.ent_id) {
                    $timeout(function () {
                        $scope.magList.splice(i, 1);
                    })
                    break;
                }
            }
        })
    }

}

export default ExhibitionListController;
