'use strict';

import  wx from 'weixin-js-sdk';
function config($logProvider, $sceProvider) {
    'ngInject';

    // Enable log
    $logProvider.debugEnabled(true);

    $sceProvider.enabled(false);

    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: (new Date()).valueOf(), // 必填，生成签名的时间戳
        nonceStr: 'cell' + (new Date()).valueOf(), // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1     //https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
        console.log("微信打印文件", arguments);
    });




}

export default config;
