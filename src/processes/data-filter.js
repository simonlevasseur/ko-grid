/* eslint no-unused-vars: 0 */

/*****************/
/** Data Filter **/
/*****************/
gridState.processors['data-filter'] = {
    watches: ['filter', 'data'],
    runs: function (options) {
        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        var hasKeys = false;
        for (var key in options.model.filter) {
            hasKeys = true;
            break;
        }

        if (options.model.logging && hasKeys) {
            console.log('Filtering the data');
        }

        options.model.data = originalData.filter(applyFilters);

        function applyFilters(row) {
            /* eslint no-bitwise: 0*/
            var match = true;
            for (var key in options.model.filter) {
                if (key === '*') {
                    match &= applyFilter(row.$lower.$aggregate, options.model.filter[key]);
                }
                else {
                    match &= applyFilter(row.$lower[key], options.model.filter[key]);
                }
            }
            return match;
        }

        function applyFilter(value, filter) {
            if (typeof filter === 'string') {
                return stringFilter(value, filter);
            }
            else if (typeof filter === 'function') {
                return functionFilter(value, filter);
            }
            else if (typeof filter === 'object' && typeof filter.exec === 'function') {
                return regexFilter(value, filter);
            }
            else {
                throw new Error('Unrecognized fitler type');
            }
        }

        function stringFilter(value, filter) {
            return filter.split(/\s/).reduce(function (acc, token) {
                return acc && value.indexOf(token) > -1;
            }, true);
        }

        function regexFilter(value, filter) {
            return !!filter.exec(value);
        }
        function functionFilter(value, filter) {
            return !!filter(value);
        }
    }
};
