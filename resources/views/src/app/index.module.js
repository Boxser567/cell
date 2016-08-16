'use strict';

import * as components from './index.components';
import config from './index.config';
import run from './index.run';


const App = angular.module(
  "cell-ui", [
    // plugins
    require('angular-ui-router'),
    "ngTouch", 
	  "ngSanitize",
    // core
    require("./core/core.module").name,

    // components
    require("./index.components").name,

    // routes
    require("./index.routes").name,

    // pages
    require("./pages/main/main.module").name,

    require("./pages/exhibition/exhibition.module").name

  ]
);

App
  .config(config)
  .run(run);



export default App;
