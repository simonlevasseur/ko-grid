/* eslint no-unused-vars: 0 */

/*******************************/
/** ui export selected rows **/
/*******************************/
gridState.processors['ui-export-selected-rows'] = {
    watches: ['selection', 'data'],
    runs: function (options) {
        var selectedRows = options.model.data.filter(function (row) {
            return row.isSelected;
        }).map(function (row) {
            return row.raw;
        });
        var didReplace = options.model.ui.selectedData && options.model.ui.selectedData.length > 0;
        options.model.ui.selectedData = selectedRows;
        
        if (options.model.logging && options.model.ui.selectable) {
            if (selectedRows.length > 0) {
                console.log('Exporting selected rows');
            } else if (didReplace) {
                console.log('Clearing selected rows from the exported state');
            }
        }
    }
};
