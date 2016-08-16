'use strict';

import cellHeaderDirective from './cell-header.directive';
import './cell-header.scss';

const cellHeaderModule = angular.module('cell-header-module', []);

cellHeaderModule
  .directive('cellHeader', cellHeaderDirective);

export default cellHeaderModule;
