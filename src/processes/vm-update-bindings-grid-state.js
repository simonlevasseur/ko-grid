/* eslint no-unused-vars: 0 */

/***********************************/
/** vm-Update Bindings: gridState **/
/***********************************/
gridState.processors['vm-update-bindings-grid-state'] = {
    init: function (model) {
        model.vm.gridState = ko.observable();
    },
    runs: function (options) {
        options.model.runAfter.push({id:'vm-update-bindings-grid-state',fnRef:function(){
            options.model.vm.gridState(options.model);
        }});
    }
};
