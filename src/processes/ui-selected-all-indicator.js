/* eslint no-unused-vars: 0 */

/*******************************/
/** UI Selected all indicator **/
/*******************************/
gridState.processors['ui-selected-all-indicator'] = {
    watches: ['selection', 'data'],
    runs: function (options) {
        if (options.model.logging && options.model.ui.selectable) {
            console.log('Updating the selection indicators');
        }

        var allSelected = !findFirst(options.model.data, {isSelected: false});
        
        options.model.ui.allSelected = allSelected;
    }
};
