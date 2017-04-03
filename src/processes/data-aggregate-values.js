    /* eslint no-unused-vars: 0 */

/****************************/
/** Data Aggregate Values  **/
/****************************/
gridState.processors['data-aggregate-values'] = {
    watches: ['filter', 'data'],
    runs: function (options) {
        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        if (!options.model.filter || !options.model.filter['*']) {
            // we don't need to aggregate the data as it's not being used right now
            return;
        }

        if (options.model.data.length === 0) {
            // there's no data
            return;
        }

        if (!options.changed.data && options.model.data[0].$aggregate) {
            // the data didn't change and we already made the aggregate so nothing to do
            return;
        }

        if (options.model.logging) {
            console.log('Aggregating the data to be used with the wildcard filter');
        }

        options.model.data = originalData.map(function (row) {
            var temp = {};
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    temp[key] = row[key];
                }
            }
            var aggregate = [];
            options.model.columns.forEach(function (col) {
                aggregate.push(row[col.id]);
            });
            temp.$aggregate = aggregate.join(' | ').toLowerCase();
            return temp;
        });
    }
};
