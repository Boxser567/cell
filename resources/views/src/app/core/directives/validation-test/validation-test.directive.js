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