(function () {
    ko.bindingHandlers.nssgTh = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var NAMESPACE = 'nssgTh',
                col = valueAccessor(),
                gridVM = ko.unwrap(bindingContext.$component),
                $th = $(element),
                $document = $(document),
                $container = $(element).closest('.nssg-container');

            /**************************/
            /**     COLUMN SORTING   **/
            /**************************/
            var isSortable = ko.pureComputed(function () {
                    var gridIsSortable = ko.unwrap(gridVM.options.sortable) && ko.unwrap(gridVM.options.sortable.enabled),
                        colIsSortable = ko.unwrap(col.sortable) !== false;

                    return gridIsSortable && colIsSortable;
                }),

                isSorted = ko.pureComputed(function () {
                    return ko.unwrap(gridVM.sorter.currentSortCol) === col;
                }),

                isSortedAsc = ko.pureComputed(function () {
                    return isSorted() && ko.unwrap(gridVM.sorter.currentSortDir) === 'asc';
                }),

                isSortedDesc = ko.pureComputed(function () {
                    return isSorted() && ko.unwrap(gridVM.sorter.currentSortDir) === 'desc';
                });

            /***************************/
            /**     COLUMN RESIZING   **/
            /***************************/
            var startX,
                startWidth;

            function onColGripClick(e) {
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
                var currentWidth = $th.outerWidth(),
                    newWidth = startWidth + (e.pageX - startX),
                    difference = newWidth - currentWidth,

                    $table = $('.nssg-table', $container),
                    tableWidth = $table.outerWidth(),
                    newTableWidth = tableWidth + difference;

                if (newTableWidth >= $container.width()) {
                    $table.outerWidth(newTableWidth);
                    $th.outerWidth(newWidth);
                }
            }

            function onDocumentMouseUp(e) {
                $document.off('.' + NAMESPACE);

                var colWidth = startWidth + (e.pageX - startX);
                col.width = colWidth;

                // Tell the grid that something has changed
                gridVM.emitChange();
            }

            if (gridVM.options.resizable && col.resizable !== false) {
                var $colGrip = $('<div></div>')
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
