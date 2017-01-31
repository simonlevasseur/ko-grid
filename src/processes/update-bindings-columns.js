/* eslint no-unused-vars: 0 */

/*****************************/
/** Update Bindings: colums **/
/*****************************/
gridState.processors['update-bindings-columns'] = {
    watches: ['sort', 'columns'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the column bindings');
        }
        var i = 0;

        var columns = options.model.columns;
        var temp = options.model.vm.columns();
        var numBefore = temp.length;
        var numNow = columns.length;
        if (numBefore > numNow) {
            temp = temp.slice(0, numNow);
        }
        else if (numBefore < numNow) {
            for (i = numBefore; i < numNow; i++) {
                temp[i] = ko.observable();
            }
        }

        for (i = 0; i < numNow; i++) {
            var column = columns[i];
            var colBefore = options.cache[column.id];
            var colNow = JSON.stringify(column);
            if (colBefore !== colNow) {
                var newObj = JSON.parse(colNow);
                addColumnFunctions(newObj, options);
                temp[i](newObj);
                options.cache[column.id] = colNow;
            }
        }
        if (numBefore !== numNow) {
            options.model.vm.columns(temp);
        }
    }
};

function addColumnFunctions(col, options){
    if (col.type === "select"){
        col.toggleSelectAll = function(grid){
            return function(){
                grid.process({selection:{all:!options.model.ui.allSelected}});
                return true;
            }
        }
    }
}