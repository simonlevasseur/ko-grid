(function () {
    ko.bindingHandlers.newnssgTh = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
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
            var isSortable = col.isSortable;
            var isSorted = col.isSorted;
            var isSortedAsc = col.isSorted && col.isSortedAsc;
            var isSortedDesc = col.isSorted && !col.isSortedAsc;

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
                var minWidth = col.minWidth ? Math.max(80,col.minWidth) : 80;
                newWidth = Math.max(minWidth, newWidth);
                var difference = newWidth - currentWidth;

                var $table = $('.nssg-table', $container);
                var tableWidth = $table.outerWidth();
                var newTableWidth = tableWidth + difference;

                if (newTableWidth >= $container.width()) {
                    $table.outerWidth(newTableWidth);
                }
                $th.outerWidth(newWidth);
            }

            function onDocumentMouseUp(e) {
                var colWidth = startWidth + (e.pageX - startX);
                $document.off('.' + NAMESPACE);
                
                var minWidth = col.minWidth ? Math.max(80,col.minWidth) : 80;

                var update = {};
                update[col.id] = { width: Math.max(minWidth, colWidth) };
                gridVM.process({ columnsById: update });
            }

            if ($('.nssg-col-grip', $th).length === 0) {
                if (gridVM.ui().isResizable !== false && col.isResizable !== false) {
                    $colGrip = $('<div></div>')
                        .addClass('nssg-col-grip')
                        .appendTo($th)
                        .on('click.' + NAMESPACE, onColGripClick)
                        .on('mousedown.' + NAMESPACE, onColGripMouseDown);
                }
            }

            /***************************/
            /**     COLUMN TEMPLATE   **/
            /***************************/

            var tmplName = col.type;
            var tmpl = templates[tmplName + '-th'];

            if (!tmpl) {
                tmplName = 'text';
                tmpl = templates[tmplName + '-th'];
            }

            var $template = $('.nssg-th-content', $th);
            if ($template.length === 0) {
                $template = $("<div class='nssg-th-content'></div>", $th);
                $template.append(tmpl);
                $th.append($template);
            }

            setTimeout(function(){
                $th
                    .addClass('nssg-th-' + tmplName)
                    .addClass('animate');
                $th.outerWidth(col.width);

                setTimeout(function () {
                    $th.removeClass('animate');
                }, 200);
            },0);

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
