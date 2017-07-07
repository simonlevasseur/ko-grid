/* eslint no-unused-vars: 0 */

var selectedObservables = {};

/******************************/
/** vm-Handlebars: data **/
/******************************/
gridState.processors['vm-handlebars-columns'] = {
    watches: ['sort', 'columns', 'space'],
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
            };

            if (!options.model.lastInput.ui || !options.model.lastInput.ui.alreadyUpdatedColumns) {
                var timeA = performance.now();
                var compiledHtml = compiledTemplate(context);
                var timeB = performance.now();
                options.model.vm.hb_columns(compiledHtml);
                
                var timeC = performance.now();

                 if (options.model.logging) {
                     //keeping it here for debugging
                     console.log('Render template', (timeB - timeA));
                     console.log('Update Binding', (timeC - timeB));
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
            }
        }
        
        function compileTemplates(){
            options.cache.templates = options.cache.templates || {};
            
            var templateParts = [];
            templateParts.push("<tr class='nssg-thead-tr' id='" + options.cache.namespace + "'>");
            templateParts = templateParts.concat(options.model.columns.map(createSingleColumnTemplate));
            templateParts.push("<th class='nssg-th nssg-td-gutter'></th>");
            templateParts.push("</tr>");
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
            templateParts.push("<th class='nssg-th nssg-th-" + col.type + "' style='width:{{col.adjustedWidth}}px'>")
            templateParts.push(templates[col.type + '-th-hb'])
            templateParts.push('</th>');
            templateParts.push("{{/if}}")
            var template = templateParts.join("\n");
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
            if (numBefore > numNow) {
                temp = temp.slice(0, numNow);
                didChange = true;
            }
            else if (numBefore < numNow) {
                for (i = numBefore; i < numNow; i++) {
                    temp[i] = ko.observable();
                    didChange = true;
                }
            }

            for (i = 0; i < numNow; i++) {
                var column = columns[i];
                var colBefore = options.cache[column.id];
                var colNow = JSON.stringify(column);
                var newObj = JSON.parse(colNow);
                addColumnFunctions(newObj, options);
                newObj.width = newObj.adjustedWidth || newObj.width;
                temp[i](newObj);
                didChange = true;
                options.cache[column.id] = colNow;
            }
            
            return didChange;
        }
        
        function addColumnFunctions(col, options) {
            if (col.type === 'select') {
                col.toggleSelectAll = function (grid) {
                    return function () {
                        grid.process({ selection: { all: !options.model.ui.allSelected } });
                        return true;
                    };
                };
            }
        }
    }
};
