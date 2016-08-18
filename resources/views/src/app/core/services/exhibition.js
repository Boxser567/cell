'use strict';

export default function (app) {
    app
        .factory('Exhibition', ['$q', function ($q) {
            var exhibitions;
            return {
                getById: function (id) {
                    console.log('_', _);
                    return {
                        id: 1,
                        name: '展会1'
                    };
                },
                list: function () {
                    let defered = $q.defer();
                    exhibitions = [];
                    for (var i = 0; i < 5; i++) {
                        exhibitions.push({id:i});
                    }
                    defered.resolve(exhibitions);
                    return defered.promise;
                }
            }
        }]);
}