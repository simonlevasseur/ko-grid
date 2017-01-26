(function () {
    ko.bindingHandlers.nssgTheadTr = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
            var cols = gridVM.columns;
            var $container = $(element).closest('.nssg-container');
            var containerWidth = null;
            var allColWidths = null;

            /*******************/
            /**     SORTING   **/
            /*******************/
            $(element).on('click', '.nssg-th', function (e) {
                var column = ko.dataFor(e.target);
                var isAsc = !column.isSortedAsc;

                gridVM.process({ sort: [{ sortBy: column.id, sortAsc: isAsc }] });
            });

            /************************/
            /**     DATA BINDING   **/
            /************************/
            ko.applyBindingsToNode(element, {
                foreach: {
                    data: cols,
                    as: 'col'
                }
            }, bindingContext);

            return { controlsDescendantBindings: true };
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
            var cols = gridVM.columns;
            var $container = $(element).closest('.nssg-container');
            var containerWidth = null;
            var allColWidths = null;

            /***************************/
            /**     COLUMN RESIZING   **/
            /***************************/
            if (gridVM.ui().allowResizing) {
                containerWidth = $container.width(); // Without borders
                allColWidths = defineColWidths(cols, containerWidth);

                // Set table width
                $('.nssg-table', $container).width(allColWidths);
            }
        }
    };
    function defineColWidths(columns, containerWidth) {
        var cols = ko.unwrap(columns);
        var cumulativeWidths = 0;
        var difference = null;

        // Set all column width and minWidth
        ko.utils.arrayForEach(cols, function (col) {
            if (col.minWidth === undefined) {
                col.minWidth = 80; // eslint-disable-line no-param-reassign
            }

            if (col.width === undefined) {
                col.width = col.minWidth; // eslint-disable-line no-param-reassign
            }

            cumulativeWidths += col.width;
        });

        // Our columns don't fill the container :(
        if (cumulativeWidths < containerWidth) {
            difference = containerWidth - cumulativeWidths;

            // Make the last column take up the remaining space
            cols[cols.length - 1].width += difference;

            cumulativeWidths += difference;
        }

        return cumulativeWidths;
    }
}());
