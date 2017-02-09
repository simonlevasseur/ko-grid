/* eslint no-unused-vars: 0 */

/*******************************/
/** UI Selected Count **/
/*******************************/
gridState.processors['ui-selected-count'] = {
    watches: ['selection', 'data'],
    runs: function (options) {
        if (options.model.logging && options.model.ui.selectable) {
            console.log('Updating the selection count');
        }

        var count = 0;
        for (var key in options.model.selection) {
            if (key !== 'all' && options.model.selection[key]) {
                count++;
            }
        }
        options.model.ui.selectedCount = count;
    }
};
