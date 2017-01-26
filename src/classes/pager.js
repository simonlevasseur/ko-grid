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
    this.pageSizes = propertyAsObservable(gridVM.paging, "pageSizes");
    this.maxPageIndex = propertyAsObservable(gridVM.paging, "pageCount");
    this.firstItem = propertyAsObservable(gridVM.paging, "firstItem");
    this.totalItems = propertyAsObservable(gridVM.paging, "totalItems");
    this.currentPageIndex = ko.pureComputed({read:function(){
        return gridVM.paging().currentPage;
    },write:function(newValue){
        gridVM.process({paging:{currentPage:newValue}});
    }});
    this.pageSize = ko.pureComputed({read:function(){
        return gridVM.paging().pageSize;
    },write:function(newValue){
        gridVM.process({paging:{pageSize:newValue}});
    }});

    // UI Variables
    this.currentPageIndexUI = ko.observable; // Notify always so currentPageIndexUI re-evaluates after invalid values are entered
    
    /*****************************/
    /**     PRIVATE FUNCTIONS   **/
    /*****************************/

    /**
     * Goes to the page requested
     * Protects against invalid values
     */
    this.goToPage= function (pageIndex) {
        gridVM.process({paging:{currentPage:pageIndex}});
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
    this.goToPrevPage= function () {
        this.goToPage(gridVM.paging().currentPage - 1);
    };

    /**
     * Goes to the next page (if possible)
     */
    this.goToNextPage= function () {
        this.goToPage(gridVM.paging().currentPage + 1);
    };
};

function propertyAsObservable(obs, prop)
{
    return ko.pureComputed(function(){
        var unwrapped = ko.unwrap(obs);
        return unwrapped ? unwrapped[prop] : undefined;
    });
}