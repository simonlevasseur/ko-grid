/**********************/
/***** GRID CLASS *****/
/**********************/
var Grid = function (userOptions) {
    // IMPORTANT: The order of the variable declarations matters here
    this.data = ko.observableArray([]);
    this.data.loaded = ko.observable(false); // Flag to track when data is loading
    this.data.selected = ko.observableArray([]); // Holds all selected rows
    this.data.allSelected = ko.pureComputed({
        read: this._getAllSelected,
        write: this._setAllSelected,
        owner: this,
        deferEvaluation: true
    });

    this.options = this._buildOptions(userOptions);

    // Must wait for options to be built
    this.columns = ko.observableArray(this.options.columns);
    this.pager = new Pager(this.options.pageable, this.data);
    this.sorter = new Sorter(this.options.sortable, this.data);

    // Let's go get some data to show!
    this._fetchData();

    // Subscriptions
    this.pager.itemsOnCurrentPage.subscribe(this._onItemsOnCurrentPageChange, this);

    // React to saveable changes
    ko.computed(this._onSaveableChanges, this).extend({ rateLimit: 500 });
};

/**************************/
/***** GRID PROTOTYPE *****/
/**************************/
ko.utils.extend(Grid.prototype, {
    /****************************/
    /***** COMPUTED METHODS *****/
    /****************************/

    /**
     * Returns if all items on current page are selected
     * @returns {boolean} - Returns true if all selected, false otherwise
     */
    _getAllSelected: function () {
        // Triggers
        var itemsOnCurrentPage = ko.unwrap(this.pager.itemsOnCurrentPage),
            selectedData = this.data.selected();

        return itemsOnCurrentPage.length === selectedData.length;
    },

    /**
     * Selects all of the items on the current page
     */
    _setAllSelected: function (val) {
        this.data.selected(val ? ko.unwrap(this.pager.itemsOnCurrentPage).slice(0) : []);
    },

    /***************************/
    /***** PRIVATE METHODS *****/
    /***************************/

    /**
     * Takes in user-defined options and builds a complete options object
     * @param {Object} userOptions - User-defined options
     * @returns {Object} - Complete grid options
     */
    _buildOptions: function (userOptions) {
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
                col.type = 'text';
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
            var selectCol = deepReplace({}, options.selectable, {
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
            var actionsCol = {
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
            options.sortable.defaultSortCol = this._findColById(options.sortable.defaultSortCol, options.columns);
        }

        return options;
    },

    _emitChange: function () {
        if (this.options.onOptionsChange) {
            this.options.onOptionsChange(this._getSaveableGridObj());
        }
    },

    /**
     * Fetches and sets data based on currently set parameters
     * @returns {Array|ObservableArray|Promise} - Returns the data array or a promise
     */
    _fetchData: function () {
        this.data.loaded(false); // Shows the loading icon

        var dataOption = this.options.data;

        if (isArray(dataOption)) {
            this.data(dataOption);
            this._sortData();
            this.data.loaded(true);
        } else if (isObservableArray(dataOption)) {
            this.data = dataOption;
            this._sortData();
            this.data.loaded(true);
        } else if (isFunction(dataOption)) {
            // Gather parameters that are required to fetch remote data
            var params = {
                start: ko.unwrap(this.pager.currentPageIndex) * ko.unwrap(this.pager.pageSize), // Record start index
                count: ko.unwrap(this.pager.pageSize), // Record count
                sortBy: ko.unwrap(this.sorter.currentSortCol),
                sortDir: ko.unwrap(this.sorter.currentSortDir)
            };

            var self = this;
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
    },

    /**
     * Finds a column by the column definition ID property
     * @param {String} colId - ID of the column to find
     * @param {Array|ObservableArray} [cols] - The optional set of columns to use in the search
     * @returns {Column} - The column matching the passed in ID
     */
    _findColById: function (colId, cols) {
        var columns = ko.unwrap(cols) || this.columns();

        return ko.utils.arrayFirst(columns, function (col) {
            return col.id === colId;
        });
    },

    _getSaveableGridObj: function () {
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
    },

    /**
     * Gets the data that would be displayed in the grid's cell
     * @param {Object} dataObj - The data object that is used for the current row
     * @param {Column} col - The current sort column object
     * @returns {*} - The data that is displayed in the cell
    */
    _getValueForCol: function (dataObj, col) {
        if (!dataObj) { return null; }
        return (typeof col.dataAccessor === 'function') ? col.dataAccessor(dataObj) : dataObj[col.dataAccessor];
    },

    /**
     * Attempts to sort the data according to currently set parameters
     */
    _sortData: function () {
        if (this.sorter.enabled()) {
            this.sorter.doSort();
        }
    },

    /*************************/
    /***** SUBSCRIPTIONS *****/
    /*************************/

    /**
     * Event handler for when items on current page changes
     * Removes the selection items that are no longer displayed on the page
     * @param {Array} itemsOnCurrentPage - The new array of items displayed on the current page
     */
    _onItemsOnCurrentPageChange: function (itemsOnCurrentPage) {
        var selectedData = this.data.selected.peek(),
            newSelectedData = [];

        ko.utils.arrayForEach(selectedData, function (item, index) {
            if (itemsOnCurrentPage.indexOf(item) !== -1) {
                newSelectedData.push(item);
            }
        });

        this.data.selected(newSelectedData);
    },

    _onSaveableChanges: function () {
        // Triggers
        ko.unwrap(this.columns); // Column visibility and order
        ko.unwrap(this.pager.pageSize);
        ko.unwrap(this.sorter.currentSortCol);
        ko.unwrap(this.sorter.currentSortDir);

        // Action
        if (!ko.computedContext.isInitial()) {
            this._emitChange();
        }
    },

    /*********************/
    /***** UI EVENTS *****/
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
     * @param {Event} e - jQuery event object
     * @returns true - Allows event to bubble
     */
    onSortByCol: function (newSortCol, e) {
        if (!ko.unwrap(this.sorter.enabled)) {
            return true; // Allow the event to bubble up, will not sort
        }

        var colIsSortable = this.sorter.setColSort(newSortCol);

        if (colIsSortable && this.sorter.serverSorting) {
            this._fetchData();
        } else if (colIsSortable) {
            this.sorter.doSort();
        }

        return true;
    },

    /**************************/
    /***** PUBLIC METHODS *****/
    /**************************/
    refresh: function () {
        this._fetchData();
    }
});
