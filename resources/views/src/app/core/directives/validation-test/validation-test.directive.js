'use strict';

export default function (app) {

    app.directive('validationTest', validationTestDirective);

    app.directive('hoverTrans', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, $timeout) {
                $(elem).on("mouseenter", function () {
                    // $timeout(function () {
                    $(elem).parents('.trans').find(".thumcode").css("z-index", "11").show();
                    $(elem).parents('.trans').css("transform", "rotateY(180deg)");
                    // })
                })
            },


        };
    });
    app.directive('codeLeave', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {
                $(elem).mouseout(function () {
                    $(elem).css("z-index", "1").hide();
                    $(elem).parent('.trans').css("transform", "rotateY(0deg)");
                })

            },


        };
    });

    app.directive('editName', function (Exhibition) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
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
                            if (attrs.dataedit == "title") {
                                Exhibition.editExTitle({exhibition_id: attrs.dataid, title: text}).then(function (res) {
                                    $(elem).empty().text(text);
                                })
                            }
                            if (attrs.dataedit == "filename") {
                                Exhibition.editExFilename({
                                    org_id: attrs.dataid,
                                    fullpath: attrs.datapath,
                                    newpath: text
                                }).then(function (res) {
                                    $(elem).empty().text(text);
                                })
                            }
                            if (attrs.dataedit == "dirname") {
                                Exhibition.editExDirname({
                                    org_id: attrs.dataid,
                                    fullpath: attrs.datapath,
                                    newpath: text
                                }).then(function (res) {
                                    console.log(res);
                                    $(elem).empty().text(text);
                                })
                            }


                        }
                    })
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