/* eslint no-unused-vars: 0 */

/*************************/
/** Columns Index by Id **/
/*************************/
gridState.processors['columns-index-by-id'] = {
    input: ['columnsById'],
    watches: ['columns'],
    runs: function (options) {
        var before = options.model.columnsById || {};
        options.model.columnsById = {};
        var didChange = false;
        options.model.columns.forEach(function (column) {
            if (before[column.id] !== column) {
                didChange = true;
            }
            options.model.columnsById[column.id] = column;
        });

        if (options.model.logging && didChange) {
            console.log('Indexing columns by id');
        }
    }
};
