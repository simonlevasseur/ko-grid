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

        maxIndex = Math.min(maxIndex, originalData.length); // the last page might have less than a full page of items

        options.model.paging.firstItem = minIndex + 1;
        options.model.paging.lastItem = maxIndex + 1 - 1; // converting from a 0-based index to a 1-based index, then
                                                          // subtracting 1 because the last item is the one before the slice

        if (originalData.length === 0) {
            options.model.paging.firstItem = 0;
            options.model.paging.lastItemItem = 0;
        }

        options.model.paging.totalItems = originalData.length;

        options.model.paging.pageCount = Math.max(1, Math.ceil(originalData.length / paging.pageSize));
        options.model.data = originalData.slice(minIndex, maxIndex);
    }
};
