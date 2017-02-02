    /* eslint no-unused-vars: 0 */

/***********************/
/** Fetch Cell Values **/
/***********************/
gridState.processors["fetch-cell-values"] = {
    watches: ['data','columns'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Fetching cell values');
        }

        options.model.data = options.model.data.map(function(row){
            var temp = {};
            for(var key in row) {
                if (key[0] === "$"){
                    temp[key] = row[key];
                }
            }
            options.model.columns.forEach(function(col){
                if (typeof col.dataAccessor === "function")
                {
                    temp[col.id] = col.dataAccessor(row)
                }
                else
                {
                    temp[col.id] = row[col.dataAccessor];
                }
            });
            return temp;
        });
    }
};