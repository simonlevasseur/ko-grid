    /* eslint no-unused-vars: 0 */

/****************************/
/** Data Fetch Cell Values **/
/****************************/
gridState.processors['data-fetch-cell-values'] = {
    watches: ['data', 'columns'],
    runs: function (options) {
        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;

        // Check to make sure this is a change worth updating for
        options.cache.dataAccessors = options.cache.dataAccessors || {};
        var columnsInOrder = JSON.stringify(options.model.columns.map(function (col) {
            return col.id;
        }));
        var accessorsDiffer = options.model.columns.some(function (col) {
            return col.dataAccessor !== options.cache.dataAccessors[col.id];
        });
        if (!options.changed.data && !accessorsDiffer && options.cache.lastColumns === columnsInOrder) {
            // if the data is the same and the accessors or list of columns didn't change, then don't modify anything
            return;
        }
        options.cache.lastColumns = columnsInOrder;
        options.model.columns.forEach(function (col) {
            options.cache.dataAccessors[col.id] = col.dataAccessor;
        });

        if (options.model.logging) {
            console.log('Fetching cell values');
        }
        
        var invalidDataAccessors = {};

        options.model.data = originalData.map(function (row) {
            var temp = {};
            for (var key in row) {
                if (key[0] === '$') {
                    temp[key] = row[key];
                }
            }
            options.model.columns.forEach(function (col) {
                var value;
                if (typeof col.dataAccessor === 'function') {
                    value = col.dataAccessor(row);
                }
                else {
                    value = row[col.dataAccessor];
                }
                temp[col.id] = value;
                if ((value === undefined || value === null) && col.id[0] !== "$") {
                    invalidDataAccessors[col.id] = col.dataAccessor;
                }
            });
            temp.raw = row;
            return temp;
        });
        
        _.forIn(invalidDataAccessors, function(da, colId){
            console.warn("DataAccessor for " + colId + " resulted in null or undefined:", da);
        });
    }
};
