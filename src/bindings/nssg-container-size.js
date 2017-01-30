ko.bindingHandlers.nssgContainerSize = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        function updateSize() {
            var $element = $(element);
            var size = {width: $element.outerWidth(), height:$element.outerHeight()};
            var oldSize = valueAccessor()();
            if (!oldSize || oldSize.width !== size.width || oldSize.height !== size.height) {
                valueAccessor()(size);
            }
        }
        
        var throttledUpdate = throttle({callback: updateSize, frequency:100});
        
        $(window).on('resize', throttledUpdate);
        setTimeout(throttledUpdate,50);
        
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(window).off("resize", throttledUpdate);
        });
    }
};

