/* eslint no-unused-vars: 0 */

/***************/
/** Page Data **/
/***************/
gridState.processors.paging = {
    watches: ['paging', 'data'],
    runs: function (options) {
        console.log('Splitting data into pages');

        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        // Page the data based on the page options
    }
};
