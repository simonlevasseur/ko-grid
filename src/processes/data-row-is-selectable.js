/* eslint no-unused-vars: 0 */

/****************************/
/** Data row is selectable **/
/****************************/
gridState.processors['data-row-is-selectable'] = {
    watches: ['data', 'ui'],
    runs: function (options) {
        if (!options.model.ui.selectable) {
            return;
        }
        var checkRowSelectability = options.model.ui.rowIsSelectable;
        var didChange = false;
        options.model.data.forEach(function (row) {
            var newValue = !!(checkRowSelectability ? checkRowSelectability(row) : true);
            if (row.isSelectable !== newValue) {
                didChange = true;
                row.isSelectable = newValue;
            }
        });

        if (options.model.logging && didChange && checkRowSelectability) {
            console.log('Updating individual row selectability');
        }
    }
};
