ko.bindingHandlers.nssgTd = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var NAMESPACE = 'nssgTd',
            col = valueAccessor(),
            gridVM = ko.unwrap(bindingContext.$component),
            $td = $(element);

        /***************************/
        /**    COLUMN TEMPLATE    **/
        /***************************/
        $td
            .addClass('nssg-td-' + col.type)
            .append(templates[col.type]);
    }
};
