(function () {
    ko.bindingHandlers.newnssgTheadTr = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
            var $container = $(element).closest('.nssg-container');
            var containerWidth = null;
            var allColWidths = null;

            /*******************/
            /**     SORTING   **/
            /*******************/
            $(element).on('click', '.nssg-th', function (e) {
                var column = ko.dataFor(e.target);
                var isAsc = !column.isSortedAsc;

                if (column.isSortable) {
                    gridVM.process({ sort: [{ sortBy: column.id, sortAsc: isAsc }] });
                }
            });

            /************************/
            /**     DATA BINDING   **/
            /************************/
            var visibleCols = ko.pureComputed(function () {
                var cols = ko.unwrap(gridVM.columns);
                return cols.filter(function (col) {
                    return col.peek().isVisible;
                });
            });

            ko.applyBindingsToNode(element, {
                foreach: {
                    data: visibleCols,
                    as: 'col'
                }
            }, bindingContext);

            var gutter = document.createElement('th');
            gutter.className = 'gutter nssg-th';
            $(element).append(gutter);

            ko.computed(function () {
                var allColWidths = null;

                var allColWidths = visibleCols().reduce(function (total, col) {
                    return total + col().width;
                }, 0);
                var containerWidth = $container.width();
                if (typeof allColWidths !== 'number' || isNaN(allColWidths)) {
                    allColWidths = 0;
                }

                var fixedWidth = Math.ceil(Math.max(allColWidths, containerWidth)) - 1;
                $('.nssg-table', $container).width(fixedWidth);
            });

            return { controlsDescendantBindings: true };
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
            var cols = gridVM.columns;
            var $container = $(element).closest('.nssg-container');
            var containerWidth = null;
        }
    };
}());
