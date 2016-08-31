'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico';

// main App module
import "./index.module";
import "../assets/styles/sass/iconCollect.scss";
import "../assets/styles/sass/index.scss";
import "../assets/styles/sass/mobile.scss";
import "angular-bootstrap-datetimepicker/src/scss/datetimepicker.scss";


angular.element(document).ready(function () {
    angular.bootstrap(document, ['cell-ui'], {
        strictDi: true
    });
});

