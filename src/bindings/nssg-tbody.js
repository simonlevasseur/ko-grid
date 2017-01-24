ko.bindingHandlers.nssgTbody = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var gridVM = ko.unwrap(bindingContext.$component);

        /************************/
        /**     DATA BINDING   **/
        /************************/
        ko.applyBindingsToNode(element, {
            foreach: {
                data: gridVM.data().data,
                as: 'row'
            }
        }, bindingContext);

        return { controlsDescendantBindings: true };
    }
};
