/* eslint no-unused-vars: 0 */

/*****************/
/** Data Filter **/
/*****************/
gridState.processors["data-filter"] = {
    watches: ['filter', 'data'],
    runs: function (options) {
        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        if (options.model.logging) {
            console.log('Filtering the data');
        }

        if (options.model.filter !== '') {
            throw new Error('Filtering is just a placeholder for now');
        }

        // filter the data based on the filter options
    }
};
