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
                console.log("Data changed, updating page Count")
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
