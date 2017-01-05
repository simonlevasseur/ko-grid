ko.bindingHandlers.nssgTbodyTr = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var gridVM = ko.unwrap(bindingContext.$component),
            cols = gridVM.columns;

        /************************/
        /**    DATA BINDING    **/
        /************************/
        ko.applyBindingsToNode(element, {
            foreach: {
                data: cols,
                as: 'col'
            }
        }, bindingContext);

        return { controlsDescendantBindings: true };
    }
};
