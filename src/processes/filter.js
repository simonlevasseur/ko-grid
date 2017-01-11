/* eslint no-unused-vars: 0 */

/*****************/
/** Filter Data **/
/*****************/
gridState.processors.filter = {
    watches: ['filter', 'data'],
    runs: function (options) {
        console.log('Filtering the data');

        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        // filter the data based on the filter options
    }
};
