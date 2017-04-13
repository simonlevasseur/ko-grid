/* eslint no-unused-vars: 0 */

/*****************************/
/** Columns-sort-indicators **/
/*****************************/
gridState.processors['columns-sort-indicators'] = {
    watches: ['sort', 'columns'],
    runs: function (options) {
        var didChange = false;
        var before = {};
        var after = {};

        options.model.columns.forEach(function (column) {
            before[column.id] = { a: column.isSorted, b: column.isSortedAsc };

            column.isSorted = false;
            column.isSortedAsc = false;
        });
        options.model.sort.forEach(function (sort) {
            var column = options.model.columnsById[sort.sortBy];
            if (column) {
                column.isSorted = true;
                column.isSortedAsc = sort.sortAsc;
            }
        });
        options.model.columns.forEach(function (column) {
            after[column.id] = { a: column.isSorted, b: column.isSortedAsc };
        });

        didChange = JSON.stringify(before) !== JSON.stringify(after);

        if (options.model.logging && didChange) {
            console.log('Updating the sort indicators');
        }
    }
};
