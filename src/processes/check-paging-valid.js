/* eslint no-unused-vars: 0 */

/************************/
/** Check Paging Valid **/
/************************/
gridState.processors['check-paging-valid'] = {
    watches: ['paging', 'data'],
    runs: function (options) {
        console.log('Validating paging options');

        var paging = options.model.paging;
        var data = options.model.data;
        if (paging.pageSize < 1) {
            paging.pageSize = 1;
        }
        paging.pageCount = Math.ceil(Math.max(1, data.length / paging.pageSize));
        if (paging.currentPage < 1) {
            paging.currentPage = 1;
        }
        else if (paging.currentPage > paging.pageCount) {
            paging.currentPage = paging.pageCount;
        }
    }
};
