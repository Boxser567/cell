'use strict';

function ExhibitionListController($scope,Exhibition) {
  'ngInject';

 	 Exhibition.list().then(function(data){
  	$scope.exhibitions = data;
  })

}

export default ExhibitionListController;
