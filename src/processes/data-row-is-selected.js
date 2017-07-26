/* eslint no-unused-vars: 0 */

/**************************/
/** Data row is selected **/
/**************************/
gridState.processors['data-row-is-selected'] = {
    watches: ['data', 'selection'],
    runs: function (options) {
        if (!options.model.ui.selectable) {
            return;
        }
        var didChange = false;
        options.model.data.forEach(function (row) {
            var newValue = !!options.model.selection[row.$identity];
            if (row.isSelected !== newValue) {
                if (!row.isSelected !== !newValue) {
                    didChange = true;
                }
                row.isSelected = newValue;
            }
        });

        if (options.model.logging && didChange) {
            console.log('Updating row selection');
        }
    }
};
