'use strict';
(function (angular) {
    // function isDnDsSupported() {
    //     return 'ondrag' in document.createElement('a');
    // }
    //
    // if (!isDnDsSupported()) {
    //     angular.module('cell.dragAndDrop', []);
    //     return;
    // }
    //
    // if (window.jQuery && (-1 === window.jQuery.event.props.indexOf('dataTransfer'))) {
    //     window.jQuery.event.props.push('dataTransfer');
    // }

    var currentData;

    angular.module('cell.lgDragAndDrop', [])
        .directive('lgDraggable', [
            '$parse',
            '$rootScope',
            '$dragImage',
            '$timeout',
            function ($parse, $rootScope, $dragImage, $timeout) {
                'ngInject';

                return function (scope, element, attrs) {
                    var isDragHandleUsed = false,
                        dragHandleClass,
                        draggingClass = attrs.draggingClass || 'on-dragging',
                        dragTarget;
                    element.attr('draggable', false);

                    attrs.$observe('lgDraggable', function (newValue) {
                        if (newValue) {
                            element.attr('draggable', newValue);
                        }
                        else {
                            element.removeAttr('draggable');
                        }

                    });

                    if (angular.isString(attrs.dragHandleClass)) {
                        isDragHandleUsed = true;
                        dragHandleClass = attrs.dragHandleClass.trim() || 'drag-handle';

                        element.bind('mousedown', function (e) {
                            dragTarget = e.target;
                        });
                    }

                    function dragendHandler(e) {
                        console.log("拖结束了");
                        setTimeout(function () {
                            element.unbind('$destroy', dragendHandler);
                        }, 0);
                        var sendChannel = attrs.dragChannel || 'defaultchannel';
                        $rootScope.$broadcast('ANGULAR_DRAG_END', sendChannel);
                        if (e.dataTransfer && e.dataTransfer.dropEffect !== 'none') {
                            if (attrs.lgOnDropSuccess) {
                                var fn = $parse(attrs.lgOnDropSuccess);
                                scope.$evalAsync(function () {
                                    fn(scope, {$event: e});
                                });
                            }
                        }
                        else {
                            if (attrs.lgOnDropFailure) {
                                var fn = $parse(attrs.lgOnDropFailure);
                                scope.$evalAsync(function () {
                                    fn(scope, {$event: e});
                                });
                            }
                        }
                        element.removeClass(draggingClass);
                    }

                    function dragstartHandler(e) {

                        console.log("随便开始拖");


                        var isDragAllowed = !isDragHandleUsed || dragTarget.classList.contains(dragHandleClass);
                        if (isDragAllowed) {
                            var sendChannel = attrs.dragChannel || 'defaultchannel';
                            var dragData = '';
                            if (attrs.drag) {
                                dragData = scope.$eval(attrs.drag);
                            }
                            e.dataTransfer.setDragImage(e.target, 0, 0);
                            var sendData = angular.toJson({data: dragData, channel: sendChannel});
                            var dragImage = attrs.dragImage || null;

                            var fn = $parse(attrs.lgOnDragStart);
                            scope.$evalAsync(function () {
                                fn(scope, {$event: e, $channel: sendChannel});
                            });
                            element.addClass(draggingClass);
                            element.bind('$destroy', dragendHandler);

                            if (dragImage) {
                                var dragImageFn = $parse(attrs.dragImage);
                                scope.$apply(function () {
                                    var dragImageParameters = dragImageFn(scope, {$event: e});
                                    if (dragImageParameters) {
                                        if (angular.isString(dragImageParameters)) {
                                            dragImageParameters = $dragImage.generate(dragImageParameters);
                                        }
                                        if (dragImageParameters.image) {
                                            var xOffset = dragImageParameters.xOffset || 0,
                                                yOffset = dragImageParameters.yOffset || 0;
                                            e.dataTransfer.setDragImage(dragImageParameters.image, xOffset, yOffset);
                                        }
                                    }
                                });
                            }

//							           e.dataTransfer.setData('dataToSend', sendData);
                            currentData = angular.fromJson(sendData);
                            e.dataTransfer.effectAllowed = 'copyMove';
                            $rootScope.$broadcast('ANGULAR_DRAG_START', sendChannel, currentData.data);
                        }
                        else {
                            e.preventDefault();
                        }
                    }

                    $timeout(function () {
                        $(element).bind('dragend', dragendHandler);
                        $(element).bind('dragstart', dragstartHandler);
                    })

                };
            }
        ])
        .directive('lgOnDrop', [
            '$parse',
            '$rootScope',
            function ($parse, $rootScope) {
                return function (scope, element, attrs) {
                    var dragging = 0; //Ref. http://stackoverflow.com/a/10906204
                    var dropChannel = attrs.dropChannel || 'defaultchannel';
                    var dragChannel = '';
                    var dragEnterClass = attrs.dragEnterClass || 'on-drag-enter';
                    var dragHoverClass = attrs.dragHoverClass || 'on-drag-hover';
                    var customDragEnterEvent = $parse(attrs.lgOnDragEnter);
                    var customDragLeaveEvent = $parse(attrs.lgOnDragLeave);

                    function onDragOver(e) {
                        if (e.preventDefault) {
                            e.preventDefault(); // Necessary. Allows us to drop.
                        }

                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }

                        var fn = $parse(attrs.lgOnDragOver);
                        scope.$evalAsync(function () {
                            fn(scope, {$event: e, $channel: dropChannel});
                        });

                        e.dataTransfer.dropEffect = e.shiftKey ? 'copy' : 'move';
                        return false;
                    }

                    function onDragLeave(e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }

                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        dragging--;

                        if (dragging === 0) {
                            scope.$evalAsync(function () {
                                customDragEnterEvent(scope, {$event: e});
                            });
                            element.removeClass(dragHoverClass);
                        }

                        var fn = $parse(attrs.lgOnDragLeave);
                        scope.$evalAsync(function () {
                            fn(scope, {$event: e, $channel: dropChannel});
                        });
                    }

                    function onDragEnter(e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }

                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        dragging++;

                        var fn = $parse(attrs.lgOnDragEnter);
                        scope.$evalAsync(function () {
                            fn(scope, {$event: e, $channel: dropChannel});
                        });
                        //var customDragEnterEvent = $parse(attrs.lgOnDragEnter);
                        //var customDragLeaveEvent = $parse(attrs.lgOnDragLeave);
                        $rootScope.$broadcast('ANGULAR_HOVER', dragChannel);
                        scope.$evalAsync(function () {
                            customDragLeaveEvent(scope, {$event: e});
                        });
                        element.addClass(dragHoverClass);
                    }

                    function onDrop(e) {
                        if (e.preventDefault) {
                            e.preventDefault(); // Necessary. Allows us to drop.
                        }
                        if (e.stopPropagation) {
                            e.stopPropagation(); // Necessary. Allows us to drop.
                        }

//						           var sendData = e.dataTransfer.getData('dataToSend');
//						           sendData = angular.fromJson(sendData);

                        var fn = $parse(attrs.lgOnDrop);
                        scope.$evalAsync(function () {
//							           fn(scope, {$data: sendData.data, $event: e, $channel: sendData.channel});
                            fn(scope, {$event: e});
                        });
                        element.removeClass(dragEnterClass);
                        dragging = 0;
                    }

                    function isDragChannelAccepted(dragChannel, dropChannel) {
                        if (dropChannel === '*') {
                            return true;
                        }

                        var channelMatchPattern = new RegExp('(\\s|[,])+(' + dragChannel + ')(\\s|[,])+', 'i');

                        return channelMatchPattern.test(',' + dropChannel + ',');
                    }

                    function preventNativeDnD(e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        e.dataTransfer.dropEffect = 'none';
                        return false;
                    }

                    var deregisterDragStart = $rootScope.$on('ANGULAR_DRAG_START', function (event, channel) {
                        dragChannel = channel;
                        if (isDragChannelAccepted(channel, dropChannel)) {
                            if (attrs.dropValidate) {
                                var validateFn = $parse(attrs.dropValidate);
                                var valid = validateFn(scope, {
                                    $data: currentData.data,
                                    $channel: currentData.channel
                                });
                                if (!valid) {
                                    element.bind('dragover', preventNativeDnD);
                                    element.bind('dragenter', preventNativeDnD);
                                    element.bind('dragleave', preventNativeDnD);
                                    element.bind('drop', preventNativeDnD);
                                    return;
                                }
                            }

                            element.bind('dragover', onDragOver);
                            element.bind('dragenter', onDragEnter);
                            element.bind('dragleave', onDragLeave);

                            element.bind('drop', onDrop);
                            element.addClass(dragEnterClass);
                        }
                        else {
                            element.bind('dragover', preventNativeDnD);
                            element.bind('dragenter', preventNativeDnD);
                            element.bind('dragleave', preventNativeDnD);
                            element.bind('drop', preventNativeDnD);
                        }

                    });


                    var deregisterDragEnd = $rootScope.$on('ANGULAR_DRAG_END', function (e, channel) {
                        dragChannel = '';
                        if (isDragChannelAccepted(channel, dropChannel)) {

                            element.unbind('dragover', onDragOver);
                            element.unbind('dragenter', onDragEnter);
                            element.unbind('dragleave', onDragLeave);

                            element.unbind('drop', onDrop);
                            element.removeClass(dragHoverClass);
                            element.removeClass(dragEnterClass);
                        }

                        element.unbind('dragover', preventNativeDnD);
                        element.unbind('dragenter', preventNativeDnD);
                        element.unbind('dragleave', preventNativeDnD);
                        element.unbind('drop', preventNativeDnD);
                    });


                    var deregisterDragHover = $rootScope.$on('ANGULAR_HOVER', function (e, channel) {
                        if (isDragChannelAccepted(channel, dropChannel)) {
                            element.removeClass(dragHoverClass);
                        }
                    });


                    scope.$on('$destroy', function () {
                        deregisterDragStart();
                        deregisterDragEnd();
                        deregisterDragHover();
                    });


                    attrs.$observe('dropChannel', function (value) {
                        if (value) {
                            dropChannel = value;
                        }
                    });


                };
            }
        ])
        .constant('$dragImageConfig', {
            height: 20,
            width: 200,
            padding: 10,
            font: 'bold 11px Arial',
            fontColor: '#eee8d5',
            backgroundColor: '#93a1a1',
            xOffset: 0,
            yOffset: 0
        })
        .service('$dragImage', [
            '$dragImageConfig',
            function (defaultConfig) {
                var ELLIPSIS = '…';

                function fitString(canvas, text, config) {
                    var width = canvas.measureText(text).width;
                    if (width < config.width) {
                        return text;
                    }
                    while (width + config.padding > config.width) {
                        text = text.substring(0, text.length - 1);
                        width = canvas.measureText(text + ELLIPSIS).width;
                    }
                    return text + ELLIPSIS;
                }

                this.generate = function (text, options) {
                    var config = angular.extend({}, defaultConfig, options || {});
                    var el = document.createElement('canvas');

                    el.height = config.height;
                    el.width = config.width;

                    var canvas = el.getContext('2d');

                    canvas.fillStyle = config.backgroundColor;
                    canvas.fillRect(0, 0, config.width, config.height);
                    canvas.font = config.font;
                    canvas.fillStyle = config.fontColor;

                    var title = fitString(canvas, text, config);
                    canvas.fillText(title, 4, config.padding + 4);

                    var image = new Image();
                    image.src = el.toDataURL();

                    return {
                        image: image,
                        xOffset: config.xOffset,
                        yOffset: config.yOffset
                    };
                };
            }
        ]);

}(angular));
