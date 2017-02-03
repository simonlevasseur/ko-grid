/* eslint no-unused-vars: 0 */

/********************************/
/** Update Bindings: gridState **/
/********************************/
gridState.processors['update-bindings-grid-state'] = function (options) {
    if (options.model.logging) {
        console.log('Publishing grid state');
    }
    options.model.vm.gridState(options.model);
};
