/* eslint no-unused-vars: 0 */

/***************/
/** Sort Data **/
/***************/
gridState.processors['index-columns-by-id'] = {
    watches: ['columns'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Indexing columns by id');
        }
        options.model.columnsById = {};
        options.model.columns.forEach(function (column) {
            options.model.columnsById[column.id] = column;
        });
    }
};
