/***********************/
/***** PAGER CLASS *****/
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
/***** PAGER STATIC *****/
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
/***** PAGER PROTOTYPE *****/
/***************************/
ko.utils.extend(Pager.prototype, {

    /*****************************/
    /***** PRIVATE FUNCTIONS *****/
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
            opts = $.extend(opts, Pager.DEFAULTS);
        }

        // If pageable option was set to true then use the defaults but enable paging.
        else if (userOptions === true) {
            opts = $.extend(opts, Pager.DEFAULTS, { enabled: true });
        }

        // User passed in some paging options so merge them with the defaults.
        // If enabled is omitted then enable it for them.
        else {
            opts = $.extend(opts, Pager.DEFAULTS, { enabled: true }, userOptions);

            // $.extend merges arrays but we want to replace.
            opts.pageSizes = userOptions.pageSizes || Pager.DEFAULTS.pageSizes;
        }

        this.enabled(opts.enabled);
        this.serverPaging(opts.serverPaging)
        this.pageSize(opts.defaultPageSize);
        this.pageSizes(opts.pageSizes);
    },

    /****************************/
    /***** COMPUTED GETTERS *****/
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
    /***** COMPUTED SETTERS *****/
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
    /***** SUBSCRIPTIONS *****/
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
    /***** UI FUNCTIONS *****/
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
