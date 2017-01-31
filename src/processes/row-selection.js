/* eslint no-unused-vars: 0 */

/**************************/
/** Update row selection **/
/**************************/
gridState.processors['row-selection'] = {
    watches: 'selection',
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating row selection');
        }
        options.model.data.forEach(function(row){
            row.isSelected = options.model.selection[row.$identity];
        });
    }
};
