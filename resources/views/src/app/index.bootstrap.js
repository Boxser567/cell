'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico';

// main App module
import "./index.module";
import "../assets/styles/sass/iconCollect.scss";
import "../assets/styles/sass/index.scss";
import "../assets/styles/sass/mobile.scss";
// import "../../bower_components/eonasdan-bootstrap-datetimepicker/src/sass/bootstrap-datetimepicker-build.scss";

angular.element(document).ready(function () {
    angular.bootstrap(document, ['cell-ui'], {
        strictDi: true
    });
});
