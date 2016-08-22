'use strict';

function ExhibitionDetailController($scope, $log, currentExhibition) {
    'ngInject';
    $scope.currentExhibition = currentExhibition;




    $scope.copyHttp = function (e) {
        // var client = new ZeroClipboard($("#copyme"));
        // client.on("ready", function (readyEvent) {
        //     // alert( "ZeroClipboard SWF is ready!" );
        //
        //     client.on("aftercopy", function (event) {
        //         event.target.style.display = "none";
        //         alert("Copied text to clipboard: " + event.data["text/plain"]);
        //     });
        // });

    }
    $log.debug('ExhibitionDetailController init');
}

export default ExhibitionDetailController;