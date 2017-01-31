/* eslint no-unused-vars :0 */
/* istanbul ignore next */
(function (factory) {
    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        factory(require('ko'), require('jquery'), require('processing-pipeline'), exports);  // eslint-disable-line global-require
    }
    else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
        define(['ko', 'jquery', 'processing-pipeline', 'exports'], factory); // eslint-disable-line no-undef
    }
    else {
        factory(ko, $, PipelineFactory); // eslint-disable-line no-undef
    }
}(function (ko, $, PipelineFactory) {
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
    

    /* eslint no-unused-vars: 0 */
    
    /*************************/
    /** INTERNAL REFERENCES **/
    /*************************/
    
    var refGetAllSelected = Symbol('getAllSelected');
    var refSetAllSelected = Symbol('setAllSelected');
    var refFetchData = Symbol('fetchData');
    var refOnItemsOnCurrentPageChange = Symbol('onItemsOnCurrentPageChange');
    var refOnSaveableChanges = Symbol('onSaveableChanges');
    var refBuildOptions = Symbol('buildOptions');
    var refEmitChange = Symbol('emitChange');
    var refFindColById = Symbol('findColById');
    var refGetSaveableGridObj = Symbol('getSaveableGridObj');
    var refGetValueForCol = Symbol('getValueForCol');
    var refSortData = Symbol('sortData');
    

    /*********************/
    /**     TEMPLATES   **/
    /*********************/
    var templates = {};
templates["grid"] = "<div class=nssg-container data-bind=\"css: { isLoading: !data.loaded() }, nssgContainerSize: size\"><table class=nssg-table><thead class=nssg-thead><tr class=nssg-thead-tr data-bind=\"newnssgTheadTr: true\"><th class=nssg-th data-bind=\"newnssgTh: col\"></th></tr></thead><tbody class=nssg-tobdy data-bind=\"newnssgTbody: true\"><tr class=nssg-tbody-tr data-bind=\"newnssgTbodyTr: true\"><td class=nssg-td data-bind=\"newnssgTd: col\"></td></tr></tbody></table></div>";
templates["paging"] = "<div class=nssg-paging><div class=nssg-paging-selector-container data-bind=\"visible: true\"><span class=nssg-paging-view>View</span><select class=nssg-paging-pages data-bind=\"options: pageSizes, value: pageSize\"></select></div><span class=nssg-paging-count>Now Showing <span data-bind=text:firstItem></span> of <span data-bind=text:totalItems></span></span><div class=nssg-paging-controls data-bind=\"visible: true\"><a href=# class=\"nssg-paging-arrow nssg-paging-first\" data-bind=\"click: goToFirstPage, visible: currentPageIndex() !== 1\"></a> <a href=# class=\"nssg-paging-arrow nssg-paging-prev\" data-bind=\"click: goToPrevPage, visible: currentPageIndex() !== 1\"></a> <input type=text class=nssg-paging-current data-bind=\"value: currentPageIndex\"> <span class=nssg-paging-total data-bind=\"text: 'of ' + maxPageIndex()\"></span> <a href=# class=\"nssg-paging-arrow nssg-paging-next\" data-bind=\"click: goToNextPage, visible: currentPageIndex() !== maxPageIndex()\"></a> <a href=# class=\"nssg-paging-arrow nssg-paging-last\" data-bind=\"click: goToLastPage, visible: currentPageIndex() !== maxPageIndex()\"></a></div></div>";
templates["select-th"] = "<input type=checkbox data-bind=\"checked: $component().ui().allSelected, visible: $parent.ui().selectMode === 'multi', click: col.toggleSelectAll($component())\">";
templates["text-th"] = "<div class=nssg-th-text data-bind=\"text: col.heading, attr: { title: col.heading }\"></div>";
templates["actions"] = "<div class=nssg-actions-container data-bind=\"foreach: $component().options.actions\"><a href=# class=nssg-action data-bind=\"click: $component().onRowActionClick, css: css\"></a></div>";
templates["gutter"] = "";
templates["select"] = "<input type=checkbox data-bind=\"checked: row.isSelected, checkedValue: row, click: row.toggleSelection($component())\">";
templates["text"] = "<div class=nssg-td-text data-bind=\"text: (typeof dataAccessor === 'function') ? dataAccessor($parent) : $parent[dataAccessor], attr: { title: (typeof dataAccessor === 'function') ? dataAccessor($parent) : $parent[dataAccessor] }\"></div>";

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
    
    function throttle(options){
        if (typeof options !== "object" || !options){
            throw new Error("throttle expects a configuration object")
        }
        var invoke = options.callback;
        var frequency = options.frequency;
        var leading = options.leading;
        var trailing = options.trailing;
        if (typeof invoke !== "function"){
            throw new Error("callback must be a function");
        }
        if (typeof frequency !== "number" || frequency <= 0){
            throw new Error("frequency must be a number greater than 0");
        }
        if (!leading && !trailing){
            leading = true;
            trailing = true;
        }
        
        function doLeading(){
            if (leading){
                invoke();
            }
        }
        function doTrailing(){
            invokeTimer = null;
            if (trailing){
                invoke();
            }
        }
        
        var invokeTimer;
        function requestInvoke(){
            if (invokeTimer) {
                return;
            }
            doLeading();
            invokeTimer = setTimeout(doTrailing, frequency)
        }
        function dispose(){
            options = null;
            cb = null;
            if (invokeTimer){
                clearTimeout(invokeTimer);
            }
        }
        requestInvoke.dispose = dispose;
        return requestInvoke;
    }

    /********************/
    /**     DEFAULTS   **/
    /********************/
    var defaultOptions; // eslint-disable-line no-unused-vars
    defaultOptions = {
        // actions: [],
        // columns: [],
        // data: [],
        deletable: {
            css: 'nssg-action-delete',
            onClick: function (rowData) {
                this.data.remove(rowData);
            }
        },
        invokable: {
            css: 'nssg-action-invoke',
            onClick: function () {
                // console.debug('Item invoked.');
            }
        },
        pageable: {
            enabled: true,
            // defaultPageSize: 10,
            hideSinglePage: false,
            pageSizes: [10, 50, 100, 500, 1000],
            serverPaging: false
        },
        resizable: true,
        selectable: {
            multiSelect: true,
            width: 40,
            minWidth: 40,
            maxWidth: 40
        },
        sortable: {
            enabled: true,
            defaultSortCol: null,
            defaultSortDir: 'asc',
            dataAccessor: function (dataObj, col) {
                if (!dataObj) {
                    return null;
                }
                return (typeof col.dataAccessor === 'function') ? col.dataAccessor(dataObj) : dataObj[col.dataAccessor];
            },
            serverSorting: false
        }
        // onOptionsChange: function (gridObj) {
        //     console.log(gridObj);
        // }
    };
    

    function AddInitialProcesses(gridState) {
        /* eslint no-unused-vars: 0 */
        
        /************************/
        /** Check Paging Valid **/
        /************************/
        gridState.processors['check-paging-valid'] = {
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
        
        /************************/
        /** Check Paging Valid **/
        /************************/
        gridState.processors['check-columns-valid'] = {
            watches: ['columns'],
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Validating column options');
                }
        
                if (!Array.isArray(options.model.columns)) {
                    throw new Error('Columns must be an array of objects');
                }
                
                var identityColPresent = !!findFirst(options.model.columns, {isIdentity: true});
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
                    setDefault(column, 'dataAccessor', 'string', column.id);
                    setDefault(column, 'heading', 'string', column.id);
                    setDefault(column, 'isIdentity', 'boolean', !identityColPresent);
                    setDefault(column, 'isSortable', 'boolean', true);
                    setDefault(column, 'isResizable', 'boolean', true);
                    setDefault(column, 'visible', 'boolean', true);
        
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
        
        /**********************/
        /** Check-data-Valid **/
        /**********************/
        gridState.processors['check-data-valid'] = {
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
        
        /*****************/
        /** Filter Data **/
        /*****************/
        gridState.processors.filter = {
            watches: ['filter', 'data'],
            runs: function (options) {
                var originalData = options.changed.data ? options.model.data : options.cache.data;
                options.cache.data = originalData;
        
                if (options.model.logging) {
                    console.log('Filtering the data');
                }
        
                if (options.model.filter !== '') {
                    throw new Error('Filtering is just a placeholder for now');
                }
        
                // filter the data based on the filter options
            }
        };
        
        /* eslint no-unused-vars: 0 */
        
        /******************/
        /** Last Updated **/
        /******************/
        gridState.processors['last-updated'] = {
            watches: 'data',
            runs: function (options) {
                if (options.model.logging) {
                    console.log("Updating the lastFetch'd timestamp");
                }
        
                options.model.time.lastFetch = Date.now();
            }
        };
        
        /* eslint no-unused-vars: 0 */
        
        /***************/
        /** Page Data **/
        /***************/
        gridState.processors.paging = {
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
        var ABSOLUTE_MIN_COL_WIDTH = 80;
        
        /************************/
        /** Redistribute Space **/
        /************************/
        /**
         * #1 too small distribute proportionally
         * #2 cols too big grid scrolls
         * #3 window resize distribute proportionally
         * #4 cols added/removed recalculate
         * #5 some cols not resizable
         * #6 drag finished transition distribute proportionally
         */
        gridState.processors['redistribute-space'] = {
            watches: ['columns', 'space'],
            runs: function (options) {
                if (!options.model.space || options.model.space.width <= 0){
                    return;
                }
                if (options.model.logging) {
                    console.log('Redistributing exta space amoung the columns');
                }
                var columnsArray = options.model.columns;
                
                widthToTemp(columnsArray);
                
                var containerWidth = Math.floor(options.model.space.width) - 2;
                var availableWidth;
                var previousAvailableWidth;
                var usedWidth;
                
                applyMinMax(columnsArray);
                
                //min, max width and non-resizable columns can leave small amounts of space left over.
                //we run this in an iteration so that should those edge cases occur we still mostly fill the space
                //The limit of 10 is just to ensure we don't end up looping forever
                //usually this will exit after the second iteration
                for(var iterations =0; iterations<10; iterations++)
                {
                    previousAvailableWidth = availableWidth;
                    
                    usedWidth = calculateUsedWidth(columnsArray);
                    
                    availableWidth = Math.max(0, containerWidth - usedWidth);
                    
                    distributeAvailableSpace(columnsArray, availableWidth);
                    
                    if (availableWidth === previousAvailableWidth){
                        break;
                    }
                }
                
                tempToWidth(columnsArray);
                removeTemp(columnsArray);
            }
        };
        
        function widthToTemp(columnsArray)
        {
            columnsArray.forEach(function(col) {
                col.tempWidth = col.width || ABSOLUTE_MIN_COL_WIDTH;
            });
        }
        
        function tempToWidth(columnsArray)
        {
            columnsArray.forEach(function(col) {
                col.width = col.tempWidth;
            });
        }
        
        function removeTemp(columnsArray)
        {
            columnsArray.forEach(function(col) {
                delete col.tempWidth;
            });
        }
        
        function calculateUsedWidth(columnsArray){
            return columnsArray.reduce(function(total, col){
                return total + (col.tempWidth ? col.tempWidth : 0);
            },0);
        }
        
        function applyMinMax(columnsArray){
            columnsArray.forEach(function(col){
                if (!!col.minWidth)
                {
                    col.tempWidth = Math.max(col.tempWidth, col.minWidth);
                }
                if (!!col.maxWidth)
                {
                    col.tempWidth = Math.min(col.tempWidth, col.maxWidth);
                }
                if (col.tempWidth < ABSOLUTE_MIN_COL_WIDTH) {
                    col.tempWidth = ABSOLUTE_MIN_COL_WIDTH;
                }
            });
        }
        
        function distributeAvailableSpace(columnsArray, space){
            var resizableColumns = columnsArray.reduce(function(total, col){
                return total + (col.isResizable ? 1 : 0);
            },0);
            
            var spacePerColumn = Math.floor(space / resizableColumns);
            if (spacePerColumn <= 0){
                return;
            }
            
            columnsArray.forEach(function(col){
                if (col.isResizable){
                    col.tempWidth += spacePerColumn;
                }
            });
            
            applyMinMax(columnsArray);
        }
            /* eslint no-unused-vars: 0 */
        
        /***************/
        /** Sort Data **/
        /***************/
        gridState.processors.sort = {
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
                        var valueA = rowA[column.dataAccessor];
                        var valueB = rowB[column.dataAccessor];
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
        
        /***************/
        /** Sort Data **/
        /***************/
        gridState.processors['sort-indicators'] = {
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
        
        /**************************/
        /** Update row selection **/
        /**************************/
        gridState.processors['row-selection'] = {
            watches: ['data','selection'],
            runs: function (options) {
                if (!options.model.ui.selectable){
                    return;
                }
                if (options.model.logging) {
                    console.log('Updating row selection');
                }
                options.model.data.forEach(function(row){
                    row.isSelected = !!options.model.selection[row.$identity];
                });
            }
        };
        
        /* eslint no-unused-vars: 0 */
        
        /***************/
        /** Sort Data **/
        /***************/
        gridState.processors['index-columns-by-id'] = {
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
        
        /*****************************/
        /** Update Bindings: colums **/
        /*****************************/
        gridState.processors['update-bindings-columns'] = {
            watches: ['sort', 'columns'],
            runs: function (options) {
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
                    if (colBefore !== colNow) {
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
        
        function addColumnFunctions(col, options){
            if (col.type === "select"){
                col.toggleSelectAll = function(grid){
                    return function(){
                        grid.process({selection:{all:!options.model.ui.allSelected}});
                        return true;
                    }
                }
            }
        }
        /* eslint no-unused-vars: 0 */
        
        var selectedObservables = {};
        
        /***************************/
        /** Update Bindings: data **/
        /***************************/
        gridState.processors['update-bindings-data'] = {
            watches: ['data', 'selection'],
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Updating the data bindings');
                }
                
                var uiData = options.model.data.slice();
                uiData.forEach(function(row, index){
                    var clone = deepReplace({}, row);
                    uiData[index] = clone;
                    
                    var obs = selectedObservables[row.$identity];
                    if (!obs){
                        obs = ko.observable();
                        selectedObservables[row.$identity] = obs;
                    }
                    
                    clone.isSelected = obs;
                    if (obs.peek() !== row.isSelected){
                        obs(row.isSelected);
                    }
                    
                    clone.toggleSelection = function(grid){
                        var options = {selection:{}};
                        options.selection[row.$identity] = !row.isSelected;
                        return wrapped_process(grid, options)
                    }
                });
        
                options.model.vm.data(uiData);
                options.model.vm.data.loaded(true);
            }
        };
        
        function wrapped_process(grid, options) {
            return function(){grid.process(options);}
        }
        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** Update Bindings: paging **/
        /*****************************/
        gridState.processors['update-bindings-paging'] = {
            watches: 'paging',
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Updating the page bindings');
                }
                options.model.vm.paging(options.model.paging);
            }
        };
        
        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** Update Bindings: ui **/
        /*****************************/
        gridState.processors['update-bindings-ui'] = {
            watches: 'ui',
            runs: function (options) {
                if (options.model.logging) {
                    console.log('Updating the ui specific bindings');
                }
                var ui = options.model.ui;
                var clone = {};
                deepReplace(clone, ui);
                
                if (!options.cache.allSelected){
                    options.cache.allSelected = ko.observable();
                }
                clone.allSelected = options.cache.allSelected;
                if (clone.allSelected.peek() !== ui.allSelected){
                    clone.allSelected(ui.allSelected);
                }
                
                options.model.vm.ui(clone);
            }
        };
        /* eslint no-unused-vars: 0 */
        
        /**********************************************/
        /** Filter changes should reset current page **/
        /**********************************************/
        gridState.processors['filter-change-resets-currentpage'] = {
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
        
        /************************************************/
        /** Pagesize changes should reset current page **/
        /************************************************/
        gridState.processors['pagesize-change-resets-currentpage'] = {
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
        
        /**********************************************/
        /** sort changes should reset current page **/
        /**********************************************/
        gridState.processors['sort-change-resets-currentpage'] = {
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
        /** Enable Selection Column **/
        /*****************************/
        gridState.processors['ui-enable-selection-column'] = {
            watches: ['ui'],
            runs: function (options) {
                if (options.model.ui.selectable){
                    var selectCol = findFirst(options.model.columns, {id:"$$select"});
                    if (!selectCol){
                        console.log("Adding the row selection column");
                        selectCol = {
                            id:"$$select",
                            type:"select",
                            isSortable: false,
                            isIdentity: false
                        }
                        options.model.columns.unshift(selectCol);
                    }
                    if (typeof options.model.ui.selectMode === "undefined"){
                        options.model.ui.selectMode = "multi";
                    }
                }
            }
        };
        /* eslint no-unused-vars: 0 */
        
        /******************************/
        /** calculate-row-identities **/
        /******************************/
        gridState.processors['calculate-row-identities'] = {
            watches: ['data', 'columns'],
            runs: function (options) {
                if (!options.model.ui.selectable){
                    return;
                }
                if (options.model.logging) {
                    console.log("Calculating row identities");
                }
        
                var identityColumns = options.model.columns.filter(function(col){
                    return col.isIdentity;
                }).sort(function(colA, colB){
                    return colA.id < colB.id ? -1 : 1;
                });
                
                options.model.data.forEach(function(row){
                    var identity = identityColumns.reduce(function(total, col){
                        return total+"$"+getCellData(row, col);
                    },"");
                    row["$identity"] = identity;
                });
                //todo calculate identities
            }
        };
        
        function getCellData(row, col){
            return typeof col.dataAccessor === "string" ? row[col.dataAccessor] : col.dataAccessor(row);
        }
        /* eslint no-unused-vars: 0 */
        
        /*****************************/
        /** Enable Selection Column **/
        /*****************************/
        gridState.processors['disable-multi-page-selection'] = {
            watches: ['data','selection'],
            runs: function (options) {
                if (options.model.ui.selectable){
                    var rowsPresent = {};
                    options.model.data.forEach(function(row){
                        rowsPresent[row.$identity] = true;
                    });
                    
                    var toBeRemoved = [];
                    
                    for(var key in options.model.selection){
                        if (!rowsPresent[key] && key !== "all"){
                            toBeRemoved.push(key);
                        }
                    }
                    
                    if (toBeRemoved.length > 0 && options.model.logging){
                        console.log("Removing selected rows which are not present on the current page");
                    }
                    
                    toBeRemoved.forEach(function(key){
                        delete options.model.selection[key];
                    });
                }
            }
        };
        /* eslint no-unused-vars: 0 */
        
        /****************/
        /** Select All **/
        /****************/
        gridState.processors['select-all'] = {
            watches: ['selection','data'],
            runs: function (options) {
                var all = options.model.selection.all;
                if (typeof all !== "boolean") {
                    delete options.model.selection.all;
                    return;
                }
                if (all){
                    if (options.model.logging) {
                        console.log('Applying select all');
                    }
                    options.model.data.forEach(function(row){
                        options.model.selection[row.$identity] = true;
                    });
                    delete options.model.selection.all;
                } else {
                    if (options.model.logging) {
                        console.log('Clearing all selected rows');
                    }
                    options.model.selection = {};
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
                if (options.model.logging && options.model.ui.selectable) {
                    console.log('Updating the selection indicators');
                }
        
                var allSelected = !findFirst(options.model.data, {isSelected: false});
                
                options.model.ui.allSelected = allSelected;
            }
        };
        
    }
    /* eslint no-unused-vars: 0 */
    
    /*************************/
    /** Initial Grid State  **/
    /*************************/
    
    function createInitialGridState() {
        var gridState = {
            filter: '',
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
                start: ['pre-process', 'process', 'post-process'],
                'pre-process': [
                    'ui-enable-selection-column',
                    'check-columns-valid',
                    'index-columns-by-id',
                    'filter-change-resets-currentpage',
                    'sort-change-resets-currentpage'
                ],
                process: 'local',
                local: [
                    { watches: 'time', runs: 'fetch-data' },
                    'last-updated',
                    'check-data-valid',
                    'filter',
                    'sort',
                    'check-paging-valid',
                    'pagesize-change-resets-currentpage',
                    'paging'
                ],
                remote: [
                    'pagesize-change-resets-currentpage',
                    { watches: ['time', 'sort', 'filter', 'paging', 'columns'], runs: 'fetch-data' },
                    'last-updated',
                    'check-data-valid'
                ],
                'post-process': [
                    'redistribute-space',
                    'sort-indicators',
                    'calculate-row-identities',
                    'select-all',
                    'disable-multi-page-selection',
                    'row-selection',
                    'ui-selected-all-indicator',
                    'update-bindings-data',
                    'update-bindings-paging',
                    'update-bindings-columns',
                    'update-bindings-ui'
                ],
                'fetch-data': function () {
                    throw new Error("Grids must specifiy a 'fetchdata' function or override the definition of 'process'");
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
        var internalVM = {};
        internalVM.data = ko.observableArray();
        internalVM.data.loaded = ko.observable(false);
        internalVM.paging = ko.observable({});
        internalVM.ui = ko.observable({});
        internalVM.size = ko.observable()
    
        internalVM.columns = ko.observableArray();
        var thisGridSymbol = Symbol('Grid Instance');
    
        var pipeline = PipelineFactory.create();
    
        var gridState = createInitialGridState();
    
        gridState.vm = internalVM;
    
        if (userOptions) {
            internalVM.ready = process(userOptions);
        }
    
        internalVM.process = process;
        
        ko.computed(function(){
            var size = internalVM.size();
            if (size){
                process({space:size})
            }
        });
    
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
    
        function process(options) {
            // Pull in only the recognized properties to discourage
            // devs from trying to hack the grid again
            extendProperty(gridState, options, 'filter');
            extendProperty(gridState, options, 'sort');
            extendProperty(gridState, options, 'columns');
            extendProperty(gridState, options, 'columnsById');
            extendProperty(gridState, options, 'paging');
            extendProperty(gridState, options, 'selection');
            extendProperty(gridState, options, 'time');
            extendProperty(gridState, options, 'space');
            extendProperty(gridState, options, 'processors');
            extendProperty(gridState, options, 'logging');
            extendProperty(gridState, options, 'ui');
    
            // The data property must be handled seperatly as we
            // actually need to transform it on import
            if (ko.isObservable(options.data)) {
                gridState.processors['fetch-data'] = function (pipelineArgs) {
                    pipelineArgs.model.data = options.data.peek();
                };
                if (!options.data[thisGridSymbol]) {
                    options.data[thisGridSymbol] = true;
                    options.data[thisGridSymbol] = ko.computed(function () {
                        options.time = options.time || {};
                        options.time.koDataUpdated = Date.now();
                        process(options);
                    });
                }
            }
            if (typeof options.data === 'function') {
                gridState.processors['fetch-data'] = function (pipelineArgs) {
                    return Promise.resolve(options.data()).then(function (data) {
                        pipelineArgs.model.data = data;
                    });
                };
            }
            else if (Array.isArray(options.data)) {
                gridState.data = options.data;
            }
            var loggingEnabled = gridState.logging;
            if (loggingEnabled) {
                console.group('Processing grid state change');
                var whatChanged = JSON.stringify(options, filterUninterestingProperties);
                if (whatChanged.length === 2){
                    whatChanged = JSON.stringify(options)
                }
                console.log('Applying change', whatChanged);
            }
            var cleanup = function () {
                if (loggingEnabled) {
                    console.log('Final grid state', JSON.stringify(gridState, filterUninterestingProperties));
                    console.groupEnd();
                }
            };
            var promise = pipeline.process(gridState, 'start');
            return promise.then(cleanup, cleanup);
        }
    
        // ///////////////////
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
                .then(function(){
                    result = new Grid(realOptions);
                    return result.ready;
                })
                .then(function(){
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
            function initActualGrid() {
                actualGrid(new Grid(realOptions));
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
    ko.components.register('grid', {
        viewModel: {
            createViewModel: function (params) {
                return params.vm;
            }
        },
        template: templates.grid
    });
    
    ko.components.register('grid-paging', {
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
    
                    if (column.isSortable) {
                        gridVM.process({ sort: [{ sortBy: column.id, sortAsc: isAsc }] });
                    }
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
                
                var gutter = document.createElement("th");
                gutter.className = "gutter nssg-th";
                $(element).append(gutter);
                
                ko.computed(function(){
                    var allColWidths = null;
    
                    var allColWidths = ko.unwrap(cols).reduce(function(total, col){return total + col().width;}, 0);
                    var containerWidth = $container.width();
                    if (typeof allColWidths !== "number" || isNaN(allColWidths)){allColWidths = 0;}
                    
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
                    update[col.id] = {width:Math.max(80,colWidth)};
                    gridVM.process({columnsById:update});
                }
    
                if ($(".nssg-col-grip", $th).length == 0)
                {
                    if (gridVM.ui().isResizable !== false && col.resizable !== false) {
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
                
                var $template = $(".nssg-th-content", $th);
                if ($template.length ==0){
                    $template = $("<div class='nssg-th-content'></div>", $th);
                    $template.append(templates[col.type + '-th']);
                    $th.append($template);
                }
                
                $th
                    .addClass('nssg-th-' + col.type)
                    .addClass('animate')
                    $th.outerWidth(col.width);
    
                setTimeout(function(){
                    $th.removeClass('animate');
                }, 200);
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
    
            var colsWithGutter = ko.pureComputed(function(){
                var cols = ko.unwrap(gridVM.columns);
                var temp = cols.slice();
                temp.push({id:"$gutter",type:"gutter",isSortable:false, isResizable:false});
                return temp;
            });
            
            /************************/
            /**    DATA BINDING    **/
            /************************/
            ko.applyBindingsToNode(element, {
                foreach: {
                    data: colsWithGutter,
                    as: 'col'
                }
            }, bindingContext);
    
            return { controlsDescendantBindings: true };
        }
    };
    
    ko.bindingHandlers.nssgContainerSize = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    
            function updateSize() {
                var $element = $(element);
                var size = {width: $element.outerWidth(), height:$element.outerHeight()};
                var oldSize = valueAccessor()();
                if (!oldSize || oldSize.width !== size.width || oldSize.height !== size.height) {
                    valueAccessor()(size);
                }
            }
            
            var throttledUpdate = throttle({callback: updateSize, frequency:100});
            
            $(window).on('resize', throttledUpdate);
            setTimeout(throttledUpdate,50);
            
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(window).off("resize", throttledUpdate);
            });
        }
    };
    
    

    ko.NewGrid = Grid; // eslint-disable-line no-undef, no-param-reassign
    ko.NewGrid.customize = gridCustomizer; // eslint-disable-line no-undef, no-param-reassign
}));
