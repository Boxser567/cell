'use strict';

function ExhibitionListController($scope, $rootScope, $state, $location, $timeout, Exhibition, currentExhibition) {
    'ngInject';


    $rootScope.projectTitle = "会文件";
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
        $scope.magList = [];
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


    $scope.ExtralManagerFn = function () {
        $("#setManagerModal").modal('hide');
        $("#addmanagerModal").modal('show');
    }


    $scope.delManagerFn = function (idx, manger) {
        console.log(manger);
        if (confirm("删除后, 该用户将无法再通过其微信号登录管理会文件。\n 是否确认删除?")) {
            //删除协同管理员
            Exhibition.delAssistant(manger.id).then(function (res) {
                $timeout(function () {
                    $scope.magList.splice(idx, 1);
                })
            })
        }
    }

    //注销
    $scope.register = function () {
        if (confirm("注销后页面将跳转到登陆界面")) {
            Exhibition.logout().then(function () {
                window.location.href = 'http://' + $location.host() + '/admin';
            })
        }
    }


}

export default ExhibitionListController;
