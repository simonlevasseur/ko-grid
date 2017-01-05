ko.bindingHandlers.nssgTbody = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var gridVM = ko.unwrap(bindingContext.$component),
            itemsOnCurrentPage = gridVM.pager.itemsOnCurrentPage;

        /************************/
        /**     DATA BINDING   **/
        /************************/
        ko.applyBindingsToNode(element, {
            foreach: {
                data: itemsOnCurrentPage,
                as: 'row'
            }
        }, bindingContext);

        return { controlsDescendantBindings: true };
    }
};
