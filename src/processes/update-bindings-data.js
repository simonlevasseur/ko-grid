/* eslint no-unused-vars: 0 */

/***************************/
/** Update Bindings: data **/
/***************************/
gridState.processors['update-bindings-data'] = {
    watches: ['data', 'selection'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the data bindings');
        }

        options.model.vm.data(options.model.data);
        options.model.vm.data.loaded(true);
    }
};
