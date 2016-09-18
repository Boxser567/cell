'use strict';

function MobileController($scope, currentMobileExbt, Exhibition) {
    'ngInject';
    $scope.EXfileList = currentMobileExbt;
    $scope.pageCode = window.location.href;
    $scope.pageunicode = Util.String.baseName(currentMobileExbt.unique_code);
    $scope.showMore = false;
    $scope.loading = true;
    $scope.AllFileList = [], $scope.FilesList = [];
    var files = [], dirs = [];
    var Loadlist = function (orgid) {
        Exhibition.getDirFilesByID({org_id: currentMobileExbt.org_id, type: "mobile"}).then(function (data) {
            console.log('data', data);
            _.each(data.list, function (list) {
                if (list.dir) {
                    dirs.push(list);
                }
                else {
                    list.filename = Util.String.parseName(list.filename);
                    files.push(list);
                }
            })
            if (files.length > 4) {
                for (var i = 0; i < 4; i++) {
                    $scope.AllFileList.push(files[i]);
                }
                $scope.showMore = true;
                $scope.FilesList = $scope.AllFileList;
            } else {
                $scope.FilesList = files;
            }
            $scope.loading = false;
            $scope.DirsList = dirs;
            console.log($scope.DirsList);
        })
    }

    Loadlist($scope.orgid);

    $scope.showCode = function () {
        $("#ModalCode").modal('show');
    }

    $scope.showMoreFile = function () {
        $scope.FilesList = files;
        $scope.showMore = false;
    }
    // $scope.showLessFile = function () {
    //     $scope.FilesList = $scope.AllFileList;
    //     $scope.showMore = true;
    // }


    // var wx_timestamp = (new Date()).valueOf(),
    //     wx_nonceStr = 'Wsasic92kse023Jw3yUq',
    //     wx_appId = 'wxbb7e11d666642e02',
    //     wx_secret = 'c3eadea1899154610f9731d072c02fb6',
    //     wx_token = Exhibition.getWXToken({
    //         grant_type: 'client_credential',
    //         appid: wx_appId,
    //         secret: wx_secret
    //     });
    // console.log("微信打印文件token", wx_token);

    // wx.config({
    //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId: 'wxbb7e11d666642e02', // 必填，公众号的唯一标识
    //     timestamp: wx_timestamp, // 必填，生成签名的时间戳
    //     nonceStr: wx_nonceStr, // 必填，生成签名的随机串
    //     signature: '',// 必填，签名，见附录1     //https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=peHq5czJfl3TMtZofksG6V8SxuyT9u4&type=jsapi
    //     jsApiList: ['onMenuShareAppMessage', 'previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // });
    // wx.ready(function () {
    //     console.log("微信打印文件", arguments);
    // });


}

export default MobileController;
