/* istanbul ignore next */
(function (factory) {
    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        factory(require('ko'), require('jquery'), exports);  // eslint-disable-line global-require
    } else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
        define(['ko', 'jquery', 'exports'], factory); // eslint-disable-line no-undef
    } else {
        factory(ko, $); // eslint-disable-line no-undef
    }
}(function (ko) {
    'use strict';
    /*********************/
    /** SYMBOL POLYFILL **/
    /*********************/
    
    var symbolDetection;
    
    try {
        symbolDetection = Symbol('foo');
    } catch (ignored) {}
    
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
templates["grid"] = "<div class=nssg-container data-bind=\"css: { isLoading: !data.loaded() }\"><table class=nssg-table><thead class=nssg-thead><tr class=nssg-thead-tr data-bind=\"nssgTheadTr: true\"><th class=nssg-th data-bind=\"nssgTh: col\"></th></tr></thead><tbody class=nssg-tobdy data-bind=\"nssgTbody: true\"><tr class=nssg-tbody-tr data-bind=\"nssgTbodyTr: true\"><td class=nssg-td data-bind=\"nssgTd: col\"></td></tr></tbody></table></div>";
templates["paging"] = "<div class=nssg-paging><div class=nssg-paging-selector-container data-bind=\"visible: showPageSelector\"><span class=nssg-paging-view>View</span><select class=nssg-paging-pages data-bind=\"options: pageSizes, value: pageSize\"></select></div><span class=nssg-paging-count data-bind=\"html: rowCountHTML\"></span><div class=nssg-paging-controls data-bind=\"visible: showPageSelector\"><a href=# class=\"nssg-paging-arrow nssg-paging-first\" data-bind=\"click: goToFirstPage, visible: currentPageIndex() !== 0\"></a> <a href=# class=\"nssg-paging-arrow nssg-paging-prev\" data-bind=\"click: goToPrevPage, visible: currentPageIndex() !== 0\"></a> <input type=text class=nssg-paging-current data-bind=\"value: currentPageIndexUI\"> <span class=nssg-paging-total data-bind=\"text: 'of ' + (maxPageIndex() + 1)\"></span> <a href=# class=\"nssg-paging-arrow nssg-paging-next\" data-bind=\"click: goToNextPage, visible: currentPageIndex() !== maxPageIndex()\"></a> <a href=# class=\"nssg-paging-arrow nssg-paging-last\" data-bind=\"click: goToLastPage, visible: currentPageIndex() !== maxPageIndex()\"></a></div></div>";
templates["actions"] = "<div class=nssg-actions-container data-bind=\"foreach: $component().options.actions\"><a href=# class=nssg-action data-bind=\"click: $component().onRowActionClick, css: css\"></a></div>";
templates["select"] = "<input type=checkbox data-bind=\"checked: $component().data.selected, checkedValue: row\">";
templates["text"] = "<div class=nssg-td-text data-bind=\"text: (typeof dataAccessor === 'function') ? dataAccessor($parent) : $parent[dataAccessor], attr: { title: (typeof dataAccessor === 'function') ? dataAccessor($parent) : $parent[dataAccessor] }\"></div>";
templates["select-th"] = "<input type=checkbox data-bind=\"checked: $component().data.allSelected, visible: multiSelect\">";
templates["text-th"] = "<div class=nssg-th-text data-bind=\"text: col.heading, attr: { title: col.heading }\"></div>";
    /*****************/
    /**     UTILS   **/
    /*****************/
    
    // All properties in objTarget which also occur in objSource will be replaced with the versions
    // from objSource.  Nested objects will be processed recursively.  Arrays will be replaced, not merged.
    function deepReplace(objTarget) {
        var objSources = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < objSources.length; i++) {
            var objSource = objSources[i];
            for (var key in objSource) {
                var value = objSource[key];
                if (typeof value === 'object' && !(Array.isArray(value) || isPromise(value))) {
                    objTarget[key] = objTarget[key] || {};
                    deepReplace(objTarget[key], value);
                } else {
                    if (Array.isArray(value)) {
                        value = value.slice();
                    }
                    objTarget[key] = value;
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
        for (name in obj) {
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
            var value = obj[key];
            if (condition(value, key, obj)) {
                predicate(value, key, obj);
            }
            if (typeof value === 'object' && !Array.isArray(value)) {
                walkObject(value, condition, predicate);
            }
        }
    }
    
    /************************/
    /**     KO EXTENDERS   **/
    /************************/
    ko.extenders.nssgSingleSelect = function (target, option) {
        // Before change clears the array before the new value is set
        target.subscribe(function (oldVal) {
            if (oldVal && oldVal.length) {
                oldVal.length = 0;
            }
        }, null, 'beforeChange');
    
        target.subscribe(function (newVal) {
            if (newVal && newVal.length > 1) {
                newVal.splice(0, newVal.length - 1);
            }
        });
    };
    

    /********************/
    /**     DEFAULTS   **/
    /********************/
    var defaultOptions = {
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
            onClick: function (rowData) {
                alert('Item invoked.');
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
                if (!dataObj) { return null; }
                return (typeof col.dataAccessor === 'function') ? col.dataAccessor(dataObj) : dataObj[col.dataAccessor];
            },
            serverSorting: false
        }
        // onOptionsChange: function (gridObj) {
        //     console.log(gridObj);
        // }
    };
    

    /**********************/
    /**    GRID CLASS    **/
    /**********************/
    var Grid = function (userOptions) {
        // IMPORTANT: The order of the variable declarations matters here
        this.data = ko.observableArray([]);
        this.data.loaded = ko.observable(false); // Flag to track when data is loading
        this.data.selected = ko.observableArray([]); // Holds all selected rows
        this.data.allSelected = ko.pureComputed({
            read: this[refGetAllSelected],
            write: this[refSetAllSelected],
            owner: this,
            deferEvaluation: true
        });
    
        this.options = this[refBuildOptions](userOptions);
    
        // Must wait for options to be built
        this.columns = ko.observableArray(this.options.columns);
        this.pager = new Pager(this.options.pageable, this.data);
        this.sorter = new Sorter(this.options.sortable, this.data);
    
        // Let's go get some data to show!
        this[refFetchData]();
    
        // Subscriptions
        this.pager.itemsOnCurrentPage.subscribe(this[refOnItemsOnCurrentPageChange], this);
    
        // React to saveable changes
        ko.computed(this[refOnSaveableChanges], this).extend({ rateLimit: 500 });
    };
    
    /**************************/
    /**     GRID PROTOTYPE   **/
    /**************************/
    ko.utils.extend(Grid.prototype, {
        /*********************/
        /**    UI EVENTS    **/
        /*********************/
    
        /**
         * Row-level action button click event handler
         */
        onRowActionClick: function (action, e) {
            var row = ko.contextFor(e.target).row; // Find the row of the action clicked
            action.onClick.call(this, row); // Execute the action's callback with the row's data
        },
    
        /**
         * Grid-level sort method
         * @param {Column} newSortCol - The new column to sort by
         * @returns true - Allows event to bubble
         */
        onSortByCol: function (newSortCol) {
            var colIsSortable;
    
            if (!ko.unwrap(this.sorter.enabled)) {
                return true; // Allow the event to bubble up, will not sort
            }
    
            colIsSortable = this.sorter.setColSort(newSortCol);
    
            if (colIsSortable && this.sorter.serverSorting) {
                this[refFetchData]();
            } else if (colIsSortable) {
                this.sorter.doSort();
            }
    
            return true;
        },
    
        /**************************/
        /**     PUBLIC METHODS   **/
        /**************************/
        refresh: function () {
            this[refFetchData]();
        }
    });
    
        /****************************/
        /**     COMPUTED METHODS   **/
        /****************************/
    
        /**
         * Returns if all items on current page are selected
         * @returns {boolean} - Returns true if all selected, false otherwise
         */
    Grid.prototype[refGetAllSelected] = function () {
            // Triggers
        var itemsOnCurrentPage = ko.unwrap(this.pager.itemsOnCurrentPage);
        var selectedData = this.data.selected();
    
        return itemsOnCurrentPage.length === selectedData.length;
    };
    
        /**
         * Selects all of the items on the current page
         */
    Grid.prototype[refSetAllSelected] = function (val) {
        this.data.selected(val ? ko.unwrap(this.pager.itemsOnCurrentPage).slice(0) : []);
    };
    
        /***************************/
        /**     PRIVATE METHODS   **/
        /***************************/
    
        /**
         * Takes in user-defined options and builds a complete options object
         * @param {Object} userOptions - User-defined options
         * @returns {Object} - Complete grid options
         */
    Grid.prototype[refBuildOptions] = function (userOptions) {
        var selectCol;
        var actionsCol;
    
        var options = {
            actions: [], // This property is required for deletable and invokable
            pageable: {}, // This option is required by the pager class
            sortable: {} // This option is required by the sorter class
        };
    
            // Merge the user's options into the default options
        ko.utils.objectForEach(userOptions, function (key, value) {
                // If user entered true for a complex option then use the default options
            if (isObject(defaultOptions[key]) && value === true) {
                options[key] = defaultOptions[key];
            } else { // Merge the user's options into the default options
                options[key] = defaultOptions[key] ? deepReplace({}, defaultOptions[key], value) : value;
            }
        });
    
            // Set all undefined column types to text
        ko.utils.arrayForEach(options.columns, function (col) {
            if (!col.type) {
                col.type = 'text'; // eslint-disable-line no-param-reassign
            }
        });
    
            // Add delete row action
        if (options.deletable) {
            options.actions.push(options.deletable); // Make it the last action
        }
    
            // Add invoke row action
        if (options.invokable) {
            options.actions.unshift(options.invokable); // Make it the first action
        }
    
            // Add select column
        if (options.selectable) {
            selectCol = deepReplace({}, options.selectable, {
                type: 'select',
                resizable: false,
                sortable: false
            });
    
                // If single select only, then extend the observable array to only ever hold one value
            if (!options.selectable.multiSelect) {
                this.data.selected.extend({ nssgSingleSelect: true });
            }
    
            options.columns.unshift(selectCol);
        }
    
            // Add actions column
        if (options.actions && options.actions.length) {
            actionsCol = {
                type: 'actions',
                resizable: false,
                sortable: false,
                width: 0,
                minWidth: 0,
                maxWidth: 0
            };
    
            options.columns.unshift(actionsCol);
        }
    
        if (options.sortable.defaultSortCol) {
            options.sortable.defaultSortCol = this[refFindColById](options.sortable.defaultSortCol, options.columns);
        }
    
        return options;
    };
    
    Grid.prototype[refEmitChange] = function () {
        if (this.options.onOptionsChange) {
            this.options.onOptionsChange(this[refGetSaveableGridObj]());
        }
    };
    
        /**
         * Fetches and sets data based on currently set parameters
         * @returns {Array|ObservableArray|Promise} - Returns the data array or a promise
         */
    Grid.prototype[refFetchData] = function () {
        var dataOption = this.options.data;
        var params;
        var self = this;
    
        this.data.loaded(false); // Shows the loading icon
    
        if (isArray(dataOption)) {
            this.data(dataOption);
            this[refSortData]();
            this.data.loaded(true);
        } else if (isObservableArray(dataOption)) {
            this.data = dataOption;
            this[refSortData]();
            this.data.loaded(true);
        } else if (isFunction(dataOption)) {
                // Gather parameters that are required to fetch remote data
            params = {
                start: ko.unwrap(this.pager.currentPageIndex) * ko.unwrap(this.pager.pageSize), // Record start index
                count: ko.unwrap(this.pager.pageSize), // Record count
                sortBy: ko.unwrap(this.sorter.currentSortCol),
                sortDir: ko.unwrap(this.sorter.currentSortDir)
            };
    
            dataOption(params).then(function (dto) {
                var data = ko.unwrap(dto.data).slice(0); // Array clone to ensure proper data
                self.data(data);
    
                    // When using server paging we must depend on the provider to tell
                    // us the total number of records available.
                if (ko.unwrap(self.pager.serverPaging)) {
                    self.pager.totalItems(dto.total);
                }
    
                self.data.loaded(true);
            });
        }
    };
    
        /**
         * Finds a column by the column definition ID property
         * @param {String} colId - ID of the column to find
         * @param {Array|ObservableArray} [cols] - The optional set of columns to use in the search
         * @returns {Column} - The column matching the passed in ID
         */
    Grid.prototype[refFindColById] = function (colId, cols) {
        var columns = ko.unwrap(cols) || this.columns();
    
        return ko.utils.arrayFirst(columns, function (col) {
            return col.id === colId;
        });
    };
    
    Grid.prototype[refGetSaveableGridObj] = function () {
        var obj = {
            columns: [],
            pageable: {
                defaultPageSize: ko.unwrap(this.pager.pageSize)
            },
            sortable: {
                defaultSortCol: this.sorter.currentSortCol() ? this.sorter.currentSortCol().id : null,
                defaultSortDir: this.sorter.currentSortDir()
            }
        };
    
        ko.utils.arrayForEach(this.columns(), function (col) {
            if (col.type !== 'actions' && col.type !== 'select') {
                obj.columns.push({ id: col.id, width: col.width });
            }
        });
    
        return obj;
    };
    
        /**
         * Gets the data that would be displayed in the grid's cell
         * @param {Object} dataObj - The data object that is used for the current row
         * @param {Column} col - The current sort column object
         * @returns {*} - The data that is displayed in the cell
        */
    Grid.prototype[refGetValueForCol] = function (dataObj, col) {
        if (!dataObj) { return null; }
        return (typeof col.dataAccessor === 'function') ? col.dataAccessor(dataObj) : dataObj[col.dataAccessor];
    };
    
        /**
         * Attempts to sort the data according to currently set parameters
         */
    Grid.prototype[refSortData] = function () {
        if (this.sorter.enabled()) {
            this.sorter.doSort();
        }
    };
    
        /*************************/
        /**     SUBSCRIPTIONS   **/
        /*************************/
    
        /**
         * Event handler for when items on current page changes
         * Removes the selection items that are no longer displayed on the page
         * @param {Array} itemsOnCurrentPage - The new array of items displayed on the current page
         */
    Grid.prototype[refOnItemsOnCurrentPageChange] = function (itemsOnCurrentPage) {
        var selectedData = this.data.selected.peek();
        var newSelectedData = [];
    
        ko.utils.arrayForEach(selectedData, function (item) {
            if (itemsOnCurrentPage.indexOf(item) !== -1) {
                newSelectedData.push(item);
            }
        });
    
        this.data.selected(newSelectedData);
    };
    
    Grid.prototype[refOnSaveableChanges] = function () {
            // Triggers
        ko.unwrap(this.columns); // Column visibility and order
        ko.unwrap(this.pager.pageSize);
        ko.unwrap(this.sorter.currentSortCol);
        ko.unwrap(this.sorter.currentSortDir);
    
            // Action
        if (!ko.computedContext.isInitial()) {
            this[refEmitChange]();
        }
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
    var Pager = function (options, data) {
        // Options
        this.enabled = ko.observable();
        this.serverPaging = ko.observable();
        this.pageSizes = ko.observableArray();
        this.pageSize = ko.observable();
    
        // Variables
        this.data = data;
        this.currentPageIndex = ko.observable(0).extend({ notify: 'always' }); // Notify always so currentPageIndexUI re-evaluates after invalid values are entered
        this.itemsOnCurrentPage = ko.pureComputed({
            read: this.getItemsOnCurrentPage,
            deferEvaluation: true,
            owner: this
        }).extend({ rateLimit: { method: 'notifyWhenChangesStop', timeout: 10 } }); // Timeout of 10 seems to works better for FF instead of 0
        this.maxPageIndex = ko.pureComputed(this.getMaxPageIndex, this);
        this.totalItems = ko.unwrap(this.serverPaging) ? ko.observable(0) : ko.pureComputed(this.getTotalLocalItems, this);
    
        // UI Variables
        this.currentPageIndexUI = ko.pureComputed({
            read: this.getCurrentPageIndexUI,
            write: this.setCurrentPageIndexUI,
            owner: this
        }).extend({ notify: 'always' }); // Notify always so currentPageIndexUI re-evaluates after invalid values are entered
        this.rowStartUI = ko.pureComputed(this.getRowStartUI, this);
        this.rowEndUI = ko.pureComputed(this.getRowEndUI, this);
        this.rowCountHTML = ko.pureComputed(this.getRowCountHTML, this);
        this.showPageSelector = ko.pureComputed(this.getShowPageSelector, this);
    
        // Subscriptions
        this.pageSizes.subscribe(this.onPageSizesChange, this);
        this.pageSize.subscribe(this.onPageSizeChange, this);
    
        // Build options last
        this.buildOptions(options);
    };
    
    /************************/
    /**     PAGER STATIC   **/
    /************************/
    ko.utils.extend(Pager, {
        DEFAULTS: {
            enabled: false,
            defaultPageSize: 10,
            pageSizes: [10, 50, 100, 500, 1000],
            serverPaging: false
        }
    });
    
    /***************************/
    /**     PAGER PROTOTYPE   **/
    /***************************/
    ko.utils.extend(Pager.prototype, {
    
        /*****************************/
        /**     PRIVATE FUNCTIONS   **/
        /*****************************/
    
        /**
         * Builds the pager options by using the default and the user's options
         * Involves logic to handle complex options and proper setting of initial options
         */
        buildOptions: function (userOptions) {
            var opts = {};
    
            // If pageable option was not set or was set to false then use the defaults. (Disabled by default)
            if (!userOptions || isEmptyObject(userOptions)) {
                // Clone options to protect defaults from being modified
                opts = deepReplace(opts, Pager.DEFAULTS);
            }
    
            // If pageable option was set to true then use the defaults but enable paging.
            else if (userOptions === true) {
                opts = deepReplace(opts, Pager.DEFAULTS, { enabled: true });
            }
    
            // User passed in some paging options so merge them with the defaults.
            // If enabled is omitted then enable it for them.
            else {
                opts = deepReplace(opts, Pager.DEFAULTS, { enabled: true }, userOptions);
            }
    
            this.enabled(opts.enabled);
            this.serverPaging(opts.serverPaging);
            this.pageSize(opts.defaultPageSize);
            this.pageSizes(opts.pageSizes);
        },
    
        /****************************/
        /**     COMPUTED GETTERS   **/
        /****************************/
    
        /**
         * Pure Computed Read - Gets all the items to display on the current page
         * @returns {Array} - Returns an array of data
         */
        getItemsOnCurrentPage: function () {
            // Computed Triggers
            var pageSize = ko.unwrap(this.pageSize),
                currentPageIndex = ko.unwrap(this.currentPageIndex),
                allData = ko.unwrap(this.data),
                enabled = ko.unwrap(this.enabled),
                serverPaging = ko.unwrap(this.serverPaging),
                totalItems = ko.unwrap(this.totalItems),
    
            // Private Variables
                startIndex = pageSize * currentPageIndex,
                endIndex = (startIndex + pageSize) || totalItems - 1;
    
            // If the paging is disabled, return all data
            if (!enabled) {
                return allData;
            }
    
            // Server paging modifies the data array to only hold data for the current page.
            // This means we want to return that entire array starting at index 0.
            // In case the server returned an incorrect number of items, we will slice it
            // with the pageSize instead of returning it all as-is.
            if (serverPaging) {
                startIndex = 0;
                endIndex = pageSize;
            }
    
            return allData.slice(startIndex, endIndex);
        },
    
        /**
         * Pure Computed Read - Gets the total # of items in the entire dataset (not data array)
         * @returns {Number} - The total # of items
         */
        getTotalLocalItems: function () {
            // Computed Triggers
            var allData = ko.unwrap(this.data);
    
            return allData.length;
        },
    
        /**
         * Pure Computed Read - Gets the max (last) page index in a 0-based format
         * @returns {Number} - The last 0-based page index
         */
        getMaxPageIndex: function () {
            // Computed Triggers
            var totalItems = ko.unwrap(this.totalItems),
                pageSize = ko.unwrap(this.pageSize) || totalItems || 1,
                // Page size is generally a positive integer, however when the page size is set to 0
                // (to show unlimited items) then it will result in an illegal division by 0. (ex: 10/0 = NaN)
                // In this scenario we use the total items as the denominator. (ex: 10/10 = 1)
                // If total items is 0 then we have another division by 0 so we default to 1. (ex: 0/1 = 0)
    
            // Private Variables
                maxPageIndex = Math.ceil(totalItems / pageSize) - 1; // Will be -1 if no items
    
            return Math.max(0, maxPageIndex);
        },
    
        /**
         * Pure Computed Read - Gets the max (last) page index in a 1-based format
         * This is a human-readable format.
         * @returns {Number} - The last 1-based page index
         */
        getCurrentPageIndexUI: function () {
            // Computed Triggers
            var currentPageIndex = ko.unwrap(this.currentPageIndex);
    
            return currentPageIndex + 1;
        },
    
        /**
         * Pure Computed Read - Gets the first row number on the current page in a 1-based format
         * On page 2 with a page size of 50 means this will return 51.
         * @returns {Number} - The first 1-based row number
         */
        getRowStartUI: function () {
            // Computed Triggers
            var page = ko.unwrap(this.currentPageIndex),
                pageSize = ko.unwrap(this.pageSize),
                totalItems = ko.unwrap(this.totalItems);
    
            return totalItems > 0 ? (page * pageSize) + 1 : 0;
        },
    
        /**
         * Pure Computed Read - Gets the last row number on the current page in a 1-based format
         * On page 2 with a page size of 50 means this will return 100.
         * @returns {Number} - The last 1-based row number
         */
        getRowEndUI: function () {
            // Computed Triggers
            var rowStart = ko.unwrap(this.rowStartUI),
                pageSize = ko.unwrap(this.pageSize),
                totalItems = ko.unwrap(this.totalItems),
    
            // Private Variables
                rowEnd = (rowStart + pageSize - 1) || totalItems; // If rowEnd is 0 we are showing unlimited
    
            return Math.min(rowEnd, totalItems);
        },
    
        /**
         * Pure Computed Read - Gets the row count HTML template using 1-based indexes
         * @returns {HTML string} - Row count HTML
         */
        getRowCountHTML: function () {
            // Computed Triggers
            var start = ko.unwrap(this.rowStartUI),
                end = ko.unwrap(this.rowEndUI),
                total = ko.unwrap(this.totalItems),
                showingPageSelector = ko.unwrap(this.getShowPageSelector);
    
            if (showingPageSelector) {
                return 'Showing <strong>' + start + '-' + end + '</strong> of <strong>' + total + '</strong>';
            } else {
                return 'Showing <strong>' + total + '</strong> records.';
            }
        },
    
        getShowPageSelector: function () {
            // Computed Triggers
            var enabled = ko.unwrap(this.enabled),
                pageSizes = ko.unwrap(this.pageSizes),
    
            // Private Variables
                hasOnePageOption = pageSizes.length === 1,
                firstOptionIsUnlimited = pageSizes[0] === 0;
    
            return enabled && (!hasOnePageOption || !firstOptionIsUnlimited);
        },
    
    
        /****************************/
        /**     COMPUTED SETTERS   **/
        /****************************/
    
        /**
         * Pure Computed Write - Sets the current page index to a new value entered in the UI
         * Also does error-handling and updates the observable
         */
        setCurrentPageIndexUI: function (val) {
            // Private Variables
            var val = isNaN(val) ? 1 : val, // Set back to page 1 if something invalid was entered
                newIndex = val - 1; // Convert to 0-based index
    
            this.goToPage(newIndex);
        },
    
        /*************************/
        /**     SUBSCRIPTIONS   **/
        /*************************/
    
        /**
         * Runs whenever the page sizes array changes.
         * Selects the first page size if the current option is no longer valid.
         */
        onPageSizesChange: function (sizes) {
            if (!isArray(sizes) || !sizes.length) {
                throw new Error('Invalid page sizes. An array of integers with at least one value is expected.');
            }
    
            // Private Variables
            var pageSize = ko.unwrap(this.pageSize);
    
            // If the current page size is no longer valid then pick the first available page size
            if (sizes.indexOf(pageSize) === -1) {
                this.pageSize(sizes[0]);
            }
        },
    
        /**
         * Runs whenever page size changes.
         * Goes back to the first page.
         */
        onPageSizeChange: function (pageSize) {
            // Design Decision: If the user changes the page size we go back to the first page to avoid confusion
            this.goToFirstPage();
        },
    
        /************************/
        /**     UI FUNCTIONS   **/
        /************************/
    
        /**
         * Goes to the page requested
         * Protects against invalid values
         */
        goToPage: function (pageIndex) {
            // Private Variables
            var maxPageIndex = ko.unwrap(this.maxPageIndex);
    
            // Index too big
            if (pageIndex > maxPageIndex) {
                this.currentPageIndex(maxPageIndex);
            }
    
            // Index too small
            else if (pageIndex < 0) {
                this.currentPageIndex(0);
            }
    
            // Update the observable to execute the change
            else {
                this.currentPageIndex(pageIndex);
            }
        },
    
        /**
         * Goes to the first page
         */
        goToFirstPage: function () {
            this.goToPage(0);
        },
    
        /**
         * Goes to the last page
         */
        goToLastPage: function () {
            // Private Variables
            var maxPageIndex = ko.unwrap(this.maxPageIndex);
    
            this.goToPage(maxPageIndex);
        },
    
        /**
         * Goes to the prev page (if possible)
         */
        goToPrevPage: function () {
            // Private Variables
            var currentPageIndex = ko.unwrap(this.currentPageIndex);
    
            this.goToPage(currentPageIndex - 1);
        },
    
        /**
         * Goes to the next page (if possible)
         */
        goToNextPage: function () {
            // Private Variables
            var currentPageIndex = ko.unwrap(this.currentPageIndex);
    
            this.goToPage(currentPageIndex + 1);
        }
    });
    

    /************************/
    /**     SORTER CLASS   **/
    /************************/
    var Sorter = function (options, data) {
        // Options
        this.enabled = options.enabled || true;
        this.serverSorting = options.serverSorting || false;
        this.defaultSortCol = options.defaultSortCol || undefined;
        this.defaultSortDir = options.defaultSortDir || 'asc';
        this.dataAccessor = (typeof options.dataAccessor === 'function') ? options.dataAccessor : function (dataObj, col) { dataObj[col.dataAccessor]; };
    
        // Variables
        this.data = data;
        this.currentSortCol = ko.observable();
        this.currentSortDir = ko.observable();
    
        // Init
        this.init();
    };
    
    /****************************/
    /**     SORTER PROTOTYPE   **/
    /****************************/
    ko.utils.extend(Sorter.prototype, {
        /**
         * Initialize the Sorter class instance
         * Set the default sorting column and direction
         */
        init: function () {
            var defSortCol = this.defaultSortCol,
                defSortDir = this.defaultSortDir;
    
            // Set initial column sort if defined
            defSortCol && this.setColSort(defSortCol, defSortDir);
        },
    
        /**
         * Sets a new column to sort by
         * This function does NOT sort
         * @param {Column} newSortCol - New column to sort by
         * @param {'asc'|'desc'} [newSortDir='asc'] - New sort direction
         * @returns {boolean} - Returns whether or not the new column was sortable
         */
        setColSort: function (newSortCol, newSortDir) {
            // Abort if column is not sortable
            if (ko.unwrap(newSortCol.sortable) === false) {
                return false;
            }
    
            var oldSortCol = this.currentSortCol(),
                oldSortDir = this.currentSortDir();
    
            // Set observable to new column
            this.currentSortCol(newSortCol);
    
            // Determine & Set new sort direction
            if (!newSortDir) {
                newSortDir = 'asc';
                if (oldSortCol === newSortCol) {
                    newSortDir = (oldSortDir === 'asc') ? 'desc' : 'asc';
                }
            }
    
            // Set observable to new sort direction
            this.currentSortDir(newSortDir);
    
            return true;
        },
    
        /**
         * Sorts the data based on current observable values
         */
        doSort: function () {
            // Server sorting is done by the data provider, not us
            if (this.serverSorting) {
                return;
            }
    
            var sortCol = this.currentSortCol(),
                sortDir = this.currentSortDir(),
                sortFn = sortCol.sortFunction,
                data = this.data;
    
            if (!sortFn) {
                var sampleDataItem = ko.utils.arrayFirst(ko.unwrap(data), function (datum) {
                        return this.dataAccessor(datum, sortCol);
                    }, this),
                    dataValue = this.dataAccessor(sampleDataItem, sortCol);
    
                sortFn = Sorter.guessSortFn(dataValue);
            }
    
            // Sort the data!
            data.sort(function (a, b) {
                var valueA = this.dataAccessor(a, sortCol),
                    valueB = this.dataAccessor(b, sortCol);
    
                return sortDir === 'desc' ? -(sortFn(valueA, valueB)) : sortFn(valueA, valueB);
            }.bind(this));
        }
    });
    
    /**********************************/
    /**     SORTER CLASS EXTENSION   **/
    /**********************************/
    ko.utils.extend(Sorter, {
        /**
         * Guess the sorting method for the item type
         * @param {*} item - Sample item to guess the sort type
         * @returns {Function} - The suggested sort function
         */
        guessSortFn: function (item) {
            var itemType = typeof item;
    
            switch (itemType) {
            case 'number':
                return Sorter.sortNumerically;
            default:
                return Sorter.sortAlphabetically;
            }
        },
    
        /**
         * Alphabetical compare method, returns 1 if (a > b), 0 if (a = b), -1 (a < b)
         * @param {string} a - The first string in the compare
         * @param {string} b - The second string in the compare
         * @returns {number} - Value representing if a is smaller, bigger or equal to b
         */
        sortAlphabetically: function (a, b) {
            var strA = a ? a.toLowerCase() : a,
                strB = b ? b.toLowerCase() : b;
            return strA === strB ? 0 : (strA < strB ? -1 : 1);
        },
    
        /**
         * Numerical compare method, returns 1 if (a > b), 0 if (a = b), -1 (a < b)
         * @param {number} a - The first number in the compare
         * @param {number} b - The second number in the compare
         * @returns {number} - Value representing if a is smaller, bigger or equal to b
         */
        sortNumerically: function (a, b) {
            return a - b;
        }
    });
    

   /****************************/
   /**     CUSTOMIZER CLASS   **/
   /****************************/
   var gridCustomizer;
   gridCustomizer = function (baseOptions, baseInitializer) {
       return function CustomizedGrid(overrideOptions, overrideInitializer) {
           var actualGrid = ko.observable();
           init();
           return actualGrid;
           // /////////////////////////
   
           function init() {
               var realOptions = {};
   
               loadBaseOptions()
                   .then(loadOverrideOptions)
                   .then(addTemplates)
                   .then(initActualGrid)
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
            createViewModel: function (params, componentInfo) {
                return params.vm;
            }
        },
        template: templates.grid
    });
    

    ko.components.register('grid-paging', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                return params.vm;
            }
        },
        template: templates.paging
    });
    


    /********************/
    /**     BINDINGS   **/
    /********************/
    (function () {
        ko.bindingHandlers.nssgTheadTr = {
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
    
                    gridVM.onSortByCol(column);
                });
    
                /***************************/
                /**     COLUMN RESIZING   **/
                /***************************/
                if (gridVM.options.resizable) {
                    containerWidth = $container.width(); // Without borders
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
            var cols = ko.unwrap(columns);
            var cumulativeWidths = 0;
            var difference = null;
    
            // Set all column width and minWidth
            ko.utils.arrayForEach(cols, function (col) {
                if (col.minWidth === undefined) {
                    col.minWidth = 80; // eslint-disable-line no-param-reassign
                }
    
                if (col.width === undefined) {
                    col.width = col.minWidth; // eslint-disable-line no-param-reassign
                }
    
                cumulativeWidths += col.width;
            });
    
            // Our columns don't fill the container :(
            if (cumulativeWidths < containerWidth) {
                difference = containerWidth - cumulativeWidths;
    
                // Make the last column take up the remaining space
                cols[cols.length - 1].width += difference;
    
                cumulativeWidths += difference;
            }
    
            return cumulativeWidths;
        }
    }());
    

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
    

    ko.bindingHandlers.nssgTd = {
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
    

    ko.bindingHandlers.nssgTbody = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
            var itemsOnCurrentPage = gridVM.pager.itemsOnCurrentPage;
    
            /************************/
            /**     DATA BINDING   **/
            /************************/
            ko.applyBindingsToNode(element, {
                foreach: {
                    data: itemsOnCurrentPage,
                    as: 'row'
                }
            }, bindingContext);
    
            return { controlsDescendantBindings: true };
        }
    };
    

    ko.bindingHandlers.nssgTbodyTr = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var gridVM = ko.unwrap(bindingContext.$component);
            var cols = gridVM.columns;
    
            /************************/
            /**    DATA BINDING    **/
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
    


    ko.Grid = Grid; // eslint-disable-line no-undef, no-param-reassign
    ko.Grid.Sorter = Sorter; // eslint-disable-line no-undef, no-param-reassign
    ko.Grid.Pager = Pager; // eslint-disable-line no-undef, no-param-reassign
    ko.Grid.customize = gridCustomizer; // eslint-disable-line no-undef, no-param-reassign
}));
