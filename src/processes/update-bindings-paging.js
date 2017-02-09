/* eslint no-unused-vars: 0 */

/*****************************/
/** Update Bindings: paging **/
/*****************************/
gridState.processors['update-bindings-paging'] = {
    watches: 'paging',
    init: function (model) {
        model.vm.paging = ko.observable({});
    },
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the page bindings');
        }
        options.model.vm.paging(options.model.paging);
    }
};
