'use strict';

import dialogTpl from './../../pages/ngDialog/alertDialog.html';

export default function (app) {
    app
        .constant('ROUTE_ERRORS', {
            auth: 'Authorization has been denied.',
        })
        .constant('FILE_SORTS', {
            'SORT_PDF': ['pdf'],
            'SORT_PPT': ['pot', 'pptx', 'ppt', 'pps', 'potm', 'potx', 'ppsm', 'ppsx', 'pptm'],
            'SORT_IMG': ['png'],
            'SORT_PHOTO': ['jpg', 'jpeg', 'gif', 'bmp'],
            'SORT_DOCUMENT': ['doc', 'docx', 'dot', 'dotm'],
            'SORT_OTHERDOC': ['txt', 'rtf', 'gknote', 'md', 'odt', 'ods', 'odp'],
            'SORT_TABLE': ['xls', 'xlt', 'xlw', 'xlsb', 'xlsm', 'xlsx', 'xltm', 'xltm'],
            'SORT_DRAW': ['psd', 'ai', 'dwg', 'dxf'],
            'SORT_AUDIO': ['wav', 'aac', 'm4a', 'mp3', 'flac', 'ape'],
            'SORT_VIDEO': ['mp4', 'mov', 'avi', 'rmvb', 'mpg', 'mkv', '3gp'],
            'SORT_COMMON': ['exe', 'rar', 'zip', 'cmd']
            //'SORT_EXE': ['exe', 'bat', 'com']
        })
        .factory('$warning', ['$timeout', function ($timeout) {
            var msg = "更新成功";
            return function (text) {
                if (text) {
                    msg = text
                }
                let ani = $("#operate-warn").find("span");
                ani.text(msg);
                ani.fadeIn();
                $timeout(function () {
                    ani.fadeOut();
                }, 1500)
            };
        }])


        .factory('$popupDialog', ['$uibModal', '$document', function ($uibModal, $document) {
            return {
                alertDialog: function (warning, title) {
                    if (!warning) return;
                    var option = {
                        templateUrl: dialogTpl,
                        windowClass: 'alert_dialog',
                        controller: function ($scope, $uibModalInstance) {
                            console.log("showDialog显示显示显示");
                            $scope.message = warning;
                            $scope.title = title;
                            $scope.ok = function () {
                                $uibModalInstance.close();
                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    };
                    option = angular.extend({}, {backdrop: 'static', animation: false}, option);
                    return $uibModal.open(option);
                }
            }
        }])

}
