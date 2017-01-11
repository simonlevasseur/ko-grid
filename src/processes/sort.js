/* eslint no-unused-vars: 0 */

/***************/
/** Sort Data **/
/***************/
gridState.processors.sort = {
    watches: ['sort', 'data'],
    runs: function (options) {
        console.log('Sorting the data');

        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        // Sort the data based on the sort options
    }
};
