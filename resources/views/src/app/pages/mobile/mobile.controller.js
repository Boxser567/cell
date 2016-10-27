'use strict';
// import  wx from "weixin-js-sdk";
function MobileController($scope, currentMobileExbt, $timeout, Exhibition) {
    'ngInject';
    $scope.EXfileList = currentMobileExbt;
    $scope.pageCode = window.location.href;
    $scope.pageunicode = Util.String.baseName(currentMobileExbt.unique_code);
    $scope.showMore = false;  //显示更多
    $scope.loading = true;  //初始化动画过度
    $scope.FilesList = [];  //常用文件集合

    //常用文件信息
    Exhibition.getFileInfoByPath({
        ex_id: currentMobileExbt.id,
        fullpath: currentMobileExbt.base_folder
    }).then(function (res) {
        $scope.loading = false;
        if (res.total > 4) {
            $scope.showMore = true;
        }
        for (var i = 0; i < res.data.length; i++) {
            res.data[i].property = JSON.parse(res.data[i].property);
        }
        console.log("信息显示", res);
        $scope.FilesList = res.data;
    })

    //专题信息
    Exhibition.getGroupInfoByPath(currentMobileExbt.id).then(function (res) {
        $scope.DirsList = res;
    });

    // $scope.showMoreFile=function () {
    //
    // }
    //
    // $scope.DirsList = [];
    // $scope.AllFileList = [], $scope.FilesList = [];
    // var files = [], dirs = [];
    // var Loadlist = function (orgid) {
    //     Exhibition.getDirFilesByID({
    //         org_id: currentMobileExbt.org_id,
    //         fullpath: currentMobileExbt.base_folder,
    //         type: "mobile"
    //     }).then(function (data) {
    //         $scope.loading = false;
    //         $scope.FilesList = data.list;
    //     })
    // }
    // var temp = currentMobileExbt.group;
    // _.each(temp, function (g) {
    //     g.allList = [];
    //     Exhibition.getGroupDetail(g.id).then(function (res) {
    //         _.each(res.folder, function (d) {
    //             d.img_url = JSON.parse(d.img_url);
    //             d.property = JSON.parse(d.property);
    //             g.allList.push(d);
    //         })
    //     })
    // })
    //
    //
    // $timeout(function () {
    //     $scope.DirsList = temp;
    //     console.log("$scope.DirsList", $scope.DirsList);
    // })
    //
    // Loadlist($scope.orgid);
    //
    // $scope.showCode = function () {
    //     $("#ModalCode").modal('show');
    // }
    //
    // $scope.showMoreFile = function () {
    //     $scope.FilesList = files;
    //     $scope.showMore = false;
    // }


    // var wx_timestamp = (new Date()).valueOf(),
    //     wx_nonceStr = 'Wsasic92kse023Jw3yUq',
    //     wx_appId = 'wxbb7e11d666642e02',
    //     wx_secret = 'c3eadea1899154610f9731d072c02fb6',
    // Exhibition.getWXToken().then(function (res) {
    //     console.log(res);
    // })

    // wx.ready(function () {
    //     wx.checkJsApi({
    //         jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'],
    //         fail: function (resp) {
    //             alert("微信版本不支持");
    //         }
    //     });
    //     wx.onMenuShareAppMessage({
    //         title: 'thistimeshare', // 分享标题
    //         link: 'www.baidu.com', // 分享链接
    //         desc: 'thistimeshare', // 分享描述
    //         imgUrl: 'http://res.meetingfile.com/5355c7cc82c964cf448058fe0e1e64772715805d.jpg-640', // 分享图标
    //         type: 'link', // 分享类型,music、video或link，不填默认为link
    //         success: function () {
    //             alert("确定分享成功123!");
    //         },
    //     });
    // });
    // wx.error(function (res) {
    //     console.log("微信打印错误消息", arguments);
    //     // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    // });


}

export default MobileController;
