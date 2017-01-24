/* eslint no-unused-vars: 0 */

/*****************************/
/** Update Bindings: colums **/
/*****************************/
gridState.processors['update-bindings-columns'] = {
    watches: ['sort', 'columns'],
    runs: function (options) {
        console.log('Updating the column bindings');
        
        var columns = options.model.columns;
        var temp = options.model.vm.columns();
        var numBefore = temp.length;
        var numNow = columns.length;
        if (numBefore > numNow) {
            temp = temp.slice(0, numNow);
        }
        else if (numBefore < numNow) {
            for(var i= numBefore;i<numNow;i++){
                temp [i] = ko.observable();
            }
        }
        
        for (var i=0;i<numNow;i++){
            temp[i](columns[i]);
        }
        options.model.vm.columns(temp);
    }
};
