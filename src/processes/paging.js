/* eslint no-unused-vars: 0 */

/***************/
/** Page Data **/
/***************/
gridState.processors.paging = {
    watches: ['paging', 'data'],
    runs: function (options) {
        console.log('Splitting data into pages');

        var paging = options.model.paging;
        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;
        
        var minIndex = paging.pageSize * (paging.currentPage - 1);
        var maxIndex = minIndex + paging.pageSize;
        
        options.model.data = originalData.slice(minIndex, maxIndex)
    }
};
