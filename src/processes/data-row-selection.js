/* eslint no-unused-vars: 0 */

/************************/
/** Data row selection **/
/************************/
gridState.processors['data-row-selection'] = {
    watches: ['data', 'selection'],
    runs: function (options) {
        if (!options.model.ui.selectable) {
            return;
        }
        if (options.model.logging) {
            console.log('Updating row selection');
        }
        options.model.data.forEach(function (row) {
            row.isSelected = !!options.model.selection[row.$identity];
        });
    }
};
