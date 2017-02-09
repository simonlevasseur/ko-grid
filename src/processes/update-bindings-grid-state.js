/* eslint no-unused-vars: 0 */

/********************************/
/** Update Bindings: gridState **/
/********************************/
gridState.processors['update-bindings-grid-state'] = {
    init: function (model) {
        model.vm.gridState = ko.observable();
    },
    runs: function (options) {
        if (options.model.logging) {
            console.log('Publishing grid state');
        }
        options.model.vm.gridState(options.model);
    }
};
