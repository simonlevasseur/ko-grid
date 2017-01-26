/* eslint no-unused-vars: 0 */

/*****************************/
/** Update Bindings: ui **/
/*****************************/
gridState.processors['update-bindings-ui'] = {
    watches: 'ui',
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the ui specific bindings');
        }
        options.model.vm.ui(options.model.ui);
    }
};
