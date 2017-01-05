(function () {
    ko.bindingHandlers.nssgTheadTr = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component),
                cols = gridVM.columns,
                $container = $(element).closest('.nssg-container');


            /*******************/
            /**     SORTING   **/
            /*******************/
            $(element).on('click', '.nssg-th', function (e, data) {
                var column = ko.dataFor(e.target);

                gridVM.onSortByCol(column);
            });

            /***************************/
            /**     COLUMN RESIZING   **/
            /***************************/
            if (gridVM.options.resizable) {
                var containerWidth = $container.width(), // Without borders
                    allColWidths = defineColWidths(cols, containerWidth);

                // Set table width
                $('.nssg-table', $container).width(allColWidths);
            }

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
        }
    };

    function defineColWidths(columns, containerWidth) {
        var cols = ko.unwrap(columns),
            cumulativeWidths = 0;

        // Set all column width and minWidth
        ko.utils.arrayForEach(cols, function (col) {
            if (col.minWidth === undefined) {
                col.minWidth = 80;
            }

            if (col.width === undefined) {
                col.width = col.minWidth;
            }

            cumulativeWidths += col.width;
        });

        // Our columns don't fill the container :(
        if (cumulativeWidths < containerWidth) {
            var difference = containerWidth - cumulativeWidths;

            // Make the last column take up the remaining space
            cols[cols.length - 1].width += difference;

            cumulativeWidths += difference;
        }

        return cumulativeWidths;
    }
}());
