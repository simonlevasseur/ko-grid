/* eslint no-unused-vars: 0 */

var selectedObservables = {};

/******************************/
/** vm-Handlebars: data **/
/******************************/
gridState.processors['vm-handlebars-columns'] = {
    watches: ['sort', 'columns', 'space', 'paging', 'ui'],
    init: function (model) {
        if (!model.vm.hb_columns) {
            model.vm.hb_columns = ko.observable('');
        }
    },
    runs: function (options) {
        if (!options.model.space || !options.model.space.width) {
            return;
        }
        
        if (!detectChanges()) {
            return;
        }
        if (options.model.logging) {
            console.log('Updating the grid columns using Handlebar templates');
        }
        
        createJsContext();
        var template = compileTemplates();
        updateDom(template);
        
        function updateDom(compiledTemplate){
            var context = {
                jsContext: options.cache.namespace,
                columns: options.model.columnsById,
                showSelectAll: options.model.ui.selectMode === 'multi' && options.model.paging.totalItems > 0,
                ui: options.model.ui
            };

            if (!options.model.lastInput.ui || !options.model.lastInput.ui.alreadyUpdatedColumns) {
                var timeA = performance.now();
                var compiledHtml = compiledTemplate(context);
                var timeB = performance.now();
                options.model.vm.hb_columns(compiledHtml);
                
                var timeC = performance.now();

                 if (options.model.logging) {
                     //keeping it here for debugging
                     //console.log('Render template', (timeB - timeA));
                     //console.log('Update Binding', (timeC - timeB));
                 }
            }
            else {
                console.log('skipping the update dom step since the dom should already be up to date');
            }
        }

        function createJsContext() {
            if (!options.cache.namespace) {
                options.cache.namespace = 'NSSG_' + Math.floor(Math.random() * 99999);
                options.cache.jsContext = {};
                window[options.cache.namespace] = options.cache.jsContext;
                options.cache.jsContext.toggleSelectAll = toggleSelectAll;
                options.cache.jsContext.toggleSort = toggleSort;
                options.cache.jsContext.beginResize = onColGripMouseDown;
            }
        }
        
        function compileTemplates(){
            options.cache.templates = options.cache.templates || {};
            
            var templateParts = [];
            templateParts = templateParts.concat(options.model.columns.map(createSingleColumnTemplate));
            templateParts.push("<th class='nssg-th nssg-td-gutter'></th>");
            var template = templateParts.join('\n');
            var compiledTemplate = options.cache.templates[template];
            if (!compiledTemplate) {
                compiledTemplate = Handlebars.compile(template);
                options.cache.templates[template] = compiledTemplate;
            }
            return compiledTemplate;
        }
        
        function createSingleColumnTemplate(col) {
            var templateParts = [];
            if (templates[col.type + '-th-hb'] === undefined){
                console.error("Header Column type "+ col.type+" is not defined for handlebars, defaulting to text");
                col.type = "text";
            }
            templateParts.push("{{#if col.isVisible}}")
            templateParts.push("<th ");
            templateParts.push("class='nssg-th nssg-th-" + col.type);
            templateParts.push("{{#if col.isSortable}}nssg-sortable")
            templateParts.push("    {{#if col.isSorted}}nssg-sorted")
            templateParts.push("        {{#if col.isSortedAsc}}nssg-sorted-asc{{/if}}")
            templateParts.push("        {{#unless col.isSortedAsc}}nssg-sorted-desc{{/unless}}")
            templateParts.push("    {{/if}}");
            templateParts.push("{{/if}}");
            templateParts.push('\' ');
            templateParts.push("style='width:{{col.adjustedWidth}}px'")
            templateParts.push("{{#if col.isSortable}}onclick='{{jsContext}}.toggleSort(\"{{col.id}}\")'{{/if}}");
            templateParts.push('>');
            templateParts.push('{{#if col.isResizable}}');
            templateParts.push('<div class="nssg-col-grip" onmousedown="{{jsContext}}.beginResize(event, \'{{col.id}}\')"></div>');
            templateParts.push('{{/if}}');
            templateParts.push(templates[col.type + '-th-hb'])
            templateParts.push('</th>');
            templateParts.push("{{/if}}");
            
            templateParts = templateParts.map(function(str){return str.trim();});
            var template = templateParts.join(" ");
            var regexFriendlyId = col.id.replace(/\$/g, "$$$$");
            template = template.replace(/\{\{([^\}]*)col/g, '{{$1columns.' + regexFriendlyId);
            return template;
        }
        
        function detectChanges() {
            var didChange = false;
            var i = 0;

            var columns = options.model.columns;
            var temp = options.model.vm.columns();
            var numBefore = temp.length;
            var numNow = columns.length;
            if (numBefore !== numNow) {
                didChange = true;
            }

            for (i = 0; i < numNow; i++) {
                var column = columns[i];
                var colBefore = options.cache[column.id];
                var colNow = JSON.stringify(column);
                var newObj = JSON.parse(colNow);
                didChange = true;
                options.cache[column.id] = colNow;
            }
            
            return didChange;
        }
        
        function toggleSelectAll() {
            options.model.vm.process({selection:{all:!options.model.ui.allSelected}});
        }
        
        function toggleSort(colId) {
            var wasAlreadySortedAsc = options.model.sort && options.model.sort.length > 0 && options.model.sort[0].sortBy === colId && options.model.sort[0].sortAsc;
            var sort = [{sortBy: colId, sortAsc: !wasAlreadySortedAsc}]
            options.model.vm.process({sort:sort});
        }
        
        function onColGripMouseDown(e, id) {
            var $th = $(e.target).closest("th");
            var $table = $th.closest("table");
            var $document = $(document);
            var $container = $table.closest(".nssg-container");
            var resizeContext = {
                col : options.model.columnsById[id],
                startX : e.pageX,
                startWidth : $th.outerWidth(),
                $th: $th,
                $table: $table,
                $document: $document,
                $container: $container
            }

            $document
                .on('mousemove.' + options.cache.namespace, onDocumentMouseMove.bind(null, resizeContext))
                .one('mouseup.' + options.cache.namespace, onDocumentMouseUp.bind(null, resizeContext));
        }

        function onDocumentMouseMove(ctx, e) {
            var currentWidth = ctx.$th.outerWidth();
            var newWidth = ctx.startWidth + (e.pageX - ctx.startX);
            var minWidth = ctx.col.minWidth ? Math.max(80, ctx.col.minWidth) : 80;
            newWidth = Math.max(minWidth, newWidth);
            var difference = newWidth - currentWidth;

            var tableWidth = ctx.$table.outerWidth();
            var newTableWidth = tableWidth + difference;

            if (newTableWidth >= ctx.$container.width()) {
                ctx.$table.outerWidth(newTableWidth);
            }
            ctx.$th.outerWidth(newWidth);
        }

        function onDocumentMouseUp(ctx, e) {
            var colWidth = ctx.startWidth + (e.pageX - ctx.startX);
            ctx.$document.off('.' + options.cache.namespace);

            var minWidth = ctx.col.minWidth ? Math.max(80, ctx.col.minWidth) : 80;

            var update = {};
            update[ctx.col.id] = { width: Math.max(minWidth, colWidth), adjustedWidth: 0 };
            options.model.vm.process({ columnsById: update });
        }
    }
};
