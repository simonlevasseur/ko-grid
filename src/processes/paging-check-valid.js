/* eslint no-unused-vars: 0 */

/************************/
/** Paging Check Valid **/
/************************/
gridState.processors['paging-check-valid'] = {
    watches: ['paging', 'data'],
    runs: function (options) {
        var paging = options.model.paging;
        var data = options.model.data;
        var didChange = false;
        if (paging.pageSize < 1 || isNaN(paging.pageSize)) {
            paging.pageSize = 1;
            didChange = true;
        }
        if (options.changed.data) {
            paging.pageCount = Math.ceil(Math.max(1, data.length / paging.pageSize));
            didChange = true;
        }
        if (paging.currentPage < 1 || isNaN(paging.currentPage)) {
            paging.currentPage = 1;
            didChange = true;
        }
        else if (paging.currentPage > paging.pageCount) {
            paging.currentPage = Math.max(1, paging.pageCount);
            didChange = true;
        }
        if (options.model.logging && didChange) {
            if (options.changed.data) {
                console.log('Data changed, Pagination options updated');
            }
            else {
                console.log('Pagination options were invalid and have been updated');
            }
        }
    }
};
