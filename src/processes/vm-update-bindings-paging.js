/* eslint no-unused-vars: 0 */

/*****************************/
/** vm-Update Bindings: paging **/
/*****************************/
gridState.processors['vm-update-bindings-paging'] = {
    watches: 'paging',
    init: function (model) {
        model.vm.paging = ko.observable({});
    },
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the page bindings');
        }
        options.model.runAfter.push({id:'vm-update-bindings-paging',fnRef:function(){
            options.model.vm.paging(options.model.paging);
        }});
    }
};
