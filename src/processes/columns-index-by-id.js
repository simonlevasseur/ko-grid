/* eslint no-unused-vars: 0 */

/*************************/
/** Columns Index by Id **/
/*************************/
gridState.processors['columns-index-by-id'] = {
    input:['columnsById'],
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
