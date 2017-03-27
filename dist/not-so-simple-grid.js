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
templates["grid"] = "<div class=\"nssg-container\" data-bind=\"css: { isLoading: !data.loaded() }, nssgContainerSize: size\"><table class=\"nssg-table\"><thead class=\"nssg-thead\"><tr class=\"nssg-thead-tr\" data-bind=\"newnssgTheadTr: true\"><th class=\"nssg-th\" data-bind=\"newnssgTh: col\"></th></tr></thead><tbody class=\"nssg-tobdy\" data-bind=\"html: hb_tbody\"></tbody></table></div>";
templates["paging"] = "<div class=\"nssg-paging\"><div class=\"nssg-paging-selector-container\" data-bind=\"visible: true\"> <span class=\"nssg-paging-view\">View</span> <select class=\"nssg-paging-pages\" data-bind=\"options: pageSizes, value: pageSize\"></select></div> <span class=\"nssg-paging-count\">Now Showing<span data-bind=\"text:firstItem\"></span> of<span data-bind=\"text:totalItems\"></span></span><div class=\"nssg-paging-controls\" data-bind=\"visible: true\"><a href=\"#\" class=\"nssg-paging-arrow nssg-paging-first\" data-bind=\"click: goToFirstPage, visible: currentPageIndex() !== 1\"></a><a href=\"#\" class=\"nssg-paging-arrow nssg-paging-prev\" data-bind=\"click: goToPrevPage, visible: currentPageIndex() !== 1\"></a> <input type=\"text\" class=\"nssg-paging-current\" data-bind=\"value: currentPageIndex\"/><span class=\"nssg-paging-total\" data-bind=\"text: 'of ' + maxPageIndex()\"></span><a href=\"#\" class=\"nssg-paging-arrow nssg-paging-next\" data-bind=\"click: goToNextPage, visible: currentPageIndex() !== maxPageIndex()\"></a><a href=\"#\" class=\"nssg-paging-arrow nssg-paging-last\" data-bind=\"click: goToLastPage, visible: currentPageIndex() !== maxPageIndex()\"></a></div></div>";
templates["actions"] = "<div class=\"nssg-actions-container\" data-bind=\"foreach: $component().ui().actions\"><a href=\"#\" class=\"nssg-action\" data-bind=\"css: $data.css, click: function(){$data.onClick(row.raw)}\"></a></div>";
templates["actions_hb"] = "<div class=\"nssg-actions-container\"> {{#each ../actions as |action key|}}<a href=\"#\" class=\"nssg-action {{action.css}}\" onClick=\"{{../../jsContext}}.invokeAction('{{../$identity}}', {{action.index}}); return false\"></a> {{/each}}</div>";
templates["gutter"] = "";
templates["gutter_hb"] = "";
templates["select"] = "<input type=\"checkbox\" data-bind=\"checked: row.isSelected, checkedValue: row, click: row.toggleSelection($component())\"/>";
templates["select_hb"] = "<input type=\"checkbox\" {{#if isSelected}}checked {{/if}} onClick=\"javascript:{{../jsContext}}.toggleSelect('{{$identity}}', this)\"/>";
templates["text"] = "<div class=\"nssg-td-text\" data-bind=\"text: $parent[id], attr: { title: $parent[id] }\"></div>";
templates["text_hb"] = "<div class=\"nssg-td-text\" title=\"{{value}}\">{{value}}</div>";
templates["select-th"] = "<input type=\"checkbox\" data-bind=\"checked: $component().ui().allSelected, visible: $parent.ui().selectMode === 'multi', click: col.toggleSelectAll($component())\"/>";
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
    

    //= include "other/defaults.js"

    function AddInitialProcesses(gridState) {
        /* eslint no-unused-vars: 0 */
        
        /*************************/
        /** Columns Check Valid **/
        /*************************/
        gridState.processors['columns-check-valid'] = {
            watches: ['columns'],
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Validating column options');
                }
        
                if (!Array.isArray(options.model.columns)) {
                    throw new Error('Columns must be an array of objects');
                }
        
                var identityColPresent = !!findFirst(options.model.columns, { isIdentity: true });
                var columnIds = {};
                options.model.columns.forEach(function (column) {
                    if (!column.id && !column.dataAccessor) {
                        throw new Error('You must specify column id or dataAccessor');
                    }
                    if (!column.id && typeof column.dataAccessor !== 'string') {
                        throw new Error('Column id must be specified if dataAccessor is a not a string');
                    }
        
                    setDefault(column, 'type', 'string', 'text');
                    setDefault(column, 'id', 'string', column.dataAccessor);
                    if (typeof column.dataAccessor !== 'function') {
                        setDefault(column, 'dataAccessor', 'string', column.id);
                    }
                    setDefault(column, 'heading', 'string', column.id);
                    setDefault(column, 'isIdentity', 'boolean', !identityColPresent);
                    setDefault(column, 'isSortable', 'boolean', true);
                    setDefault(column, 'isResizable', 'boolean', true);
                    setDefault(column, 'isVisible', 'boolean', true);
        
                    if (columnIds[column.id]) {
                        throw new Error("Columns must have unique id's: " + column.id);
                    }
                    columnIds[columnIds] = true;
                });
            }
        };
        
        function setDefault(obj, prop, type, defaultValue) {
            if (typeof obj[prop] !== type || (type === 'object' && !type)) { // eslint-disable-line valid-typeof
                obj[prop] = defaultValue;
            }
        }
        
        /* eslint no-unused-vars: 0 */
        
        /***********************************/
        /** Columns Enable Actions Column **/
        /***********************************/
        gridState.processors['columns-enable-actions-column'] = {
            watches: ['ui','columns'],
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
            watches: ['ui','columns'],
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
                if (options.model.logging) {
                    console.log('Indexing columns by id');
                }
                options.model.columnsById = {};
                options.model.columns.forEach(function (column) {
                    options.model.columnsById[column.id] = column;
                });
            }
        };
        
        /* eslint no-unused-vars: 0 */
        var ABSOLUTE_MIN_COL_WIDTH = 80;
        
        /********************************/
        /** Columns-Redistribute Space **/
        /********************************/
        /**
         * #1 too small distribute proportionally
         * #2 cols too big grid scrolls
         * #3 window resize distribute proportionally
         * #4 cols added/removed recalculate
         * #5 some cols not resizable
         * #6 drag finished transition distribute proportionally
         */
        gridState.processors['columns-redistribute-space'] = {
            watches: ['columns', 'space'],
            runs: function (options) {
                if (!options.model.space || options.model.space.width <= 0) {
                    return;
                }
                if (options.model.logging) {
                    console.log('Redistributing exta space amoung the columns');
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
        
                tempToWidth(columnsArray);
                removeTemp(columnsArray);
            }
        };
        
        function widthToTemp(columnsArray) {
            columnsArray.forEach(function (col) {
                col.tempWidth = typeof col.width === 'number' && col.width >= 0 ? col.width : ABSOLUTE_MIN_COL_WIDTH;
            });
        }
        
        function tempToWidth(columnsArray) {
            columnsArray.forEach(function (col) {
                col.width = col.tempWidth;
            });
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
        
        /*****************************/
        /** Columns-sort-indicators **/
        /*****************************/
        gridState.processors['columns-sort-indicators'] = {
            watches: ['sort', 'columns'],
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Updating the sort indicators');
                }
        
                options.model.columns.forEach(function (column) {
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
            }
        };
        
        /* eslint no-unused-vars: 0 */
        
        /************************/
        /** Filter Check Valid **/
        /************************/
        gridState.processors['filter-check-valid'] = {
            watches: ['filter'],
            runs: function (options) {
        
                if (options.model.logging) {
                    console.log('Checking the filter criteria looks right');
                }
        
                if (typeof options.model.filter === 'string')
                {
                    options.model.filter= {
                        '*': options.model.filter
                    };
                }
                
                for(var key in options.model.filter)
                {
                    var filter = options.model.filter[key];
                    if (typeof filter === "string"){
                        options.model.filter[key] = filter.toLowerCase();
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
                if (!options.model.ui.selectable) {
                    return;
                }
                if (options.model.logging) {
                    console.log('Calculating row identities');
                }
        
                var identityColumns = options.model.columns.filter(function (col) {
                    return col.isIdentity;
                }).sort(function (colA, colB) {
                    return colA.id < colB.id ? -1 : 1;
                });
        
                options.model.data.forEach(function (row) {
                    var identity = identityColumns.reduce(function (total, col) {
                        return total + '_' + getCellData(row, col);
                    }, '');
                    row.$identity = identity.replace(/[\s.@+\-|]/g, '');
                });
                // todo calculate identities
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
                if (options.model.logging) {
                    console.log('Checking if filter changed');
                }
        
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
        
                options.model.data = originalData.map(function (row) {
                    var temp = {};
                    for (var key in row) {
                        if (key[0] === '$') {
                            temp[key] = row[key];
                        }
                    }
                    options.model.columns.forEach(function (col) {
                        if (typeof col.dataAccessor === 'function') {
                            temp[col.id] = col.dataAccessor(row);
                        }
                        else {
                            temp[col.id] = row[col.dataAccessor];
                        }
                    });
                    temp.raw = row;
                    return temp;
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
        
                if (!options.model.filter || !options.model.filter['*'])
                {
                    //we don't need to aggregate the data as it's not being used right now
                    return;
                }
                
                if (options.model.data.length === 0)
                {
                    //there's no data
                    return;
                }
                
                if (!options.changed.data && options.model.data[0].$aggregate)
                {
                    //the data didn't change and we already made the aggregate so nothing to do
                    return;
                }
                
                if (options.model.logging) {
                    console.log('Aggregating the data to be used with the wildcard filter');
                }
        
                options.model.data = originalData.map(function(row){
                    var temp = {};
                    for(var key in row)
                    {
                        temp[key] = row[key]
                    }
                    var aggregate = [];
                    options.model.columns.forEach(function(col){
                        aggregate.push(row[col.id]);
                    });
                    temp.$aggregate = aggregate.join(" | ").toLowerCase();
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
        
                if (!options.model.filter)
                {
                    //we don't need to aggregate the data as it's not being used right now
                    return;
                }
                
                if (options.model.data.length === 0)
                {
                    //there's no data
                    return;
                }
                
                if (!options.changed.data && options.model.data[0].$lower)
                {
                    //the data didn't change and we already made the aggregate so nothing to do
                    return;
                }
                
                if (options.model.logging) {
                    console.log('Running toLowerCase on the data');
                }
        
                options.model.data = originalData.map(function(row){
                    var temp = {};
                    var lower = {};
                    for(var key in row)
                    {
                        temp[key] = row[key]
                        lower[key] = (""+row[key]).toLowerCase();
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
        
                if (options.model.logging) {
                    console.log('Filtering the data');
                }
                
                options.model.data = originalData.filter(applyFilters);
                
                function applyFilters(row){
                    var match = true;
                    for(var key in options.model.filter)
                    {
                        if (key === '*')
                        {
                            match &= applyFilter(row.$lower.$aggregate, options.model.filter[key]);
                        }
                        else {
                            match &= applyFilter(row.$lower[key], options.model.filter[key]);
                        }
                    }
                    return match;
                }
                
                function applyFilter(value, filter)
                {
                    if (typeof filter === 'string') {
                        return stringFilter(value, filter);
                    }
                    else if (typeof filter === 'function'){
                        return functionFilter(value, filter);
                    }
                    else if (typeof filter === 'object' && typeof filter.exec === 'function'){
                        return regexFilter(value, filter);
                    }
                    else {
                        throw new Error("Unrecognized fitler type");
                    }
                }
        
                function stringFilter(value, filter){
                    return filter.split(/\s/).reduce(function(acc, token){
                        return acc && value.indexOf(token) > -1;
                    }, true);
                }
                
                function rejectFilter(value, filter){
                    return !!filter.exec(value);
                }
                function functionFilter(value, filter){
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
                var originalData = options.changed.data ? options.model.data : options.cache.data;
                options.cache.data = originalData;
        
                if (options.model.logging) {
                    console.log('Splitting data into pages');
                }
        
                var minIndex = paging.pageSize * (paging.currentPage - 1);
                var maxIndex = minIndex + paging.pageSize;
        
                options.model.paging.firstItem = minIndex + 1;
                options.model.paging.lastItem = maxIndex + 1;
                options.model.paging.totalItems = originalData.length;
        
                options.model.paging.pageCount = Math.ceil(originalData.length / paging.pageSize);
                options.model.data = originalData.slice(minIndex, maxIndex);
            }
        };
        
        /* eslint no-unused-vars: 0 */
        
        /************************/
        /** Data row selection **/
        /************************/
        gridState.processors['data-row-selection'] = {
            watches: ['data', 'selection'],
            runs: function (options) {
                if (!options.model.ui.selectable) {
                    return;
                }
                if (options.model.logging) {
                    console.log('Updating row selection');
                }
                options.model.data.forEach(function (row) {
                    row.isSelected = !!options.model.selection[row.$identity];
                });
            }
        };
        
            /* eslint no-unused-vars: 0 */
        
        /***************/
        /** Data Sort **/
        /***************/
        gridState.processors['data-sort'] = {
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
                        var sortFn = gridState.sortFunctions[column.type];
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
                console.log('Final grid state', JSON.stringify(options.model, filterUninterestingProperties));
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
            if (key === 'columns') {
                return value.length;
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
                    console.log('Applying change', whatChanged);
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
            if (key === 'columns') {
                return value.length;
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
                if (options.model.logging) {
                    console.log('Validating paging options');
                }
        
                var paging = options.model.paging;
                var data = options.model.data;
                if (paging.pageSize < 1 || isNaN(paging.pageSize)) {
                    paging.pageSize = 1;
                }
                if (options.changed.data) {
                    if (options.model.logging) {
                        console.log('Data changed, updating page Count');
                    }
                    paging.pageCount = Math.ceil(Math.max(1, data.length / paging.pageSize));
                }
                if (paging.currentPage < 1 || isNaN(paging.currentPage)) {
                    paging.currentPage = 1;
                }
                else if (paging.currentPage > paging.pageCount) {
                    paging.currentPage = paging.pageCount;
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
                    console.log("Updating the lastFetch'd timestamp");
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
                if (options.model.logging && options.model.ui.selectable) {
                    console.log('Exporting selected rows');
                }
        
                var selectedRows = options.model.data.filter(function (row) {
                    return row.isSelected;
                }).map(function (row) {
                    return row.raw;
                });
                options.model.ui.selectedData = selectedRows;
            }
        };
        
        /* eslint no-unused-vars: 0 */
        
        /*******************************/
        /** UI Selected all indicator **/
        /*******************************/
        gridState.processors['ui-selected-all-indicator'] = {
            watches: ['selection', 'data'],
            runs: function (options) {
                if (options.model.logging && options.model.ui.selectable) {
                    console.log('Updating the selection indicators');
                }
        
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
                if (options.model.logging && options.model.ui.selectable) {
                    console.log('Updating the selection count');
                }
        
                var count = 0;
                for (var key in options.model.selection) {
                    if (key !== 'all' && options.model.selection[key]) {
                        count++;
                    }
                }
                options.model.ui.selectedCount = count;
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
                    var size = model.vm.size();
                    if (size) {
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
                if (!options.model.space || !options.model.space.width)
                {
                    return;
                }
                options.cache.templates = options.cache.templates || {};
        
                if (options.model.logging) {
                    console.log('Updating the handlebar data template');
                }
        
                if (!options.cache.namespace) {
                    options.cache.namespace = 'NSSG_' + Math.floor(Math.random() * 99999);
                    options.cache.jsContext = {};
                    window[options.cache.namespace] = options.cache.jsContext;
                }
        
                options.cache.jsContext.toggleSelect = function (rowIdentity, e) {
                    var isSelected = !!options.model.selection[rowIdentity];
                    if (options.model.logging) {
                        console.log('Setting ' + rowIdentity + ' to ' + (!isSelected ? 'selected' : 'deselected'));
                    }
        
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
                    return { css: action.css, index: index };
                }) : [];
                var context = {
                    jsContext: options.cache.namespace,
                    data: options.model.data,
                    actions: actions
                };
        
                if (!options.model.lastInput.ui || !options.model.lastInput.ui.alreadyUpdatedSelection) {
                    var timeA = performance.now();
                    var compiledHtml = compiledTemplate(context);
                    var timeB = performance.now();
                    options.model.vm.hb_tbody(compiledHtml);
                    var timeC = performance.now();
        
                    if (options.model.logging) {
                        console.log('Render template', (timeB - timeA));
                        console.log('Update Binding', (timeC - timeB));
                    }
                }
                else {
                    console.log('skipping the update data step since the ui should already be up to date');
                }
        
                if (!options.model.vm.data.loaded.peek()) {
                    setTimeout(function() {
                        options.model.vm.data.loaded(true);
                    },100);
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
                if (!options.model.space || !options.model.space.width)
                {
                    return;
                }
                if (options.model.logging) {
                    console.log('Updating the column bindings');
                }
                var i = 0;
        
                var columns = options.model.columns;
                var temp = options.model.vm.columns();
                var numBefore = temp.length;
                var numNow = columns.length;
                if (numBefore > numNow) {
                    temp = temp.slice(0, numNow);
                }
                else if (numBefore < numNow) {
                    for (i = numBefore; i < numNow; i++) {
                        temp[i] = ko.observable();
                    }
                }
        
                for (i = 0; i < numNow; i++) {
                    var column = columns[i];
                    var colBefore = options.cache[column.id];
                    var colNow = JSON.stringify(column);
                    if (colBefore !== colNow || numBefore !== numNow) {
                        var newObj = JSON.parse(colNow);
                        addColumnFunctions(newObj, options);
                        temp[i](newObj);
                        options.cache[column.id] = colNow;
                    }
                }
                if (numBefore !== numNow) {
                    options.model.vm.columns(temp);
                }
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
                    console.log('Updating the data bindings');
                }
        
                var uiData = options.model.data.slice();
                uiData.forEach(function (row, index) {
                    var clone = deepReplace({}, row);
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
        
                if (options.changed.data) {
                    options.model.vm.data(uiData);
                    options.model.vm.data.loaded(true);
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
                if (options.model.logging) {
                    console.log('Publishing grid state');
                }
                options.model.vm.gridState(options.model);
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
                options.model.vm.paging(options.model.paging);
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
        
                options.model.vm.ui(clone);
            }
        };
        


    }
    /* eslint no-unused-vars: 0 */
    
    /*************************/
    /** Initial Grid State  **/
    /*************************/
    
    function createInitialGridState() {
        var gridState = {
            filter:{},
            // {
            //    'name': 'potato salad',  //also matches 'salad potato' and 'sweet potato and turnip salad'
            //    'description': /this is rejex/, applies the regex on the column
            //    '*'   : 'creamy coleslaw',  each word occurs in any column, order doesn't matter
            //}
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
                allowSorting: true
            },
            data: [],
            data_ChangeMode: 'Identity',
            processors: {
                start: ['log-start', 'pre-process', 'process', 'post-process', 'log-done'],
                'pre-process': [
                    'fetch-data-init',
                    'columns-enable-selection-column',
                    'columns-enable-actions-column',
                    'vm-container-size',
                    'columns-check-valid',
                    'columns-index-by-id',
                    'paging-filter-change-resets-currentpage',
                    'paging-sort-change-resets-currentpage',
                    'filter-check-valid'
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
                    'columns-sort-indicators',
                    'data-calculate-row-identities',
                    'selection-select-all',
                    'selection-select-single',
                    'selection-disable-multi-page',
                    'data-row-selection',
                    'ui-selected-all-indicator',
                    'ui-selected-count',
                    'ui-export-selected-rows',
                    'columns-redistribute-space',
                    'vm-handlebars-data',
                    'vm-update-bindings-paging',
                    'vm-update-bindings-columns',
                    'vm-update-bindings-ui',
                    'vm-update-bindings-grid-state'
                ],
                'fetch-data': function () {
                    throw new Error("Grids must specifiy a 'fetch-data' function or override the definition of 'process'");
                }
    
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
            return inputPipeline.process({inner:options}, 'process');
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
        // Options
        this.enabled = ko.observable(true);
        this.pageSizes = propertyAsObservable(gridVM.ui, 'pageSizes');
        this.maxPageIndex = propertyAsObservable(gridVM.paging, 'pageCount');
        this.firstItem = propertyAsObservable(gridVM.paging, 'firstItem');
        this.totalItems = propertyAsObservable(gridVM.paging, 'totalItems');
        this.currentPageIndex = ko.pureComputed({ read: function () {
            return gridVM.paging().currentPage;
        },
            write: function (newValue) {
                gridVM.process({ paging: { currentPage: newValue } });
            } });
        this.pageSize = ko.pureComputed({ read: function () {
            return gridVM.paging().pageSize;
        },
            write: function (newValue) {
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
                return params.vm;
            }
        },
        template: templates.grid
    });
    
    ko.components.register('newgrid-paging', {
        viewModel: {
            createViewModel: function (params) {
                return params.vm;
            }
        },
        template: templates.paging
    });
    

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
                        return total + col().width;
                    }, 0);
                    setTimeout(function() {
                        var containerWidth = $container.width();
                        if (typeof allColWidths !== 'number' || isNaN(allColWidths)) {
                            allColWidths = 0;
                        }
    
                        var fixedWidth = Math.ceil(Math.max(allColWidths, containerWidth));
                        $('.nssg-table', $container).width(fixedWidth);
                    },0);
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
                    startX = e.pageX;
                    startWidth = $th.outerWidth();
    
                    $document
                        .on('mousemove.' + NAMESPACE, onDocumentMouseMove)
                        .one('mouseup.' + NAMESPACE, onDocumentMouseUp);
                }
    
                function onDocumentMouseMove(e) {
                    var currentWidth = $th.outerWidth();
                    var newWidth = startWidth + (e.pageX - startX);
                    newWidth = Math.max(80, newWidth);
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
    
                    var update = {};
                    update[col.id] = { width: Math.max(80, colWidth) };
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
