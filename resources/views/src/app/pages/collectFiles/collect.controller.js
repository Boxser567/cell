'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';

function CollectController($scope, currentExhibition) {
    'ngInject';
    console.log("会展信息", currentExhibition);
    $scope.ExbtMessage = currentExhibition;
    $scope.fileCollect = [];

    // $scope.KeyDown = function () {
    //     if ((window.event.altKey) &&
    //         ((window.event.keyCode == 37) || //屏蔽 Alt+ 方向键 ←
    //         (window.event.keyCode == 39))) { //屏蔽 Alt+ 方向键 →
    //         alert("不准你使用ALT+方向键前进或后退网页！");
    //         event.returnValue = false;
    //     }
    //
    //     if (event.keyCode == 116) { //屏蔽 F5 刷新键
    //         alert("禁止F5刷新网页！");
    //         event.keyCode = 0;
    //         event.returnValue = false;
    //     }
    //
    //     if ((event.ctrlKey) && (event.keyCode == 82)) { //屏蔽 Ctrl+R
    //         alert("禁止Ctrl+R刷新网页！");
    //         event.returnValue = false;
    //     }
    //
    //     if ((event.shiftKey) && (event.keyCode == 121)) { //屏蔽 shift+F10
    //         alert("禁止shift+F10刷新网页！");
    //         event.returnValue = false;
    //     }
    // };

}

export default CollectController;
