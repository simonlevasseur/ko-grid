/* eslint no-unused-vars: 0 */

/*******************************/
/** Export selected rows **/
/*******************************/
gridState.processors['ui-export-selected-rows'] = {
    watches: ['selection', 'data'],
    runs: function (options) {
        if (options.model.logging && options.model.ui.selectable) {
            console.log('Exporting selected rows');
        }

        var selectedRows = options.model.data.filter(function (row) {
            return row.isSelected;
        }).map(function (row) {
            return row.raw;
        });
        options.model.ui.selectedData = selectedRows;
    }
};
