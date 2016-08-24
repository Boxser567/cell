'use strict';

import cellHeaderTpl from './cell-header.html';

function cellHeaderComponent($log) {
	'ngInject';

  var directive = {
    restrict: 'E',
    templateUrl: cellHeaderTpl,
    controller: cellHeaderController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function cellHeaderController () {
	  // $log.debug('Hello from footer controller!');
  }

}

export default cellHeaderComponent;
