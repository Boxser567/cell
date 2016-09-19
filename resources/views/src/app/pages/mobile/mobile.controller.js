'use strict';
import  wx from "weixin-js-sdk";
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
    $scope.shareFn = function () {

    }

    // $scope.showLessFile = function () {
    //     $scope.FilesList = $scope.AllFileList;
    //     $scope.showMore = true;
    // }


    // var wx_timestamp = (new Date()).valueOf(),
    //     wx_nonceStr = 'Wsasic92kse023Jw3yUq',
    //     wx_appId = 'wxbb7e11d666642e02',
    //     wx_secret = 'c3eadea1899154610f9731d072c02fb6',
    Exhibition.getWXToken().then(function (resp) {
        console.log("resp", resp);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: resp.appId, // 必填，公众号的唯一标识
            timestamp: resp.timestamp, // 必填，生成签名的时间戳
            nonceStr: resp.nonceStr, // 必填，生成签名的随机串
            signature: resp.signature,// 必填，签名，见附录1     //https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=peHq5czJfl3TMtZofksG6V8SxuyT9u4&type=jsapi
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','getNetworkType','openLocation','getLocation','hideOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','closeWindow','scanQRCode','chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function () {
            wx.checkJsApi({
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','getNetworkType','openLocation','getLocation','hideOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','closeWindow','scanQRCode','chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard'],
                fail: function (resp) {
                    alert("微信版本不支持");
                }
            });

            wx.onMenuShareAppMessage({
                title: '够快测试标题分享', // 分享标题
                link: 'www.baidu.com', // 分享链接
                desc: '够快测试标题分享', // 分享描述
                imgUrl: 'http://res.meetingfile.com/5355c7cc82c964cf448058fe0e1e64772715805d.jpg-640', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                success: function () {
                    alert("确定分享成功!");
                },
            });
            wx.onMenuShareTimeline({
                title: '够快测试标题分享', // 分享标题
                link: 'www.baidu.com', // 分享链接
                success: function () {
                    alert("确定分享成功!");
                },
            });

        });
        wx.error(function (res) {
            console.log("微信打印错误消息", arguments);
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

        });


    })
    // console.log("wx_token", wx_;ltoken);


}

export default MobileController;
