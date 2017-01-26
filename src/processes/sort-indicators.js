/* eslint no-unused-vars: 0 */

/***************/
/** Sort Data **/
/***************/
gridState.processors['sort-indicators'] = {
    watches: ['sort', 'columns'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the sort indicators');
        }

        options.model.columns.forEach(function (column) {
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
    }
};
