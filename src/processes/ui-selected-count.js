/* eslint no-unused-vars: 0 */

/*******************************/
/** UI Selected Count **/
/*******************************/
gridState.processors['ui-selected-count'] = {
    watches: ['selection', 'data'],
    runs: function (options) {
        var didChange = false;
        var count = 0;
        for (var key in options.model.selection) {
            if (key !== 'all' && options.model.selection[key]) {
                count++;
            }
        }
        didChange = (options.model.ui.selectedCount || 0) !== count;
        options.model.ui.selectedCount = count;
        
        if (options.model.logging && options.model.ui.selectable && didChange) {
            console.log('Updating the selection count');
        }
    }
};
