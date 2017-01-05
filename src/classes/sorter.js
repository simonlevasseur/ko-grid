/************************/
/**     SORTER CLASS   **/
/************************/
var Sorter = function (options, data) {
    // Options
    this.enabled = options.enabled || true;
    this.serverSorting = options.serverSorting || false;
    this.defaultSortCol = options.defaultSortCol || undefined;
    this.defaultSortDir = options.defaultSortDir || 'asc';
    this.dataAccessor = (typeof options.dataAccessor === 'function') ? options.dataAccessor : function (dataObj, col) {
        return dataObj[col.dataAccessor];
    };

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
        var defSortCol = this.defaultSortCol;
        var defSortDir = this.defaultSortDir;

        // Set initial column sort if defined
        if (defSortCol) {
            this.setColSort(defSortCol, defSortDir);
        }
    },

    /**
     * Sets a new column to sort by
     * This function does NOT sort
     * @param {Column} newSortCol - New column to sort by
     * @param {'asc'|'desc'} [newSortDir='asc'] - New sort direction
     * @returns {boolean} - Returns whether or not the new column was sortable
     */
    setColSort: function (newSortCol, newSortDir) {
        var oldSortCol;
        var oldSortDir;

        // Abort if column is not sortable
        if (ko.unwrap(newSortCol.sortable) === false) {
            return false;
        }

        oldSortCol = this.currentSortCol();
        oldSortDir = this.currentSortDir();

        // Set observable to new column
        this.currentSortCol(newSortCol);

        // Determine & Set new sort direction
        if (!newSortDir) {
            newSortDir = 'asc'; // eslint-disable-line no-param-reassign
            if (oldSortCol === newSortCol) {
                newSortDir = (oldSortDir === 'asc') ? 'desc' : 'asc'; // eslint-disable-line no-param-reassign
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

        var sortCol = this.currentSortCol();
        var sortDir = this.currentSortDir();
        var sortFn = sortCol.sortFunction;
        var data = this.data;
        var sampleDataItem;
        var dataValue;

        if (!sortFn) {
            sampleDataItem = ko.utils.arrayFirst(ko.unwrap(data), function (datum) {
                return this.dataAccessor(datum, sortCol);
            }, this);
            dataValue = this.dataAccessor(sampleDataItem, sortCol);

            sortFn = Sorter.guessSortFn(dataValue);
        }

        // Sort the data!
        data.sort(function (a, b) {
            var valueA = this.dataAccessor(a, sortCol);
            var valueB = this.dataAccessor(b, sortCol);

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
        var strA = a ? a.toLowerCase() : a;
        var strB = b ? b.toLowerCase() : b;
        if (strA === strB) {
            return 0;
        }
        else {
            return strA < strB ? -1 : 1;
        }
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
