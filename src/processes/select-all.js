/* eslint no-unused-vars: 0 */

/****************/
/** Select All **/
/****************/
gridState.processors['select-all'] = {
    watches: ['selection', 'data'],
    runs: function (options) {
        var all = options.model.selection.all;
        if (typeof all !== 'boolean') {
            delete options.model.selection.all;
            return;
        }
        if (all) {
            if (options.model.logging) {
                console.log('Applying select all');
            }
            options.model.data.forEach(function (row) {
                options.model.selection[row.$identity] = true;
            });
            delete options.model.selection.all;
        }
        else {
            if (options.model.logging) {
                console.log('Clearing all selected rows');
            }
            options.model.selection = {};
        }
    }
};
