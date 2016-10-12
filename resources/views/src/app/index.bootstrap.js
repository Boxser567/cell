'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico';

// main App module
import "./index.module";
import "../assets/styles/sass/iconCollect.scss";
import "../assets/styles/sass/index.scss";
import "../assets/styles/sass/mobile.scss";
import "../assets/styles/sass/collection.scss";
import "angular-bootstrap-datetimepicker/src/scss/datetimepicker.scss";
import daterangepicker from 'bootstrap-daterangepicker/daterangepicker';



angular.element(document).ready(function () {
    angular.bootstrap(document, ['cell-ui', 'daterangepicker', 'ui.bootstrap.datetimepicker','angularSpinner', 'angular-md5', 'LocalStorageModule'], {
        strictDi: true
    });
});

