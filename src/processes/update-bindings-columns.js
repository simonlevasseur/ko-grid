/* eslint no-unused-vars: 0 */

/*****************************/
/** Update Bindings: colums **/
/*****************************/
gridState.processors['update-bindings-columns'] = {
    watches: ['sort', 'columns'],
    runs: function (options) {
        console.log('Updating the column bindings');

        options.model.vm.columns(options.model.columns);
        // update the bindings
    }
};
