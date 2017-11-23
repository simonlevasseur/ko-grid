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
