    /* eslint no-unused-vars: 0 */

/****************************/
/** Data Fetch Cell Values **/
/****************************/
gridState.processors['data-fetch-cell-values'] = {
    watches: ['data', 'columns'],
    runs: function (options) {
        
        //Check to make sure this is a change worth updating for
        options.cache.dataAccessors = options.cache.dataAccessors || {};
        var columnsInOrder = JSON.stringify(options.model.columns.map(function(col){return col.id}));
        var accessorsDiffer = options.model.columns.some(function(col){
            return col.dataAccessor !== options.cache.dataAccessors[col.id];
        });
        if (!options.changed.data && !accessorsDiffer && options.cache.lastColumns === columnsInOrder){
            //if the data is the same and the accessors or list of columns didn't change, then don't modify anything
            return;
        }
        options.cache.lastColumns = columnsInOrder;
        options.model.columns.forEach(function(col){
            options.cache.dataAccessors[col.id] = col.dataAccessor;
        });
        
        if (options.model.logging) {
            console.log('Fetching cell values');
        }

        options.model.data = options.model.data.map(function (row) {
            var temp = {};
            for (var key in row) {
                if (key[0] === '$') {
                    temp[key] = row[key];
                }
            }
            options.model.columns.forEach(function (col) {
                if (typeof col.dataAccessor === 'function') {
                    temp[col.id] = col.dataAccessor(row);
                }
                else {
                    temp[col.id] = row[col.dataAccessor];
                }
            });
            temp.raw = row;
            return temp;
        });
    }
};
