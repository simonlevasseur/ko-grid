/* eslint no-unused-vars: 0 */

/*****************************/
/** vm Update Bindings: ui **/
/*****************************/
gridState.processors['vm-update-bindings-ui'] = {
    watches: 'ui',
    init: function (model) {
        model.vm.ui = ko.observable({});
    },
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the ui specific bindings');
        }
        var ui = options.model.ui;
        var clone = {};
        deepReplace(clone, ui);

        if (!options.cache.allSelected) {
            options.cache.allSelected = ko.observable();
        }
        clone.allSelected = options.cache.allSelected;
        if (clone.allSelected.peek() !== ui.allSelected) {
            clone.allSelected(ui.allSelected);
        }

        options.model.vm.ui(clone);
    }
};
