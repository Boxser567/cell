'use strict';

export default function(app) {
	app
		.factory('Exhibition', ['$q',function($q) {
			var exhibitions;
			return {
				getById: function(id) {
					console.log('_',_);
					return {
						id: 1,
						name: '展会1'
					};
				},
				list: function() {
					let defered = $q.defer();
					exhibitions = [{
						id: 1,
						name: '展会1'
					}, {
						id: 2,
						name: '展会2'
					}];
					defered.resolve(exhibitions);
					return defered.promise;
				}
			}
		}]);
}