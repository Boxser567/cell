'use strict';

import 'bootstrap-sass/assets/javascripts/bootstrap';
import "angular-bootstrap-datetimepicker/src/js/datetimepicker";
import datetimepicker from  "angular-bootstrap-datetimepicker/src/js/datetimepicker.templates";

function ExhibitionDetailController($scope, $rootScope, $stateParams, $timeout, currentExhibition, Exhibition) {
    'ngInject';
    console.log("返回详情数据", $stateParams, currentExhibition);
    currentExhibition.data.property = JSON.parse(currentExhibition.data.property);
    $scope.currentExbt = currentExhibition.data;
    $rootScope.projectTitle = currentExhibition.data.title + " - 会文件";
    $scope.stateMode = true;


    moment.locale('zh-cn');
    $scope.endDateBeforeRender = endDateBeforeRender;
    $scope.endDateOnSetTime = endDateOnSetTime;
    $scope.startDateBeforeRender = startDateBeforeRender;
    $scope.startDateOnSetTime = startDateOnSetTime;

    function startDateOnSetTime() {
        $scope.$broadcast('start-date-changed');
    }

    function endDateOnSetTime() {
        $scope.$broadcast('end-date-changed');
    }

    function startDateBeforeRender($dates) {
        if ($scope.dateRangeEnd) {
            var activeDate = moment($scope.dateRangeEnd);
            $dates.filter(function (date) {
                return date.localDateValue() >= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
            $scope.dateRangeEnd = moment($scope.dateRangeEnd).format('YYYY-MM-DD HH:mm');
        }
    }

    function endDateBeforeRender($view, $dates) {
        if ($scope.dateRangeStart) {
            var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

            $dates.filter(function (date) {
                return date.localDateValue() <= activeDate.valueOf()
            }).forEach(function (date) {
                date.selectable = false;
            })
            $scope.dateRangeStart = moment($scope.dateRangeStart).format('YYYY-MM-DD HH:mm');
        }
    }


}

export default ExhibitionDetailController;