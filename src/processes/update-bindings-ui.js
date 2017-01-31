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
        var ui = options.model.ui;
        var clone = {};
        deepReplace(clone, ui);
        
        if (!options.cache.allSelected){
            options.cache.allSelected = ko.observable();
        }
        clone.allSelected = options.cache.allSelected;
        if (clone.allSelected.peek() !== ui.allSelected){
            clone.allSelected(ui.allSelected);
        }
        
        options.model.vm.ui(clone);
    }
};