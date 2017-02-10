/* eslint no-unused-vars: 0 */

/*****************/
/** Data Paging **/
/*****************/
gridState.processors['data-paging'] = {
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
