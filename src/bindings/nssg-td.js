ko.bindingHandlers.nssgTd = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var col = valueAccessor();
        var $td = $(element);

        ko.unwrap(bindingContext.$component);

        /***************************/
        /**    COLUMN TEMPLATE    **/
        /***************************/
        $td
            .addClass('nssg-td-' + col.type)
            .append(templates[col.type]);
    }
};
