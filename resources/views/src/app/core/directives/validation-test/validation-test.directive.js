'use strict';

export default function (app) {

    app.directive('validationTest', validationTestDirective);

    app.directive('hoverTrans', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $(elem).hover(function () {
                    // $(elem).parents('.trans').css("transform", "rotateY(180deg)");
                    // $(elem).parents('.trans').find(".thumcode").css("z-index", "11");
                })

            },


        };
    });
    app.directive('editName', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $(elem).click(function () {
                    var name = $(elem).text();
                    var input = '<input type="text" class="exhibitionName" value="' + name + '" />';
                    $(elem).empty().append(input);
                    $(elem).find('input').focus().select();
                    $(elem).find('input').blur(function () {
                        var text = $(this).val();
                        console.log(text);
                        if (text.trim() == "") {
                            $(elem).empty().text(name);
                        } else {
                            $(elem).empty().text(text);
                        }
                    })
                })

            },


        };
    });
    app.directive('filesortAdd', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $(elem).click(function () {
                    var htm = '<div class="col-md-4">'
                        + '<div class="files">'
                        + '<p class="title"><span>请填写分类名称</span> <i class="glyphicon glyphicon-trash"><span>删除</span></i>'
                        + '</p>'
                        + '<p class="size"> 0个文件 共 0 MB</p>'
                        + '<a class="btn-showfile">查看/上传文件</a>'
                        + '</div>'
                        + '</div>';
                    var index = $(elem).parents('.col-md-4').before(htm);
                })
            },
        };
    });
    function validationTestDirective() {
        'ngInject';

        return {
            restrict: 'A',
            link: linkFn,
            require: 'ngModel'
        };

        function linkFn(scope, elem, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newVal) {
                if (newVal === 'test') {
                    ngModelCtrl.$setValidity('test', true);
                } else {
                    ngModelCtrl.$setValidity('test', false);
                }
            });
        }
    }
}