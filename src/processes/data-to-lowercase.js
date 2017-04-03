    /* eslint no-unused-vars: 0 */

/****************************/
/** Data to Lowercase  **/
/****************************/
gridState.processors['data-to-lowercase'] = {
    watches: ['filter', 'data'],
    runs: function (options) {
        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        if (!options.model.filter) {
            // we don't need to aggregate the data as it's not being used right now
            return;
        }

        if (options.model.data.length === 0) {
            // there's no data
            return;
        }

        if (!options.changed.data && options.model.data[0].$lower) {
            // the data didn't change and we already made the aggregate so nothing to do
            return;
        }

        if (options.model.logging) {
            console.log('Running toLowerCase on the data');
        }

        options.model.data = originalData.map(function (row) {
            var temp = {};
            var lower = {};
            for (var key in row) {
                temp[key] = row[key];
                lower[key] = ('' + row[key]).toLowerCase();
            }
            temp.$lower = lower;
            return temp;
        });
    }
};
