(function () {
    ko.bindingHandlers.nssgTh = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var NAMESPACE = 'nssgTh';
            var col = valueAccessor();
            var gridVM = ko.unwrap(bindingContext.$component);
            var $th = $(element);
            var $document = $(document);
            var $container = $(element).closest('.nssg-container');
            var $colGrip = null;

            /**************************/
            /**     COLUMN SORTING   **/
            /**************************/
            var isSortable = ko.pureComputed(function () {
                var gridIsSortable = ko.unwrap(gridVM.options.sortable) &&
                    ko.unwrap(gridVM.options.sortable.enabled);
                var colIsSortable = ko.unwrap(col.sortable) !== false;

                return gridIsSortable && colIsSortable;
            });

            var isSorted = ko.pureComputed(function () {
                return ko.unwrap(gridVM.sorter.currentSortCol) === col;
            });

            var isSortedAsc = ko.pureComputed(function () {
                return isSorted() && ko.unwrap(gridVM.sorter.currentSortDir) === 'asc';
            });

            var isSortedDesc = ko.pureComputed(function () {
                return isSorted() && ko.unwrap(gridVM.sorter.currentSortDir) === 'desc';
            });

            /***************************/
            /**     COLUMN RESIZING   **/
            /***************************/
            var startX;
            var startWidth;

            function onColGripClick() {
                return false;
            }


            function onColGripMouseDown(e) {
                startX = e.pageX;
                startWidth = $th.outerWidth();

                $document
                    .on('mousemove.' + NAMESPACE, onDocumentMouseMove)
                    .one('mouseup.' + NAMESPACE, onDocumentMouseUp);
            }

            function onDocumentMouseMove(e) {
                var currentWidth = $th.outerWidth();
                var newWidth = startWidth + (e.pageX - startX);
                var difference = newWidth - currentWidth;

                var $table = $('.nssg-table', $container);
                var tableWidth = $table.outerWidth();
                var newTableWidth = tableWidth + difference;

                if (newTableWidth >= $container.width()) {
                    $table.outerWidth(newTableWidth);
                    $th.outerWidth(newWidth);
                }
            }

            function onDocumentMouseUp(e) {
                var colWidth = startWidth + (e.pageX - startX);
                col.width = colWidth;

                $document.off('.' + NAMESPACE);

                // Tell the grid that something has changed
                gridVM.emitChange();
            }

            if (gridVM.options.resizable && col.resizable !== false) {
                $colGrip = $('<div></div>')
                    .addClass('nssg-col-grip')
                    .appendTo($th)
                    .on('click.' + NAMESPACE, onColGripClick)
                    .on('mousedown.' + NAMESPACE, onColGripMouseDown);
            }

            /***************************/
            /**     COLUMN TEMPLATE   **/
            /***************************/
            $th
                .addClass('nssg-th-' + col.type)
                .outerWidth(col.width)
                .append(templates[col.type + '-th']);

            /*********************/
            /**     DISPLOSAL   **/
            /*********************/
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                if ($colGrip) {
                    $colGrip.off('.' + NAMESPACE);
                }

                $document.off('.' + NAMESPACE);
            });

            /************************/
            /**     DATA BINDING   **/
            /************************/
            ko.applyBindingsToNode(element, {
                css: {
                    'nssg-sortable': isSortable,
                    'nssg-sorted': isSorted,
                    'nssg-sorted-asc': isSortedAsc,
                    'nssg-sorted-desc': isSortedDesc
                }
            });
        }
    };
}());
