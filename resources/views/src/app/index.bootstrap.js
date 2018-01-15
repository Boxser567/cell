'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico';

// main App module
import "./index.module";
import "angular-ui-bootstrap/dist/ui-bootstrap-csp.css";
import "../assets/styles/sass/iconCollect.scss";
import "../assets/styles/sass/index.scss";
import "../assets/styles/sass/mobile.scss";
import "../assets/styles/sass/collection.scss";
import "../assets/styles/sass/uploader.scss";
import  "angular-dragdrop/src/angular-dragdrop";
import "angular-bootstrap-datetimepicker/src/scss/datetimepicker.scss";
import daterangepicker from 'bootstrap-daterangepicker/daterangepicker';
import "webuploader/examples/cropper/cropper";
import "moment/locale/zh-cn";
import "angular-dragdrop/src/angular-dragdrop";


angular.element(document).ready(function () {
    moment().locale('zh-cn');
    angular.bootstrap(document, ['cell-ui', 'ngDragDrop', 'daterangepicker', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'angularSpinner', 'angular-md5', 'LocalStorageModule'], {
        strictDi: true
    });
});

