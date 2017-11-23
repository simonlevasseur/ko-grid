/* eslint no-unused-vars :0 */
/* istanbul ignore next */
(function (factory) {
    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        factory(require('ko'), require('jquery'), require('processing-pipeline'), // eslint-disable-line global-require
        require('handlebars'), exports);  // eslint-disable-line global-require
    }
    else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
        define(['ko', 'jquery', 'processing-pipeline', 'handlebars', 'exports'], factory); // eslint-disable-line no-undef
    }
    else {
        factory(ko, $, PipelineFactory, Handlebars); // eslint-disable-line no-undef
    }
}(function (ko, $, PipelineFactory, Handlebars) {
    'use strict';
    /*********************/
    /** SYMBOL POLYFILL **/
    /*********************/
    
    var symbolDetection;
    
    try {
        symbolDetection = Symbol('foo');
    }
    catch (ignored) {} // eslint-disable-line no-empty
    
    if (!symbolDetection) {
        Symbol = function (name) {
            return '' + name + Math.floor(Math.random() * 99999);
        };
    }
    


    /*********************/
    /**     TEMPLATES   **/
    /*********************/
    var templates = {};
templates["grid"] = "<div class=\"nssg-container\" data-bind=\"css: { isLoading: !data.loaded() || ui().running() }, nssgContainerSize: size\"><table class=\"nssg-table\" data-bind=\"css : { animate: ui().animationEnabled}\"><thead class=\"nssg-thead\" data-bind=\"if: ui()['columns-use-handlebars']\"><tr class=\"nssg-thead-tr\" data-bind=\"html: hb_columns\"></tr></thead><thead class=\"nssg-thead\" data-bind=\"ifnot: ui()['columns-use-handlebars']\"><tr class=\"nssg-thead-tr\" data-bind=\"newnssgTheadTr: true\"><th class=\"nssg-th\" data-bind=\"newnssgTh: col\"></th></tr></thead><tbody class=\"nssg-tobdy\" data-bind=\"newnssgTbody: true\"><tr class=\"nssg-tbody-tr\" data-bind=\"newnssgTbodyTr: true\"><td class=\"nssg-td\" data-bind=\"newnssgTd: col\"></td></tr></tbody></table></div>";
templates["grid_hb"] = "<div class=\"nssg-container\" data-bind=\"css: { isLoading: !data.loaded() || ui().running() }, nssgContainerSize: size\"><table class=\"nssg-table\" data-bind=\"css : { animate: ui().animationEnabled}\"><thead class=\"nssg-thead\" data-bind=\"if: ui()['columns-use-handlebars']\"><tr class=\"nssg-thead-tr\" data-bind=\"html: hb_columns\"></tr></thead><thead class=\"nssg-thead\" data-bind=\"ifnot: ui()['columns-use-handlebars']\"><tr class=\"nssg-thead-tr\" data-bind=\"newnssgTheadTr: true\"><th class=\"nssg-th\" data-bind=\"newnssgTh: col\"></th></tr></thead><tbody class=\"nssg-tobdy\" data-bind=\"html: hb_tbody\"></tbody></table></div>";
templates["paging"] = "<div class=\"nssg-paging\"><div class=\"nssg-paging-selector-container\" data-bind=\"visible: true\"> <span class=\"nssg-paging-view\">View</span> <select class=\"nssg-paging-pages\" data-bind=\"options: pageSizes, value: pageSize\"></select></div> <span class=\"nssg-paging-count\">Showing&nbsp;<span data-bind=\"text:firstItem\"></span>-<span data-bind=\"text:lastItem\"></span> of&nbsp;<span data-bind=\"text:totalItems\"></span></span><div class=\"nssg-paging-controls\" data-bind=\"visible: true\"> <a href=\"#\" class=\"nssg-paging-arrow nssg-paging-first\" data-bind=\"click: goToFirstPage, visible: currentPageIndex()>1\"></a> <a href=\"#\" class=\"nssg-paging-arrow nssg-paging-prev\" data-bind=\"click: goToPrevPage, visible: currentPageIndex()>1\"></a> <input type=\"text\" class=\"nssg-paging-current\" data-bind=\"value: currentPageIndex\"/><span class=\"nssg-paging-total\" data-bind=\"text: 'of ' + maxPageIndex()\"></span><a href=\"#\" class=\"nssg-paging-arrow nssg-paging-next\" data-bind=\"click: goToNextPage, visible: currentPageIndex() < maxPageIndex()\"></a><a href=\"#\" class=\"nssg-paging-arrow nssg-paging-last\" data-bind=\"click: goToLastPage, visible: currentPageIndex() < maxPageIndex()\"></a><a href=\"#\" class=\"nssg-paging-arrow nssg-paging-refresh\" data-bind=\"click: refresh\"></a></div></div>";
templates["actions"] = "<div class=\"nssg-actions-container\" data-bind=\"foreach: $component().ui().actions\"><a href=\"#\" class=\"nssg-action\" data-bind=\"css: $data.css, click: function(){$data.onClick(row.raw)}\"></a></div>";
templates["actions_hb"] = "<div class=\"nssg-actions-container\"> {{#each ../actions as |action key|}}<a href=\"#\" class=\"nssg-action {{#nssg__strOrFn action.css ../raw ..}}{{/nssg__strOrFn}}\" onClick=\"{{../../jsContext}}.invokeAction('{{../$identity}}', {{action.index}}); return false\"></a> {{/each}}</div>";
templates["gutter"] = "";
templates["gutter_hb"] = "";
templates["select"] = "<input type=\"checkbox\" data-bind=\"checked: row.isSelected, checkedValue: row, click: row.toggleSelection($component()), visible: isSelectable\"/>";
templates["select_hb"] = "{{#if isSelectable}}<input type=\"checkbox\" {{#if isSelected}}checked {{/if}} onClick=\"javascript:{{../jsContext}}.toggleSelect('{{$identity}}', this)\"/>{{/if}}";
templates["text"] = "<div class=\"nssg-td-text\" data-bind=\"text: $parent[id], attr: { title: $parent[id] }\"></div>";
templates["text_hb"] = "<div class=\"nssg-td-text\" title=\"{{value}}\">{{value}}</div>";
templates["actions-th-hb"] = "";
templates["select-th-hb"] = "{{#if showSelectAll}} <input type=\"checkbox\" {{#if ui.allSelected}}checked=\"checked\"{{/if}} onclick=\"{{jsContext}}.toggleSelectAll()\"/> {{/if}}";
templates["select-th"] = "<input type=\"checkbox\" data-bind=\"checked: $component().ui().allSelected, visible: $parent.ui().selectMode==='multi' && $parent.paging().totalItems> 0, click: col.toggleSelectAll($component())\" />";
templates["text-th-hb"] = "<div class=\"nssg-th-text\" title=\"{{col.heading}}\">{{col.heading}}</div>";
templates["text-th"] = "<div class=\"nssg-th-text\" data-bind=\"text: col.heading, attr: { title: col.heading }\"></div>";
    /* eslint no-unused-vars: "off" */
    
    /*****************/
    /**     UTILS   **/
    /*****************/
    
    // All properties in objTarget which also occur in objSource will be replaced with the versions
    // from objSource.  Nested objects will be processed recursively.  Arrays will be replaced, not merged.
    
    function deepReplace(objTarget) {
        var objSources = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < objSources.length; i++) {
            var objSource = objSources[i];
            for (var key in objSource) { // eslint-disable-line guard-for-in
                var value = objSource[key];
                if (typeof value === 'object' && !(Array.isArray(value) || isPromise(value))) {
                    objTarget[key] = objTarget[key] || {}; // eslint-disable-line no-param-reassign
                    deepReplace(objTarget[key], value);
                }
                else {
                    if (Array.isArray(value)) {
                        value = value.slice();
                    }
                    objTarget[key] = value; // eslint-disable-line no-param-reassign
                }
            }
        }
        return objTarget;
    }
    
    function isArray(obj) {
        return Array.isArray(obj);
    }
    
    function isArrayOrObsArray(obj) {
        return isArray(obj) || isObservableArray(obj);
    }
    
    function isEmptyObject(obj) {
        if (!isObject(obj)) {
            return false;
        }
    
        var name;
        for (name in obj) { // eslint-disable-line guard-for-in
            return false;
        }
    
        return true;
    }
    
    function isFuncNotObsArray(obj) {
        return isFunction(obj) && !ko.isObservable(obj);
    }
    
    function isFunction(obj) {
        return typeof obj === 'function';
    }
    
    
    function promisify(value) {
        if (!isPromise(value)) {
            return Promise.resolve(value);
        }
        return value;
    }
    
    function isObject(obj) {
        return obj !== null && typeof obj === 'object' && !isArray(obj);
    }
    
    function isObservableArray(obj) {
        return ko.isObservable(obj) && 'push' in obj;
    }
    
    function isPromise(obj) {
        return obj && typeof obj === 'object' && typeof obj.then === 'function';
    }
    
    // Recursively walks through objects, invoking the supplied predicate whenever
    // the condition function returns true
    //
    // condition/predicate signature: (value, key, obj)
    function walkObject(obj, condition, predicate) {
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            var value = obj[key];
            if (condition(value, key, obj)) {
                predicate(value, key, obj);
            }
            if (typeof value === 'object' && !Array.isArray(value)) {
                walkObject(value, condition, predicate);
            }
        }
    }
    
    /**
     * This is a standin for lodash _.first(_.filter(array, obj))
     */
    function findFirst(array, obj) {
        for (var i = 0; i < array.length; i++) {
            var found = true;
            for (var key in obj) {
                if (array[i][key] !== obj[key]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return array[i];
            }
        }
        return undefined;
    }
    
    function arrayify(input) {
        return Array.isArray(input) ? input : [input];
    }
    
    function isTruthy(obj) {
        return !!obj;
    }
    
    function unique(array) {
        var temp = {};
        var result = [];
        array.forEach(function (value) {
            if (!temp[value]) {
                temp[value] = true;
                result.push(value);
            }
        });
        return result;
    }
    
    function objectKeys(obj) {
        return objectKeyValuePairs(obj).map(function (prop) {
            return prop.key;
        });
    }
    function objectValues(obj) {
        return objectKeyValuePairs(obj).map(function (prop) {
            return prop.value;
        });
    }
    
    function objectKeyValuePairs(obj) {
        var result = [];
        for (var key in obj) { // eslint-disable-line guard-for-in
            result.push({ key: key, value: obj[key] });
        }
        return result;
    }
    
    
    /************************/
    /**     KO EXTENDERS   **/
    /************************/
    ko.extenders.nssgSingleSelect = function (target, option) {
        // Before change clears the array before the new value is set
        target.subscribe(function (oldVal) {
            if (oldVal && oldVal.length) {
                oldVal.length = 0; // eslint-disable-line no-param-reassign
            }
        }, null, 'beforeChange');
    
        target.subscribe(function (newVal) {
            if (newVal && newVal.length > 1) {
                newVal.splice(0, newVal.length - 1);
            }
        });
    };
    
    function throttle(options) {
        if (typeof options !== 'object' || !options) {
            throw new Error('throttle expects a configuration object');
        }
        var invoke = options.callback;
        var frequency = options.frequency;
        var leading = options.leading;
        var trailing = options.trailing;
        var invokeTimer = null;
    
        if (typeof invoke !== 'function') {
            throw new Error('callback must be a function');
        }
        if (typeof frequency !== 'number' || frequency <= 0) {
            throw new Error('frequency must be a number greater than 0');
        }
        if (!leading && !trailing) {
            leading = true;
            trailing = true;
        }
    
        function doLeading() {
            if (leading) {
                invoke();
            }
        }
        function doTrailing() {
            invokeTimer = null;
            if (trailing) {
                invoke();
            }
        }
    
        function requestInvoke() {
            if (invokeTimer) {
                return;
            }
            doLeading();
            invokeTimer = setTimeout(doTrailing, frequency);
        }
        function dispose() {
            options = null;
            invoke = null;
            if (invokeTimer) {
                clearTimeout(invokeTimer);
            }
        }
        requestInvoke.dispose = dispose;
        return requestInvoke;
    }
    

        Handlebars.registerHelper('nssg__strOrFn', function (v1, v2) {
            if (typeof v1 === 'string') {
                return v1;
            }
            else {
                return v1(v2);
            }
        });
        


    //= include "other/defaults.js"

    function AddInitialProcesses(gridState) {
        /* eslint no-unused-vars: 0 */
        
        /*************************/
        /** Columns Check Valid **/
        /*************************/
        gridState.processors['columns-check-valid'] = {
            watches: ['columns'],
            runs: function (options) {
                if (!Array.isArray(options.model.columns)) {
                    throw new Error('Columns must be an array of objects');
                }
        
                var didChange = false;
        
                var identityColPresent = !!findFirst(options.model.columns, { isIdentity: true });
                var columnIds = {};
                options.model.columns.forEach(function (column) {
                    if (!column.id && !column.dataAccessor) {
                        throw new Error('You must specify column id or dataAccessor');
                    }
                    if (!column.id && typeof column.dataAccessor !== 'string') {
                        throw new Error('Column id must be specified if dataAccessor is a not a string');
                    }
        
                    didChange |= setDefault(column, 'type', 'string', 'text');
                    didChange |= setDefault(column, 'id', 'string', column.dataAccessor);
                    if (typeof column.dataAccessor !== 'function') {
                        didChange |= setDefault(column, 'dataAccessor', 'string', column.id);
                    }
                    didChange |= setDefault(column, 'heading', 'string', column.id);
                    didChange |= setDefault(column, 'isIdentity', 'boolean', !identityColPresent);
                    didChange |= setDefault(column, 'isSortable', 'boolean', true);
                    didChange |= setDefault(column, 'isResizable', 'boolean', true);
                    didChange |= setDefault(column, 'isVisible', 'boolean', true);
        
                    if (columnIds[column.id]) {
                        throw new Error("Columns must have unique id's: " + column.id);
                    }
                    columnIds[columnIds] = true;
                });
        
                if (options.model.logging && didChange) {
                    console.log('Default values applied to the columns');
                }
            }
        };
        
        function setDefault(obj, prop, type, defaultValue) {
            if (typeof obj[prop] !== type || (type === 'object' && !type)) { // eslint-disable-line valid-typeof
                obj[prop] = defaultValue;
                return true;
            }
            else {
                return false;
            }
        }
        

        /*****************************************/
        /** Columns Changed Reset Width to zero **/
        /*****************************************/
        gridState.processors['columns-changed-reset-width-to-zero'] = {
            watches: ['columns'],
            runs: function (options) {
                var columnsArray = options.model.columns.filter(function (col) {
                    // Only count columns which are resizable
                    return col.isResizable;
                }).filter(function (col) {
                    // don't count "ui" columns which get added automatically
                    return col.id.indexOf('$$') !== 0;
                });
        
                var before = options.cache.length;
                var now = columnsArray.length;
        
                options.cache.length = now;
        
                if (typeof before !== 'number' || before === now || now === 0) {
                    // this is either the first time seeing columns, nothing changed, or nothing to do
                    return;
                }
        
                if (options.model.logging) {
                    console.log('The length of the columns array changed; Resetting the width of resizable columns');
                }
        
                columnsArray.forEach(function (col) {
                    col.width = 0;
                });
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /***********************************/
        /** Columns Enable Actions Column **/
        /***********************************/
        gridState.processors['columns-enable-actions-column'] = {
            watches: ['ui', 'columns'],
            runs: function (options) {
                if (options.model.ui && options.model.ui.actions) {
                    var foundAny = false;
                    for (var key in options.model.ui.actions) { // eslint-disable-line guard-for-in
                        foundAny = true;
                    }
                    if (!foundAny) {
                        return;
                    }
        
                    var actionCol = findFirst(options.model.columns, { id: '$$action' });
                    if (!actionCol) {
                        if (options.model.logging) {
                            console.log('Adding the action column');
                        }
                        actionCol = {
                            id: '$$action',
                            type: 'actions',
                            isSortable: false,
                            isIdentity: false,
                            isResizable: false,
                            width: 0
                        };
                        options.model.columns.unshift(actionCol);
                    }
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*************************************/
        /** Columns Enable Selection Column **/
        /*************************************/
        gridState.processors['columns-enable-selection-column'] = {
            watches: ['ui', 'columns'],
            runs: function (options) {
                if (options.model.ui.selectable) {
                    var selectCol = findFirst(options.model.columns, { id: '$$select' });
                    if (!selectCol) {
                        if (options.model.logging) {
                            console.log('Adding the row selection column');
                        }
                        selectCol = {
                            id: '$$select',
                            type: 'select',
                            isSortable: false,
                            isIdentity: false,
                            isResizable: false,
                            width: 40
                        };
                        options.model.columns.unshift(selectCol);
                    }
                    if (typeof options.model.ui.selectMode === 'undefined') {
                        options.model.ui.selectMode = 'multi';
                    }
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*************************/
        /** Columns Index by Id **/
        /*************************/
        gridState.processors['columns-index-by-id'] = {
            input: ['columnsById'],
            watches: ['columns'],
            runs: function (options) {
                var before = options.model.columnsById || {};
                options.model.columnsById = {};
                var didChange = false;
                options.model.columns.forEach(function (column) {
                    if (before[column.id] !== column) {
                        didChange = true;
                    }
                    options.model.columnsById[column.id] = column;
                });
        
                if (options.model.logging && didChange) {
                    console.log('Indexing columns by id');
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        var ABSOLUTE_MIN_COL_WIDTH = 80;
        
        /********************************/
        /** Columns-Apply Min Max Width **/
        /********************************/
        gridState.processors['columns-apply-min-max-width'] = {
            watches: ['columns', 'space'],
            runs: function (options) {
                if (!options.model.space || options.model.space.width <= 0) {
                    return;
                }
                var columnsArray = options.model.columns.filter(function (col) {
                    return col.isVisible;
                });
        
                widthToTemp(columnsArray);
        
                applyMinMax(columnsArray);
        
                var whatWasChanged = tempToWidth(columnsArray);
                removeTemp(columnsArray);
        
                if (options.model.logging && whatWasChanged) {
                    console.log('Applying Min/Max column widths', whatWasChanged);
                }
            }
        };
        
        function widthToTemp(columnsArray) {
            columnsArray.forEach(function (col) {
                col.tempWidth = typeof col.width === 'number' && col.width >= 0 ? col.width : ABSOLUTE_MIN_COL_WIDTH;
            });
        }
        
        function tempToWidth(columnsArray) {
            var somethingChanged = false;
            var whatWasChanged = {};
            columnsArray.forEach(function (col) {
                if (col.width !== col.tempWidth) {
                    whatWasChanged[col.id] = { before: col.width, after: col.tempWidth };
                    somethingChanged = true;
                }
                col.width = col.tempWidth;
            });
            return somethingChanged ? whatWasChanged : null;
        }
        
        function removeTemp(columnsArray) {
            columnsArray.forEach(function (col) {
                delete col.tempWidth;
            });
        }
        
        function applyMinMax(columnsArray) {
            columnsArray.forEach(function (col) {
                if (col.isResizable === false || !col.isVisible) {
                    return;
                }
                if (col.minWidth) {
                    col.tempWidth = Math.max(col.tempWidth, col.minWidth);
                }
                if (col.maxWidth) {
                    col.tempWidth = Math.min(col.tempWidth, col.maxWidth);
                }
                if (col.tempWidth < ABSOLUTE_MIN_COL_WIDTH) {
                    col.tempWidth = ABSOLUTE_MIN_COL_WIDTH;
                }
            });
        }
        

        /* eslint no-unused-vars: 0 */
        var ABSOLUTE_MIN_COL_WIDTH = 80;
        
        /****************************************/
        /** Columns-Redistribute Space Equally **/
        /****************************************/
        /**
         * #1 too small distribute proportionally
         * #2 cols too big grid scrolls
         * #3 window resize distribute proportionally
         * #4 cols added/removed recalculate
         * #5 some cols not resizable
         * #6 drag finished transition distribute proportionally
         */
        gridState.processors['columns-redistribute-space-equally'] = {
            watches: ['columns', 'space'],
            runs: function (options) {
                if (!options.model.space || options.model.space.width <= 0) {
                    return;
                }
                var columnsArray = options.model.columns.filter(function (col) {
                    return col.isVisible;
                });
        
                widthToTemp(columnsArray);
        
                var containerWidth = Math.floor(options.model.space.width) - 2;
                var availableWidth;
                var previousAvailableWidth;
                var usedWidth;
        
                applyMinMax(columnsArray);
        
                // min, max width and non-resizable columns can leave small amounts of space left over.
                // we run this in an iteration so that should those edge cases occur we still mostly fill the space
                // The limit of 10 is just to ensure we don't end up looping forever
                // usually this will exit after the second iteration
                for (var iterations = 0; iterations < 10; iterations++) {
                    previousAvailableWidth = availableWidth;
        
                    usedWidth = calculateUsedWidth(columnsArray);
        
                    availableWidth = Math.max(0, containerWidth - usedWidth);
        
                    distributeAvailableSpace(columnsArray, availableWidth);
        
                    if (availableWidth === previousAvailableWidth) {
                        break;
                    }
                }
        
                var whatWasChanged = tempToAdjustedWidth(columnsArray);
                removeTemp(columnsArray);
        
                if (options.model.logging && whatWasChanged) {
                    console.log('Redistributing exta space amoung the columns', whatWasChanged);
                }
            }
        };
        
        function widthToTemp(columnsArray) {
            columnsArray.forEach(function (col) {
                col.tempWidth = typeof col.width === 'number' && col.width >= 0 ? col.width : ABSOLUTE_MIN_COL_WIDTH;
            });
        }
        
        function tempToAdjustedWidth(columnsArray) {
            var somethingChanged = false;
            var whatWasChanged = {};
            columnsArray.forEach(function (col) {
                if (col.adjustedWidth !== col.tempWidth) {
                    whatWasChanged[col.id] = { before: col.adjustedWidth || col.width, after: col.tempWidth };
                    somethingChanged = true;
                }
                col.adjustedWidth = col.tempWidth;
            });
            return somethingChanged ? whatWasChanged : null;
        }
        
        function removeTemp(columnsArray) {
            columnsArray.forEach(function (col) {
                delete col.tempWidth;
            });
        }
        
        function calculateUsedWidth(columnsArray) {
            return columnsArray.reduce(function (total, col) {
                return total + (col.tempWidth ? col.tempWidth : 0);
            }, 0);
        }
        
        function applyMinMax(columnsArray) {
            columnsArray.forEach(function (col) {
                if (col.isResizable === false || !col.isVisible) {
                    return;
                }
                if (col.minWidth) {
                    col.tempWidth = Math.max(col.tempWidth, col.minWidth);
                }
                if (col.maxWidth) {
                    col.tempWidth = Math.min(col.tempWidth, col.maxWidth);
                }
                if (col.tempWidth < ABSOLUTE_MIN_COL_WIDTH) {
                    col.tempWidth = ABSOLUTE_MIN_COL_WIDTH;
                }
            });
        }
        
        function distributeAvailableSpace(columnsArray, space) {
            var resizableColumns = columnsArray.reduce(function (total, col) {
                return total + (col.isResizable ? 1 : 0);
            }, 0);
        
            var spacePerColumn = Math.floor(space / resizableColumns);
            if (spacePerColumn <= 0) {
                return;
            }
        
            columnsArray.forEach(function (col) {
                if (col.isResizable) {
                    col.tempWidth += spacePerColumn;
                }
            });
        
            applyMinMax(columnsArray);
        }
        

        /* eslint no-unused-vars: 0 */
        var ABSOLUTE_MIN_COL_WIDTH = 80;
        
        /*****************************************************/
        /** Columns-Redistribute Space to Rightmost Visible **/
        /*****************************************************/
        gridState.processors['columns-redistribute-space-to-rightmost-visible'] = {
            watches: ['columns', 'space'],
            runs: function (options) {
                if (!options.model.space || options.model.space.width <= 0) {
                    return;
                }
                var columnsVisible = options.model.columns.filter(function (col) {
                    return col.isVisible;
                });
                var columnsVisibleAndResizable = columnsVisible.filter(function (col) {
                    return col.isResizable;
                });
                if (columnsVisibleAndResizable.length === 0) {
                    // we wouldn't be able to do anything anyway so exit early
                    return;
                }
                var rightmost = columnsVisibleAndResizable[columnsVisibleAndResizable.length - 1];
        
                widthToTemp(columnsVisible);
        
                var containerWidth = Math.floor(options.model.space.width) - 2;
                var availableWidth;
                var previousAvailableWidth;
                var usedWidth;
        
                applyMinMax(columnsVisible);
        
                usedWidth = calculateUsedWidth(columnsVisible);
                availableWidth = Math.max(0, containerWidth - usedWidth);
        
                rightmost.tempWidth += availableWidth;
        
                var whatWasChanged = tempToAdjustedWidth(columnsVisible);
                removeTemp(columnsVisible);
        
                if (options.model.logging && whatWasChanged) {
                    console.log('Redistributing exta space amoung the columns', whatWasChanged);
                }
            }
        };
        
        function widthToTemp(columnsVisible) {
            columnsVisible.forEach(function (col) {
                col.tempWidth = typeof col.width === 'number' && col.width >= 0 ? col.width : ABSOLUTE_MIN_COL_WIDTH;
            });
        }
        
        function tempToAdjustedWidth(columnsVisible) {
            var somethingChanged = false;
            var whatWasChanged = {};
            columnsVisible.forEach(function (col) {
                if (col.adjustedwidth !== col.tempWidth) {
                    whatWasChanged[col.id] = { before: col.adjustedwidth || col.width, after: col.tempWidth };
                    somethingChanged = true;
                }
                col.adjustedWidth = col.tempWidth;
            });
            return somethingChanged ? whatWasChanged : null;
        }
        
        function removeTemp(columnsVisible) {
            columnsVisible.forEach(function (col) {
                delete col.tempWidth;
            });
        }
        
        function calculateUsedWidth(columnsVisible) {
            return columnsVisible.reduce(function (total, col) {
                return total + (col.tempWidth ? col.tempWidth : 0);
            }, 0);
        }
        
        function applyMinMax(columnsVisible) {
            columnsVisible.forEach(function (col) {
                if (col.isResizable === false || !col.isVisible) {
                    return;
                }
                if (col.minWidth) {
                    col.tempWidth = Math.max(col.tempWidth, col.minWidth);
                }
                if (col.maxWidth) {
                    col.tempWidth = Math.min(col.tempWidth, col.maxWidth);
                }
                if (col.tempWidth < ABSOLUTE_MIN_COL_WIDTH) {
                    col.tempWidth = ABSOLUTE_MIN_COL_WIDTH;
                }
            });
        }
        

        /* eslint no-unused-vars: 0 */
        var ABSOLUTE_MIN_COL_WIDTH = 80;
        
        /**********************************************/
        /** Columns-Unlock columns user just resized **/
        /**********************************************/
        gridState.processors['columns-unlock-columns-user-just-resized'] = {
            watches: ['columns'],
            runs: function (options) {
                var didRemoveLock = false;
                var whatWasUnlocked = [];
        
                options.model.columns.forEach(function (col) {
                    if (col.$temporarilyIsResizableFalse) {
                        delete col.$temporarilyIsResizableFalse;
                        col.isResizable = true;
                        didRemoveLock = true;
                        whatWasUnlocked.push(col.id);
                    }
                });
        
                if (didRemoveLock && options.model.logging) {
                    console.log('Unlocked columns', whatWasUnlocked);
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        var ABSOLUTE_MIN_COL_WIDTH = 80;
        
        /********************************************/
        /** Columns-Lock Columns user just resized **/
        /********************************************/
        gridState.processors['columns-lock-columns-user-just-resized'] = {
            watches: ['columns'],
            runs: function (options) {
                var changedColumnsById = options.model.lastInput.columnsById;
                if (!changedColumnsById) {
                    return;
                }
        
                var key;
                var col;
                var columnsThatWereJustResizedByUser = {};
                for (key in changedColumnsById) {
                    if (changedColumnsById.hasOwnProperty(key)) {
                        col = changedColumnsById[key];
                        if (col.width && options.model.columnsById[key].isResizable) {
                            columnsThatWereJustResizedByUser[key] = true;
                        }
                    }
                }
        
                var resizableColumnsThatWerentResized = options.model.columns.filter(function (filterCol) {
                    return filterCol.isVisible && filterCol.isResizable && !columnsThatWereJustResizedByUser[filterCol.id];
                });
        
                if (resizableColumnsThatWerentResized.length === 0) {
                    // If there are no other valid resizable columns then we can't lock anything without creating ui glitches
                    if (options.model.logging) {
                        console.log('Unable to lock column size', columnsThatWereJustResizedByUser);
                    }
                }
                else {
                    var whatWasLocked = [];
                    for (key in columnsThatWereJustResizedByUser) {
                        if (columnsThatWereJustResizedByUser.hasOwnProperty(key)) {
                            col = options.model.columnsById[key];
                            col.isResizable = false;
                            col.$temporarilyIsResizableFalse = true;
                            whatWasLocked.push(key);
                        }
                    }
                    if (options.model.logging) {
                        console.log('Locking column width', whatWasLocked);
                    }
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** Columns-sort-indicators **/
        /*****************************/
        gridState.processors['columns-sort-indicators'] = {
            watches: ['sort', 'columns'],
            runs: function (options) {
                var didChange = false;
                var before = {};
                var after = {};
        
                options.model.columns.forEach(function (column) {
                    before[column.id] = { a: column.isSorted, b: column.isSortedAsc };
        
                    column.isSorted = false;
                    column.isSortedAsc = false;
                });
                options.model.sort.forEach(function (sort) {
                    var column = options.model.columnsById[sort.sortBy];
                    if (column) {
                        column.isSorted = true;
                        column.isSortedAsc = sort.sortAsc;
                    }
                });
                options.model.columns.forEach(function (column) {
                    after[column.id] = { a: column.isSorted, b: column.isSortedAsc };
                });
        
                didChange = JSON.stringify(before) !== JSON.stringify(after);
        
                if (options.model.logging && didChange) {
                    console.log('Updating the sort indicators');
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /************************/
        /** Filter Check Valid **/
        /************************/
        gridState.processors['filter-check-valid'] = {
            watches: ['filter'],
            runs: function (options) {
                var hasKeys = false;
                for (var key in options.model.filter) {
                    hasKeys = true;
                    break;
                }
                if (!hasKeys) {
                    return;
                }
        
                if (options.model.logging) {
                    console.log('Checking the filter criteria looks right');
                }
        
                if (typeof options.model.filter === 'string') {
                    options.model.filter = {
                        '*': options.model.filter
                    };
                }
        
                for (var key in options.model.filter) {
                    if (options.model.filter.hasOwnProperty(key)) {
                        var filter = options.model.filter[key];
                        if (filter === '') {
                            delete options.model.filter[key];
                        }
                        else if (typeof filter === 'string') {
                            options.model.filter[key] = filter.toLowerCase();
                        }
                    }
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /***********************************/
        /** data-calculate-row-identities **/
        /***********************************/
        gridState.processors['data-calculate-row-identities'] = {
            watches: ['data', 'columns'],
            runs: function (options) {
                if (!options.model.ui.selectable && (!options.model.ui.actions || options.model.ui.actions.length === 0)) {
                    return;
                }
                var didChange = false;
        
                var identityColumns = options.model.columns.filter(function (col) {
                    return col.isIdentity;
                }).sort(function (colA, colB) {
                    return colA.id < colB.id ? -1 : 1;
                });
        
                options.model.data.forEach(function (row) {
                    var identity = identityColumns.reduce(function (total, col) {
                        return total + '_' + getCellData(row, col);
                    }, '');
                    var formattedIdentity = identity.replace(/[\s'".@+\-|]/g, '');
                    if (row.$identity !== formattedIdentity) {
                        didChange = true;
                    }
                    row.$identity = formattedIdentity;
                });
        
                if (options.model.logging && didChange) {
                    console.log('Row identities calculated');
                }
            }
        };
        
        function getCellData(row, col) {
            return row[col.id];
        }
        

        /* eslint no-unused-vars: 0 */
        
        /**********************/
        /** data check valid **/
        /**********************/
        gridState.processors['data-check-valid'] = {
            watches: ['data'],
            runs: function (options) {
                var valid = true;
                if (!Array.isArray(options.model.data)) {
                    valid = false;
                    options.model.data = [];
                }
        
                if (options.model.data.filter(notNullObject).length !== options.model.data.length) {
                    valid = false;
                }
        
                if (!valid) {
                    throw new Error('Data must be an array of non-null objects');
                }
            }
        };
        
        function notNullObject(row) {
            return row && typeof row === 'object';
        }
        

            /* eslint no-unused-vars: 0 */
        
        /****************************/
        /** Data Fetch Cell Values **/
        /****************************/
        gridState.processors['data-fetch-cell-values'] = {
            watches: ['data', 'columns'],
            runs: function (options) {
                var originalData = options.changed.data ? options.model.data : options.cache.data;
                options.cache.data = originalData;
        
                // Check to make sure this is a change worth updating for
                options.cache.dataAccessors = options.cache.dataAccessors || {};
                var columnsInOrder = JSON.stringify(options.model.columns.map(function (col) {
                    return col.id;
                }));
                var accessorsDiffer = options.model.columns.some(function (col) {
                    return col.dataAccessor !== options.cache.dataAccessors[col.id];
                });
                if (!options.changed.data && !accessorsDiffer && options.cache.lastColumns === columnsInOrder) {
                    // if the data is the same and the accessors or list of columns didn't change, then don't modify anything
                    return;
                }
                options.cache.lastColumns = columnsInOrder;
                options.model.columns.forEach(function (col) {
                    options.cache.dataAccessors[col.id] = col.dataAccessor;
                });
        
                if (options.model.logging) {
                    console.log('Fetching cell values');
                }
                
                var invalidDataAccessors = {};
        
                options.model.data = originalData.map(function (row) {
                    var temp = {};
                    for (var key in row) {
                        if (key[0] === '$') {
                            temp[key] = row[key];
                        }
                    }
                    options.model.columns.forEach(function (col) {
                        var value;
                        if (typeof col.dataAccessor === 'function') {
                            value = col.dataAccessor(row);
                        }
                        else {
                            value = row[col.dataAccessor];
                        }
                        temp[col.id] = value;
                        if ((value === undefined) && col.id[0] !== "$") {
                            invalidDataAccessors[col.id] = col.dataAccessor;
                        }
                    });
                    temp.raw = row;
                    return temp;
                });
                
                _.forIn(invalidDataAccessors, function(da, colId){
                    console.warn("DataAccessor for " + colId + " resulted in null or undefined:", da);
                });
            }
        };
        

            /* eslint no-unused-vars: 0 */
        
        /****************************/
        /** Data Aggregate Values  **/
        /****************************/
        gridState.processors['data-aggregate-values'] = {
            watches: ['filter', 'data'],
            runs: function (options) {
                var originalData = options.changed.data ? options.model.data : options.cache.data;
                options.cache.data = originalData;
        
                if (!options.model.filter || !options.model.filter['*']) {
                    // we don't need to aggregate the data as it's not being used right now
                    return;
                }
        
                if (options.model.data.length === 0) {
                    // there's no data
                    return;
                }
        
                if (!options.changed.data && options.model.data[0].$aggregate) {
                    // the data didn't change and we already made the aggregate so nothing to do
                    return;
                }
        
                if (options.model.logging) {
                    console.log('Aggregating the data to be used with the wildcard filter');
                }
        
                options.model.data = originalData.map(function (row) {
                    var temp = {};
                    for (var key in row) {
                        if (row.hasOwnProperty(key)) {
                            temp[key] = row[key];
                        }
                    }
                    var aggregate = [];
                    options.model.columns.forEach(function (col) {
                        aggregate.push(row[col.id]);
                    });
                    temp.$aggregate = aggregate.join(' | ').toLowerCase();
                    return temp;
                });
            }
        };
        

            /* eslint no-unused-vars: 0 */
        
        /****************************/
        /** Data to Lowercase  **/
        /****************************/
        gridState.processors['data-to-lowercase'] = {
            watches: ['filter', 'data'],
            runs: function (options) {
                var originalData = options.changed.data ? options.model.data : options.cache.data;
                options.cache.data = originalData;
        
                var hasKeys = false;
                for (var key in options.model.filter) {
                    hasKeys = true;
                    break;
                }
        
                if (!hasKeys) {
                    // we don't need to aggregate the data as it's not being used right now
                    return;
                }
        
                if (options.model.data.length === 0) {
                    // there's no data
                    return;
                }
        
                if (!options.changed.data && options.model.data[0].$lower) {
                    // the data didn't change and we already made the aggregate so nothing to do
                    return;
                }
        
                if (options.model.logging) {
                    console.log('Calculating the lowercase values of the cells to use with string filtering');
                }
        
                options.model.data = originalData.map(function (row) {
                    var temp = {};
                    var lower = {};
                    for (var key in row) {
                        if (row.hasOwnProperty(key)) {
                            temp[key] = row[key];
                            lower[key] = ('' + row[key]).toLowerCase();
                        }
                    }
                    temp.$lower = lower;
                    return temp;
                });
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************/
        /** Data Filter **/
        /*****************/
        gridState.processors['data-filter'] = {
            watches: ['filter', 'data'],
            runs: function (options) {
                var originalData = options.changed.data ? options.model.data : options.cache.data;
                options.cache.data = originalData;
        
                var hasKeys = false;
                for (var key in options.model.filter) {
                    hasKeys = true;
                    break;
                }
        
                if (options.model.logging && hasKeys) {
                    console.log('Filtering the data');
                }
        
                options.model.data = originalData.filter(applyFilters);
        
                function applyFilters(row) {
                    /* eslint no-bitwise: 0*/
                    var match = true;
                    for (var key in options.model.filter) {
                        if (key === '*') {
                            match &= applyFilter(row.$lower.$aggregate, options.model.filter[key]);
                        }
                        else {
                            match &= applyFilter(row.$lower[key], options.model.filter[key]);
                        }
                    }
                    return match;
                }
        
                function applyFilter(value, filter) {
                    if (typeof filter === 'string') {
                        return stringFilter(value, filter);
                    }
                    else if (typeof filter === 'function') {
                        return functionFilter(value, filter);
                    }
                    else if (typeof filter === 'object' && typeof filter.exec === 'function') {
                        return regexFilter(value, filter);
                    }
                    else {
                        throw new Error('Unrecognized fitler type');
                    }
                }
        
                function stringFilter(value, filter) {
                    return filter.split(/\s/).reduce(function (acc, token) {
                        return acc && value.indexOf(token) > -1;
                    }, true);
                }
        
                function regexFilter(value, filter) {
                    return !!filter.exec(value);
                }
                function functionFilter(value, filter) {
                    return !!filter(value);
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************/
        /** Data Paging **/
        /*****************/
        gridState.processors['data-paging'] = {
            watches: ['paging', 'data'],
            runs: function (options) {
                var paging = options.model.paging;
                var originalData = (options.changed.data ? options.model.data : options.cache.data) || [];
                options.cache.data = originalData;
        
                if (options.model.logging) {
                    console.log('Splitting data into pages');
                }
        
                var minIndex = paging.pageSize * (paging.currentPage - 1);
                var maxIndex = minIndex + paging.pageSize;
        
                maxIndex = Math.min(maxIndex, originalData.length); // the last page might have less than a full page of items
        
                options.model.paging.firstItem = minIndex + 1;
                options.model.paging.lastItem = maxIndex + 1 - 1; // converting from a 0-based index to a 1-based index, then
                                                                  // subtracting 1 because the last item is the one before the slice
        
                if (originalData.length === 0) {
                    options.model.paging.firstItem = 0;
                    options.model.paging.lastItemItem = 0;
                }
        
                options.model.paging.totalItems = originalData.length;
        
                options.model.paging.pageCount = Math.max(1, Math.ceil(originalData.length / paging.pageSize));
                options.model.data = originalData.slice(minIndex, maxIndex);
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /**************************/
        /** Data row is selected **/
        /**************************/
        gridState.processors['data-row-is-selected'] = {
            watches: ['data', 'selection'],
            runs: function (options) {
                if (!options.model.ui.selectable) {
                    return;
                }
                var didChange = false;
                options.model.data.forEach(function (row) {
                    var newValue = !!options.model.selection[row.$identity];
                    if (row.isSelected !== newValue) {
                        if (!row.isSelected !== !newValue) {
                            didChange = true;
                        }
                        row.isSelected = newValue;
                    }
                });
        
                if (options.model.logging && didChange) {
                    console.log('Updating row selection');
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /****************************/
        /** Data row is selectable **/
        /****************************/
        gridState.processors['data-row-is-selectable'] = {
            watches: ['data', 'ui'],
            runs: function (options) {
                if (!options.model.ui.selectable) {
                    return;
                }
                var checkRowSelectability = options.model.ui.rowIsSelectable;
                var didChange = false;
                options.model.data.forEach(function (row) {
                    var newValue = !!(checkRowSelectability ? checkRowSelectability(row) : true);
                    if (row.isSelectable !== newValue) {
                        didChange = true;
                        row.isSelectable = newValue;
                    }
                });
        
                if (options.model.logging && didChange && checkRowSelectability) {
                    console.log('Updating individual row selectability');
                }
            }
        };
        

            /* eslint no-unused-vars: 0 */
        
        /***************/
        /** Data Sort **/
        /***************/
        gridState.processors['data-sort'] = {
            input: 'sortFunctions',
            watches: ['sort', 'data'],
            runs: function (options) {
                var originalData = options.changed.data ? options.model.data : options.cache.data;
                options.cache.data = originalData;
        
                if (options.model.logging) {
                    console.log('Sorting the data');
                }
        
                var sort = options.model.sort;
                var columnsById = options.model.columnsById;
        
                options.model.data = sort.length === 0 ? originalData : originalData.slice().sort(function (rowA, rowB) {
                    for (var i = 0; i < sort.length; i++) {
                        var criteria = sort[i];
                        var column = columnsById[criteria.sortBy];
                        if (!column) {
                            console.warn("Tried to sort on a column that wasn't present in the data", criteria.sortBy);
                            continue;
                        }
                        var sortFn = column.sortFunction || gridState.sortFunctions[column.type];
                        if (!sortFn) {
                            console.warn('No comparator available for the specified column type, using generic compare', column.type);
                            sortFn = gridState.sortFunctions.generic;
                        }
                        var valueA = rowA[column.id];
                        var valueB = rowB[column.id];
                        var result = sortFn(valueA, valueB);
                        if (result !== 0) {
                            return criteria.sortAsc ? result : 0 - result;
                        }
                    }
                    return 0;
                });
            }
        };
        
        function genericCompare(valueA, valueB) {
            if (valueA === valueB) {
                return 0;
            }
            else {
                return valueA < valueB ? -1 : 1;
            }
        }
        
        gridState.sortFunctions = {
            generic: genericCompare,
            text: genericCompare
        };
        
        

        /* eslint no-unused-vars: 0 */
        
        /*********************/
        /** Fetch-Data Init **/
        /*********************/
        gridState.processors['fetch-data-init'] = {
            input: ['data', 'time'],
            watches: 'data',
            runs: function (options) {
                if (typeof options.model.data === 'function') {
                    var theLoadDataFunction = options.model.data;
                    options.model.data = [];
                    options.model.time.dataFunctionChanged = Date.now();
        
                    options.model.processors['fetch-data'] = {
                        watches: 'time',
                        runs: function (pipelineArgs) {
                            return Promise.resolve(theLoadDataFunction()).then(function (data) {
                                options.model.data = data;
                            });
                        }
                    };
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /***************/
        /** Log Done **/
        /***************/
        gridState.processors['log-done'] = function (options) {
            if (options.model.logging) {
                console.log('Final grid state', JSON.parse(JSON.stringify(options.model, filterUninterestingProperties)));
                console.groupEnd();
            }
        };
        
        
        function filterUninterestingProperties(key, value) {
            if (key === 'data') {
                return undefined;
            }
            if (key === 'processors') {
                return undefined;
            }
            if (key === 'vm') {
                return undefined;
            }
            if (key === 'columnsById') {
                return undefined;
            }
            if (key === 'data_ChangeMode') {
                return undefined;
            }
            if (key === 'logging') {
                return undefined;
            }
            return value;
        }
        

        /* eslint no-unused-vars: 0 */
        
        /***************/
        /** Log Start **/
        /***************/
        gridState.processors['log-start'] = {
            input: 'logging',
            runs: function (options) {
                if (options.model.logging) {
                    console.group('Processing grid state change');
                    var whatChanged = JSON.stringify(options.model.lastInput, filterUninterestingProperties);
                    if (whatChanged.length === 2) {
                        whatChanged = JSON.stringify(options.model.lastInput);
                    }
                    console.log('Applying change', JSON.parse(whatChanged));
                }
            } };
        
        
        function filterUninterestingProperties(key, value) {
            if (key === 'data') {
                return undefined;
            }
            if (key === 'processors') {
                return undefined;
            }
            if (key === 'vm') {
                return undefined;
            }
            if (key === 'columnsById') {
                return undefined;
            }
            if (key === 'data_ChangeMode') {
                return undefined;
            }
            if (key === 'logging') {
                return undefined;
            }
            return value;
        }
        

        /* eslint no-unused-vars: 0 */
        
        /************************/
        /** Paging Check Valid **/
        /************************/
        gridState.processors['paging-check-valid'] = {
            watches: ['paging', 'data'],
            runs: function (options) {
                var paging = options.model.paging;
                var data = options.model.data || [];
                var didChange = false;
                if (paging.pageSize < 1 || isNaN(paging.pageSize)) {
                    paging.pageSize = 1;
                    didChange = true;
                }
                if (options.changed.data) {
                    paging.pageCount = Math.ceil(Math.max(1, data.length / paging.pageSize));
                    didChange = true;
                }
                if (paging.currentPage < 1 || isNaN(paging.currentPage)) {
                    paging.currentPage = 1;
                    didChange = true;
                }
                else if (paging.currentPage > paging.pageCount) {
                    paging.currentPage = Math.max(1, paging.pageCount);
                    didChange = true;
                }
                if (options.model.logging && didChange) {
                    if (options.changed.data) {
                        console.log('Data changed, Pagination options updated');
                    }
                    else {
                        console.log('Pagination options were invalid and have been updated');
                    }
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************************************************/
        /** Paging Filter changes should reset current page **/
        /*****************************************************/
        gridState.processors['paging-filter-change-resets-currentpage'] = {
            watches: ['filter'],
            runs: function (options) {
                if (!options.cache.ranOnce) {
                    options.cache.ranOnce = true;
                    return;
                }
        
                options.model.paging.currentPage = 1;
                if (options.model.logging) {
                    console.log('Filter changed so the currentPage was reset');
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*******************************************************/
        /** paging Pagesize changes should reset current page **/
        /*******************************************************/
        gridState.processors['paging-pagesize-change-resets-currentpage'] = {
            watches: ['paging'],
            runs: function (options) {
                if (!options.cache.ranOnce) {
                    options.cache.ranOnce = true;
                    options.cache.pageSize = options.model.paging.pageSize;
                    return;
                }
        
                var paging = options.model.paging;
                var before = options.cache.pageSize;
                var now = paging.pageSize;
        
                if (before !== now) {
                    options.cache.pageSize = now;
                    paging.currentPage = 1;
                    if (options.model.logging) {
                        console.log('Pagesize changed so the currentPage was reset');
                    }
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /***************************************************/
        /** paging sort changes should reset current page **/
        /***************************************************/
        gridState.processors['paging-sort-change-resets-currentpage'] = {
            watches: ['sort'],
            runs: function (options) {
                if (!options.cache.ranOnce) {
                    options.cache.ranOnce = true;
                    return;
                }
                options.model.paging.currentPage = 1;
                if (options.model.logging) {
                    console.log('sort changed so the currentPage was reset');
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** Selection Disable Multi-page **/
        /*****************************/
        gridState.processors['selection-disable-multi-page'] = {
            watches: ['data', 'selection'],
            runs: function (options) {
                if (options.model.ui.selectable) {
                    var rowsPresent = {};
                    options.model.data.forEach(function (row) {
                        rowsPresent[row.$identity] = true;
                    });
        
                    var toBeRemoved = [];
        
                    for (var key in options.model.selection) {
                        if (!rowsPresent[key] && key !== 'all') {
                            toBeRemoved.push(key);
                        }
                    }
        
                    if (toBeRemoved.length > 0 && options.model.logging) {
                        console.log('Removing selected rows which are not present on the current page');
                    }
        
                    toBeRemoved.forEach(function (keyToRemove) {
                        delete options.model.selection[keyToRemove];
                    });
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /**************************/
        /** Selection Select All **/
        /**************************/
        gridState.processors['selection-select-all'] = {
            watches: ['selection', 'data'],
            runs: function (options) {
                var all = options.model.selection.all;
                if (typeof all !== 'boolean') {
                    delete options.model.selection.all;
                    return;
                }
                if (all) {
                    if (options.model.logging) {
                        console.log('Applying select all');
                    }
                    options.model.data.forEach(function (row) {
                        options.model.selection[row.$identity] = true;
                    });
                    delete options.model.selection.all;
                }
                else {
                    if (options.model.logging) {
                        console.log('Clearing all selected rows');
                    }
                    options.model.selection = {};
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** Selection Select Single **/
        /*****************************/
        gridState.processors['selection-select-single'] = {
            watches: ['selection', 'data'],
            runs: function (options) {
                var single = options.model.ui.selectMode !== 'multi';
                if (single) {
                    var selectedArray = [];
                    var lastTime = options.cache.selected || [];
                    for (var key in options.model.selection) {
                        if (options.model.selection[key]) {
                            selectedArray.push(key);
                        }
                    }
                    if (selectedArray.length > 1) {
                        if (options.model.logging) {
                            console.log('Applying select single');
                        }
                        var removeThis = function (old) {
                            var index = selectedArray.indexOf(old);
                            if (index !== -1) {
                                selectedArray.splice(index, 1);
                            }
                            delete options.model.selection[old];
                        };
                        // remove the previous selection
                        lastTime.forEach(removeThis);
                        // if we're still over the limit then effectively remove randomly until 1 item selected
                        if (selectedArray.length > 1) {
                            selectedArray.splice(0, selectedArray.length - 1).forEach(removeThis);
                        }
                    }
                    options.cache.selected = selectedArray;
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /***********************/
        /** Time Last Updated **/
        /***********************/
        gridState.processors['time-last-updated'] = {
            watches: 'data',
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Data changed, recording the time of the update');
                }
        
                options.model.time.lastFetch = Date.now();
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*******************************/
        /** ui export selected rows **/
        /*******************************/
        gridState.processors['ui-export-selected-rows'] = {
            watches: ['selection', 'data'],
            runs: function (options) {
                var selectedRows = options.model.data.filter(function (row) {
                    return row.isSelected;
                }).map(function (row) {
                    return row.raw;
                });
                var didReplace = options.model.ui.selectedData && options.model.ui.selectedData.length > 0;
                options.model.ui.selectedData = selectedRows;
        
                if (options.model.logging && options.model.ui.selectable) {
                    if (selectedRows.length > 0) {
                        console.log('Exporting selected rows');
                    }
                    else if (didReplace) {
                        console.log('Clearing selected rows from the exported state');
                    }
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*******************************/
        /** UI Selected all indicator **/
        /*******************************/
        gridState.processors['ui-selected-all-indicator'] = {
            watches: ['selection', 'data'],
            runs: function (options) {
                var allSelected = !findFirst(options.model.data, { isSelected: false });
        
                options.model.ui.allSelected = allSelected;
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*******************************/
        /** UI Selected Count **/
        /*******************************/
        gridState.processors['ui-selected-count'] = {
            watches: ['selection', 'data'],
            runs: function (options) {
                var didChange = false;
                var count = 0;
                for (var key in options.model.selection) {
                    if (key !== 'all' && options.model.selection[key]) {
                        count++;
                    }
                }
                didChange = (options.model.ui.selectedCount || 0) !== count;
                options.model.ui.selectedCount = count;
        
                if (options.model.logging && options.model.ui.selectable && didChange) {
                    console.log('Updating the selection count');
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /**************************/
        /** UI Animate on change **/
        /**************************/
        gridState.processors['ui-animate-on-change'] = {
            watches: ['paging','space','columns'],
            init: function(model){
                model.ui = model.ui || {};
                model.ui.animationEnabled = ko.observable(false);
            },
            runs: function (options) {
                options.model.ui.animationEnabled(true);
                
                if (options.cache.lastTimeout) {
                    clearTimeout(options.cache.lastTimeout);
                }
                
                options.cache.lastTimeout = setTimeout(function(){
                    options.model.ui.animationEnabled(false);
                }, 500)
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /***********************/
        /** vm Container Size **/
        /***********************/
        gridState.processors['vm-container-size'] = {
            init: function (model) {
                model.vm.size = ko.observable();
        
                ko.computed(function () {
                    var previous = model.space ? model.space.width : undefined;
                    
                    var size = model.vm.size();
                    if (size && size.width !== previous) {
                        model.vm.process({ space: size });
                    }
                });
            },
            runs: function () {
                // noop
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        var selectedObservables = {};
        
        /******************************/
        /** vm-Handlebars: data **/
        /******************************/
        gridState.processors['vm-handlebars-data'] = {
            watches: ['data', 'selection', 'ui', 'columns', 'space'],
            init: function (model) {
                if (!model.vm.data) {
                    model.vm.data = ko.observableArray();
                    model.vm.data.loaded = ko.observable(false);
                    model.vm.hb_tbody = ko.observable('');
                }
            },
            runs: function (options) {
                if (!options.model.space || !options.model.space.width) {
                    return;
                }
                options.cache.templates = options.cache.templates || {};
        
                if (options.model.logging) {
                    console.log('Updating the grid content using Handlebar templates');
                }
        
                if (!options.cache.namespace) {
                    options.cache.namespace = 'NSSG_' + Math.floor(Math.random() * 99999);
                    options.cache.jsContext = {};
                    window[options.cache.namespace] = options.cache.jsContext;
                }
        
                options.cache.jsContext.toggleSelect = function (rowIdentity, e) {
                    var isSelected = !!options.model.selection[rowIdentity];
                    // if (options.model.logging) {
                        // console.log('Setting ' + rowIdentity + ' to ' + (!isSelected ? 'selected' : 'deselected'));
                    // }
        
                    var rowSelect = {};
                    rowSelect[rowIdentity] = !isSelected;
                    setTimeout(function () {
                        options.model.vm.process({ selection: rowSelect, ui: { alreadyUpdatedSelection: true } });
                        if (e) {
                            $('input', $(e).parent()).prop('checked', !isSelected);
                        }
                    }, 1);
                    if (options.model.ui.selectMode === 'single') {
                        for (var key in options.model.selection) {
                            if (options.model.selection.hasOwnProperty(key)) {
                                var id = options.cache.namespace + '_' + key;
                                var $row = $('#' + id);
                                var $select = $('.nssg-td-select input', $row);
                                $select.prop('checked', false);
                            }
                        }
                    }
                };
        
                options.cache.jsContext.invokeAction = function (rowIdentity, index) {
                    var action = options.model.ui.actions[index];
                    var row = findFirst(options.model.data, { $identity: rowIdentity });
                    if (action && row) {
                        if (action.onClick) {
                            action.onClick(row.raw);
                        }
                    }
                    else {
                        console.warn("action or row data couldn't be matched");
                    }
                };
        
                var templateParts = [];
                templateParts.push('{{#each data as |row key|}}');
                templateParts.push("<tr class='nssg-tbody-tr' id='" + options.cache.namespace + "_{{$identity}}'>");
                templateParts = templateParts.concat(options.model.columns.map(function (col) {
                    if (!col.isVisible) {
                        return '';
                    }
                    if (templates[col.type + '_hb'] === undefined){
                        console.error("Body Column type "+ col.type+" is not defined for handlebars, defaulting to text");
                        col.type = "text";
                    }
                    return "<td class='nssg-td nssg-td-" + col.type + "'>" +
                        templates[col.type + '_hb'].replace(/\{\{value/g, '{{' + col.id) +
                        '</td>';
                }));
                templateParts.push("<td class='nssg-td nssg-td-gutter'></td>");
                templateParts.push('</tr>');
                templateParts.push('{{/each}}');
                var template = templateParts.join('\n');
                var compiledTemplate = options.cache.templates[template];
                if (!compiledTemplate) {
                    compiledTemplate = Handlebars.compile(template);
                    options.cache.templates[template] = compiledTemplate;
                }
        
                var actions = options.model.ui.actions ? options.model.ui.actions.map(function (action, index) {
                    return { css: action.css, index: index, tooltip: action.tooltip };
                }) : [];
                var context = {
                    jsContext: options.cache.namespace,
                    data: options.model.data,
                    actions: actions
                };
        
                if (!options.model.lastInput.ui || !options.model.lastInput.ui.alreadyUpdatedSelection) {
                    var compiledHtml = compiledTemplate(context);
                    options.model.runAfter.push({id:'vm-handlebars-data',fnRef:function(){
                        options.model.vm.hb_tbody(compiledHtml);
                    }});
                }
                else {
                    console.log('skipping the update dom step since the dom should already be up to date');
                }
        
                if (!options.model.vm.data.loaded.peek()) {
                    setTimeout(function () {
                        options.model.vm.data.loaded(true);
                    }, 100);
                }
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /***************************/
        /** UI Columns Performance **/
        /***************************/
        gridState.processors['ui-columns-performance'] = {
            watches: ['paging'],
            init: function(model){
                model.ui["columns-use-handlebars"] = ko.observable(false);
            },
            runs: function (options) {
                var useHandlebars = options.model.paging.pageSize > 100;
                var didChange = options.model.ui["columns-use-handlebars"]() !== useHandlebars;
                options.model.ui["columns-use-handlebars"](useHandlebars);
                options.model.processors["ui-columns"] = useHandlebars ? "ui-handlebar-columns" : "ui-ko-columns";
                
                var description = useHandlebars?"handlebars (faster performance)":"knockout (animations enabled)";
                if (options.cache.didRunOnce && didChange) {
                    console.log("Pagesize crossed 100 items/page threshold; Header row will now use " + description);
                } else if (!options.cache.didRunOnce) {
                    console.log("Header row will use "+ description);
                }
                options.cache.didRunOnce = true;
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*********************************/
        /** UI Columns Performance Once **/
        /*********************************/
        gridState.processors['ui-columns-performance-once'] = {
            watches: ['sort', 'columns', 'space'],
            init: function(model){
                model.processors['ui-columns-performance-once-runner'] = [];
            },
            runs: function (options) {
                if (!options.model.space || !options.model.space.width) {
                    return;
                }
                var runOnce = [];
                if (!options.model.vm.columns || !options.model.vm.columns() || options.model.vm.columns().length !== options.model.columns.length)
                {
                    console.log("Running vm-update-bindings-columns once");
                    runOnce.push('vm-update-bindings-columns');
                }
                if (!options.model.vm.hb_columns || !options.model.vm.hb_columns())
                {
                    console.log("Running vm-handlebars-columns once");
                    runOnce.push('vm-handlebars-columns');
                }
                options.model.processors['ui-columns-performance-once-runner'] = runOnce;
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /**********************************/
        /** UI Flag pipeline is finished **/
        /**********************************/
        gridState.processors['ui-flag-pipeline-is-finished'] =
        function (options) {
            clearTimeout(options.model.timers.running);
            options.model.ui.running(false);
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*********************************/
        /** UI Flag pipeline is running **/
        /*********************************/
        gridState.processors['ui-flag-pipeline-is-running'] = function (options) {
            options.model.timers = options.model.timers || {};
            options.model.ui = options.model.ui || {};
            options.model.ui.running = options.model.ui.running || ko.observable(false);
            options.model.timers.running = setTimeout(function() {
                options.model.ui.running(true);
            }, options.model.ui.showSpinnerDelay);
        };
        

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
                        var compiledHtml = compiledTemplate(context);
                        options.model.runAfter.push({id:'vm-handlebars-columns', fnRef:function(){
                            options.model.vm.hb_columns(compiledHtml);
                        }});
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
        

        /* eslint no-unused-vars: 0 */
        
        /********************************/
        /** vm-Update Bindings: colums **/
        /********************************/
        gridState.processors['vm-update-bindings-columns'] = {
            watches: ['sort', 'columns', 'space'],
            init: function (model) {
                model.vm.columns = ko.observableArray();
            },
            runs: function (options) {
                if (!options.model.space || !options.model.space.width) {
                    return;
                }
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
        
                if (options.model.logging && didChange) {
                    console.log('Updating the column bindings');
                }
        
                options.model.runAfter.push({id:'vm-update-bindings-column',fnRef:function(){
                    options.model.vm.columns(temp);
                }});
            }
        };
        
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
        

        /* eslint no-unused-vars: 0 */
        
        var selectedObservables = {};
        
        /******************************/
        /** vm-Update Bindings: data **/
        /******************************/
        gridState.processors['vm-update-bindings-data'] = {
            watches: ['data', 'selection'],
            init: function (model) {
                if (!model.vm.data) {
                    model.vm.data = ko.observableArray();
                    model.vm.data.loaded = ko.observable(false);
                }
            },
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Updating the grid content using Knockout templates');
                }
        
                var uiData = options.model.data.slice();
                uiData.forEach(function (row, index) {
                    var clone = JSON.parse(JSON.stringify(row));
                    uiData[index] = clone;
        
                    var obs = selectedObservables[row.$identity];
                    if (!obs) {
                        obs = ko.observable();
                        obs.readonly = readonly(obs);
                        selectedObservables[row.$identity] = obs;
                    }
        
                    clone.isSelected = obs.readonly;
                    if (obs.peek() !== row.isSelected) {
                        obs(row.isSelected);
                    }
        
                    clone.toggleSelection = function (grid) {
                        var togglerOptions = { selection: {} };
                        togglerOptions.selection[row.$identity] = !row.isSelected;
                        return wrappedProcess(grid, togglerOptions);
                    };
                });
        
                if (options.changed.data || !options.cache.didRunOnce) {
                    options.model.runAfter.push({id:'vm-update-bindings-data',fnRef:function(){
                        options.model.vm.data(uiData);
                        options.model.vm.data.loaded(true);
                    }});
                    options.cache.didRunOnce = true;
                }
            }
        };
        
        function readonly(obs) {
            return ko.pureComputed(function () {
                return obs();
            });
        }
        
        function wrappedProcess(grid, options) {
            return function () {
                grid.process(options);
                return true;
            };
        }
        

        /* eslint no-unused-vars: 0 */
        
        /***********************************/
        /** vm-Update Bindings: gridState **/
        /***********************************/
        gridState.processors['vm-update-bindings-grid-state'] = {
            init: function (model) {
                model.vm.gridState = ko.observable();
            },
            runs: function (options) {
                options.model.runAfter.push({id:'vm-update-bindings-grid-state',fnRef:function(){
                    options.model.vm.gridState(options.model);
                }});
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** vm-Update Bindings: paging **/
        /*****************************/
        gridState.processors['vm-update-bindings-paging'] = {
            watches: 'paging',
            init: function (model) {
                model.vm.paging = ko.observable({});
            },
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Updating the page bindings');
                }
                options.model.runAfter.push({id:'vm-update-bindings-paging',fnRef:function(){
                    options.model.vm.paging(options.model.paging);
                }});
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** vm Update Bindings: ui **/
        /*****************************/
        gridState.processors['vm-update-bindings-ui'] = {
            watches: 'ui',
            init: function (model) {
                model.vm.ui = ko.observable({});
            },
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Updating the ui specific bindings');
                }
                var ui = options.model.ui;
                var clone = {};
                deepReplace(clone, ui);
        
                if (!options.cache.allSelected) {
                    options.cache.allSelected = ko.observable();
                }
                clone.allSelected = options.cache.allSelected;
                if (clone.allSelected.peek() !== ui.allSelected) {
                    clone.allSelected(ui.allSelected);
                }
                
                options.model.runAfter.push({id:'vm-update-bindings-ui',fnRef:function(){
                    options.model.vm.ui(clone);
                }});
            }
        };
        

        /* eslint no-unused-vars: 0 */
        
        /******************/
        /** ko run after **/
        /******************/
        gridState.processors['run-after'] = {
            init: function (model) {
                model.runAfter = [];
            },
            runs: function (options) {
                var temp = options.model.runAfter;
                var perf = {};
                temp.forEach(function(req){
                    try{
                        var before = performance.now();
                        req.fnRef();
                        var after = performance.now();
                        perf[req.id] = after - before;
                    }
                    catch(err){
                        console.error(err);
                    }
                });
                console.log("Run after performance: ", perf);
                options.model.runAfter = [];
            }
        };
        



    }
    /* eslint no-unused-vars: 0 */
    
    /*************************/
    /** Initial Grid State  **/
    /*************************/
    
    function createInitialGridState() {
        var gridState = {
            filter: {},
            // {
            //    'name': 'potato salad',  //also matches 'salad potato' and 'sweet potato and turnip salad'
            //    'description': /this is rejex/, applies the regex on the column
            //    '*'   : 'creamy coleslaw',  each word occurs in any column, order doesn't matter
            // }
            sort: [
            // { sortBy: '', sortAsc: true }
            ],
            columns: [
                // {
                //    id: '',
                //    isIdentity: '',
                //    type: ''
                //    visible: true,
                //    isSortable: true,
                //    isSorted: true,
                //    isSortedAsc: true,
                //    isResizable: true,
                //    width: 0,
                //    min-width: 0,
                //    max-width: 0,
                //    header: ''
                //    dataAccessor: '' || function(){}
                // }
            ],
            logging: true,
            paging: {
                pageSize: 100,
                pageCount: 1,
                currentPage: 1
            },
            selection: {
                // rowid67: true
            },
            time: {
                lastRefreshRequest: new Date(),
                lastFetch: new Date()
            },
            space: {
                width: 0,
                height: 0
            },
            ui: {
                allowResizing: true,
                allowSorting: true,
                showSpinnerDelay: 1000
            },
            data: [],
            data_ChangeMode: 'Identity',
            processors: {
                start: ['log-start', 'pre-process', 'process', 'post-process', 'run-after', 'log-done'],
                'pre-process': [
                    'ui-flag-pipeline-is-running',
                    'fetch-data-init',
                    'columns-enable-selection-column',
                    'columns-enable-actions-column',
                    'vm-container-size',
                    'columns-check-valid',
                    'columns-index-by-id',
                    'paging-filter-change-resets-currentpage',
                    'paging-sort-change-resets-currentpage',
                    'filter-check-valid',
                    'pre-process-vm'
                ],
                process: 'local',
                local: [
                    { watches: 'time', runs: 'fetch-data' },
                    'time-last-updated',
                    'data-check-valid',
                    'data-fetch-cell-values',
                    'data-aggregate-values',
                    'data-to-lowercase',
                    'data-filter',
                    'data-sort',
                    'paging-check-valid',
                    'paging-pagesize-change-resets-currentpage',
                    'data-paging'
                ],
                remote: [
                    'paging-pagesize-change-resets-currentpage',
                    { watches: ['time', 'sort', 'filter', 'paging', 'columns'], runs: 'fetch-data' },
                    'time-last-updated',
                    'data-check-valid',
                    'data-fetch-cell-values'
                ],
                'post-process': [
                    'post-process-vm',
                    'ui-animate-on-change',
                    'columns-sort-indicators',
                    'data-calculate-row-identities',
                    'selection-select-all',
                    'selection-select-single',
                    'selection-disable-multi-page',
                    'data-row-is-selected',
                    'data-row-is-selectable',
                    'ui-selected-all-indicator',
                    'ui-selected-count',
                    'ui-export-selected-rows',
                    'columns-apply-min-max-width',
                    'columns-redistribute-space',
                    'ui-columns-performance',
                    'ui-columns',
                    'vm-update-bindings-paging',
                    'vm-update-bindings-ui',
                    'vm-update-bindings-grid-state',
                    'vm',
                    'ui-columns-performance-once',
                    'ui-columns-performance-once-runner',
                    'ui-flag-pipeline-is-finished'
                ],
                vm: [],
                'use-handlebars': 'vm-handlebars-data',
                'use-knockout': 'vm-update-bindings-data',
                'ui-columns': 'ui-ko-columns',
                'ui-handlebar-columns': 'vm-handlebars-columns',
                'ui-ko-columns': 'vm-update-bindings-columns',
                'pre-process-vm': [],
                'post-process-vm': [],
                'fetch-data': function () {
                    throw new Error("Grids must specifiy a 'fetch-data' function or override the definition of 'process'");
                },
                'columns-redistribute-space': 'columns-redistribute-space-to-rightmost-visible'
                /* [
                    'columns-lock-columns-user-just-resized',
                    'columns-redistribute-space-equally',
                    'columns-unlock-columns-user-just-resized',
                ]*/
    
            }
        };
        AddInitialProcesses(gridState);
        return gridState;
    }
    

    /* eslint no-unused-vars :0 */
    
    /**********************/
    /**    GRID CLASS    **/
    /**********************/
    var Grid = function (userOptions) {
        var didInitSymbol = Symbol('did run init');
    
        var internalVM = {};
    
        var inputPipeline = PipelineFactory.create();
        inputPipeline.processors.process = processInput;
    
        var pipeline = PipelineFactory.create();
    
        var gridState = createInitialGridState();
        gridState.vm = internalVM;
        internalVM.process = process;
    
        checkInit();
    
        if (userOptions) {
            internalVM.ready = process(userOptions);
        }
        return internalVM;
        // //////////////////
    
        function extendProperty(target, source, propName) {
            var rootValue = source[propName];
            if (Array.isArray(rootValue)) {
                target[propName] = rootValue;
            }
            else if (typeof rootValue === 'object') {
                if (!target[propName]) {
                    target[propName] = {};
                }
                deepReplace(target[propName], source[propName]);
            }
            else if (typeof rootValue === 'undefined') {
                // do nothing
            }
            else {
                target[propName] = rootValue;
            }
        }
    
        function checkInit() {
            for (var key in gridState.processors) { // eslint-disable-line guard-for-in
                var processor = gridState.processors[key];
                if (typeof processor.init === 'function' && !processor[didInitSymbol]) {
                    processor[didInitSymbol] = true;
                    try {
                        processor.init(gridState);
                    }
                    catch (err) {
                        console.error('Error during grid processor initialization', err);
                    }
                }
            }
        }
    
        function getImportedProperties() {
            var allProcessors = objectValues(gridState.processors);
            var inputs = allProcessors.map(function (processor) {
                return processor.input;
            }).filter(isTruthy);
            var watches = allProcessors.map(function (processor) {
                return processor.watches;
            }).filter(isTruthy);
            var propertiesInArrays = inputs.concat(watches).map(arrayify);
            var properties = propertiesInArrays.reduce(function (all, arr) {
                return all.concat(arr);
            }, []);
            // this is a meta property that won't actually occur
            // in the grid processors but is important regardless
            properties.push('processors');
            var uniqueProperties = unique(properties);
    
            return uniqueProperties;
        }
    
        function process(options) {
            return inputPipeline.process({ inner: options }, 'process');
        }
        function processInput(outerOptions) {
            var options = outerOptions.model.inner;
    
            // re-run the init in case any processors got added/replaced since the last run
            checkInit();
    
            // Pull in only the recognized properties to discourage
            // devs from trying to hack the grid again
            getImportedProperties().forEach(function (property) {
                extendProperty(gridState, options, property);
            });
    
            pipeline.debug = gridState.logging;
    
            gridState.lastInput = options;
            return pipeline.process(gridState, 'start');
        }
    
        // ///////////////////
    };
    

    /***********************/
    /**     PAGER CLASS   **/
    /***********************/
    
    /**
     * Pager Class Constructor
     * This class behaves like a service, offering paging management.
     * @param {Object} options - An object of options to configure the service
     * @param {ObservableArray} data - The array of data to be paged
     */
    Grid.Pager = function (options, gridVM) {
        window.doRegisterPaging();
    
        var self = this;
        // Options
        this.enabled = ko.observable(true);
        this.pageSizes = propertyAsObservable(gridVM.ui, 'pageSizes');
        this.maxPageIndex = propertyAsObservable(gridVM.paging, 'pageCount');
        this.firstItem = propertyAsObservable(gridVM.paging, 'firstItem');
        this.lastItem = propertyAsObservable(gridVM.paging, 'lastItem');
        this.totalItems = propertyAsObservable(gridVM.paging, 'totalItems');
        this.currentPageIndex = ko.pureComputed({
            read: function () {
                return gridVM.paging().currentPage;
            },
            write: function (newValue) {
                var page = parseInt(newValue);
                if (isNaN(page)) {
                    page = 1;
                }
                gridVM.process({ paging: { currentPage: page } });
            }
        });
        this.pageSize = ko.pureComputed({ read: function () {
            return gridVM.paging().pageSize;
        },
            write: function (newValue) {
                //Sometimes the value gets set while the control is in a weird state
                //this doesn't fix that issue, but it prevents the incorrect values from
                //propogating back into the grid.
                //Todo: investigate ko select not initializing correctly
                if (!newValue) {
                    self.pageSize.racing = true;
                    setTimeout(function() {
                        self.pageSize.racing = false
                    },50);
                }
                if (self.pageSize.racing){
                    return;
                }
                gridVM.process({ paging: { pageSize: newValue } });
            } });
    
        // UI Variables
        this.currentPageIndexUI = ko.observable; // Notify always so currentPageIndexUI re-evaluates after invalid values are entered
    
        /*****************************/
        /**     PRIVATE FUNCTIONS   **/
        /*****************************/
    
        /**
         * Goes to the page requested
         * Protects against invalid values
         */
        this.goToPage = function (pageIndex) {
            gridVM.process({ paging: { currentPage: pageIndex } });
        };
    
        /**
         * Goes to the first page
         */
        this.goToFirstPage = function () {
            this.goToPage(0);
        };
    
        /**
         * Goes to the last page
         */
        this.goToLastPage = function () {
            this.goToPage(gridVM.paging().pageCount);
        };
    
        /**
         * Goes to the prev page (if possible)
         */
        this.goToPrevPage = function () {
            this.goToPage(gridVM.paging().currentPage - 1);
        };
    
        /**
         * Goes to the next page (if possible)
         */
        this.goToNextPage = function () {
            this.goToPage(gridVM.paging().currentPage + 1);
        };
    
        this.refresh = function () {
            gridVM.process({ time: { refresh: Date.now() } });
        };
    };
    
    function propertyAsObservable(obs, prop) {
        return ko.pureComputed(function () {
            var unwrapped = ko.unwrap(obs);
            return unwrapped ? unwrapped[prop] : undefined;
        });
    }
    

    /****************************/
    /**     CUSTOMIZER CLASS   **/
    /****************************/
    var gridCustomizer; // eslint-disable-line no-unused-vars
    gridCustomizer = function (baseOptions, baseInitializer) {
        return function CustomizedGrid(overrideOptions, overrideInitializer) {
            var realOptions = {};
            var result;
    
            return loadBaseOptions()
                .then(loadOverrideOptions)
                .then(addTemplates)
                .then(function () {
                    result = new Grid(realOptions);
                    return result.ready;
                })
                .then(function () {
                    return result;
                })
                .catch(function (err) {
                    console.error('Failed to initialize grid', (err && err.message ? err.message : err));
                });
            // //////////////////////
    
            function loadBaseOptions() {
                deepReplace(realOptions, baseOptions);
                if (typeof baseInitializer === 'function') {
                    baseInitializer(realOptions);
                }
                return loadAllDependencies(realOptions);
            }
            function loadOverrideOptions() {
                deepReplace(realOptions, overrideOptions);
                if (typeof overrideInitializer === 'function') {
                    overrideInitializer(realOptions);
                }
            }
            function addTemplates() {
                deepReplace(templates, realOptions.templates);
            }
        };
    };
    
    function loadAllDependencies(options) {
        var initPromises = [];
        walkObject(options, isPromise, function (value, key, obj) {
            initPromises.push(value.then(function (resolvedValue) {
                obj[key] = resolvedValue; // eslint-disable-line no-param-reassign
            }));
        });
    
        return Promise.all(initPromises);
    }
    


    /**********************/
    /**     COMPONENTS   **/
    /**********************/
    ko.components.register('newgrid', {
        viewModel: {
            createViewModel: function (params) {
                var vm = typeof params.vm === "function" ? params.vm() : params.vm;
                vm.process({processors:{vm:"use-handlebars"}});
                return params.vm;
            }
        },
        template: templates.grid_hb
    });
    

    ko.components.register('newgrid-hb', {
        viewModel: {
            createViewModel: function (params) {
                var vm = typeof params.vm === "function" ? params.vm() : params.vm;
                vm.process({processors:{vm:"use-handlebars"}});
                return params.vm;
            }
        },
        template: templates.grid_hb
    });
    

    ko.components.register('newgrid-ko', {
        viewModel: {
            createViewModel: function (params) {
                var vm = typeof params.vm === "function" ? params.vm() : params.vm;
                vm.process({processors:{vm:"use-knockout"}});
                return params.vm;
            }
        },
        template: templates.grid
    });
    

    window.doRegisterPaging = function () {
        ko.components.register('newgrid-paging', {
            viewModel: {
                createViewModel: function (params) {
                    return params.vm;
                }
            },
            template: templates.paging
        });
    
        window.doRegisterPaging = function () {};
    };
    
    var abc = 123;
    


    /********************/
    /**     BINDINGS   **/
    /********************/
    (function () {
        ko.bindingHandlers.newnssgTheadTr = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var gridVM = ko.unwrap(bindingContext.$component);
                var $container = $(element).closest('.nssg-container');
    
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
                    var allColWidths = visibleCols().reduce(function (total, col) {
                        return total + (col().adjustedWidth || col().width);
                    }, 0);
                    setTimeout(function () {
                        var containerWidth = $container.width();
                        if (typeof allColWidths !== 'number' || isNaN(allColWidths)) {
                            allColWidths = 0;
                        }
    
                        var fixedWidth = Math.ceil(Math.max(allColWidths, containerWidth));
                        $('.nssg-table', $container).width(fixedWidth);
                    }, 0);
                });
    
                return { controlsDescendantBindings: true };
            }
        };
    }());
    

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
                    col = valueAccessor();
                    startX = e.pageX;
                    startWidth = $th.outerWidth();
    
                    $document
                        .on('mousemove.' + NAMESPACE, onDocumentMouseMove)
                        .one('mouseup.' + NAMESPACE, onDocumentMouseUp);
                }
    
                function onDocumentMouseMove(e) {
                    var currentWidth = $th.outerWidth();
                    var newWidth = startWidth + (e.pageX - startX);
                    var minWidth = col.minWidth ? Math.max(80, col.minWidth) : 80;
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
    
                    var minWidth = col.minWidth ? Math.max(80, col.minWidth) : 80;
    
                    var update = {};
                    update[col.id] = { width: Math.max(minWidth, colWidth), adjustedWidth: 0 };
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
    
                if ((col.adjustedWidth || col.width) === 0) {
                    // This hack is needed for firefox
                    $th.css('padding', '0px');
                    $th.css('border', '0px solid transparent');
                }
    
                setTimeout(function () {
                    $th
                        .addClass('nssg-th-' + tmplName)
                        .addClass('animate');
                    $th.outerWidth(col.adjustedWidth || col.width);
    
                    setTimeout(function () {
                        $th.removeClass('animate');
                    }, 200);
                }, 0);
    
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
    

    ko.bindingHandlers.newnssgTd = {
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
    

    ko.bindingHandlers.newnssgTbody = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
    
            /************************/
            /**     DATA BINDING   **/
            /************************/
            ko.applyBindingsToNode(element, {
                foreach: {
                    data: gridVM.data,
                    as: 'row'
                }
            }, bindingContext);
    
            return { controlsDescendantBindings: true };
        }
    };
    

    ko.bindingHandlers.newnssgTbodyTr = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
    
            var visibleColsWithGutter = ko.pureComputed(function () {
                var cols = ko.unwrap(gridVM.columns);
                var temp = cols.filter(function (col) {
                    return col.peek().isVisible;
                });
                temp.push({ id: '$gutter', type: 'gutter', isSortable: false, isResizable: false });
                return temp;
            });
    
            /************************/
            /**    DATA BINDING    **/
            /************************/
            ko.applyBindingsToNode(element, {
                foreach: {
                    data: visibleColsWithGutter,
                    as: 'col'
                }
            }, bindingContext);
    
            return { controlsDescendantBindings: true };
        }
    };
    

    ko.bindingHandlers.nssgContainerSize = {
        init: function (element, valueAccessor) {
            function updateSize() {
                var $element = $(element);
                var size = { width: $element.outerWidth(), height: $element.outerHeight() };
                var oldSize = valueAccessor()();
                if (!oldSize || oldSize.width !== size.width || oldSize.height !== size.height) {
                    valueAccessor()(size);
                }
            }
    
            var throttledUpdate = throttle({ callback: updateSize, frequency: 100 });
    
            $(window).on('resize', throttledUpdate);
            setTimeout(throttledUpdate, 50);
    
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(window).off('resize', throttledUpdate);
            });
        }
    };
    
    


    ko.NewGrid = Grid; // eslint-disable-line no-undef, no-param-reassign
    ko.NewGrid.customize = gridCustomizer; // eslint-disable-line no-undef, no-param-reassign
}));
