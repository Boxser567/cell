'use strict';

function ExhibitionDetailController($scope,$log,currentExhibition) {
	'ngInject';
	$scope.currentExhibition = currentExhibition;
	$log.debug('ExhibitionDetailController init');
}

export default ExhibitionDetailController;