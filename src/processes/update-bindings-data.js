/* eslint no-unused-vars: 0 */

var selectedObservables = {};

/***************************/
/** Update Bindings: data **/
/***************************/
gridState.processors['update-bindings-data'] = {
    watches: ['data', 'selection'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the data bindings');
        }
        
        var uiData = options.model.data.slice();
        uiData.forEach(function(row, index){
            var clone = deepReplace({}, row);
            uiData[index] = clone;
            
            var obs = selectedObservables[row.$identity];
            if (!obs){
                obs = ko.observable();
                selectedObservables[row.$identity] = obs;
            }
            
            clone.isSelected = obs;
            if (obs.peek() !== row.isSelected){
                obs(row.isSelected);
            }
        });

        options.model.vm.data(uiData);
        options.model.vm.data.loaded(true);
    }
};
