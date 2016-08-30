'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico';

// main App module
import "./index.module";
import "../assets/styles/sass/iconCollect.scss";
import "../assets/styles/sass/index.scss";
import "../assets/styles/sass/mobile.scss";

angular.element(document).ready(function () {
    angular.bootstrap(document, ['cell-ui'], {
        strictDi: true
    });
});

//import "../../node_modules/eonasdan-bootstrap-datetimepicker/src/sass/_bootstrap-datetimepicker.scss";
