/* eslint no-unused-vars: 0 */

/********************************/
/** vm-Update Bindings: colums **/
/********************************/
gridState.processors['vm-update-bindings-columns'] = {
    watches: ['sort', 'columns', 'space'],
    init: function (model) {
        model.vm.columns = ko.observableArray();
    },
    runs: function (options) {
        if (!options.model.space || !options.model.space.width) {
            return;
        }
        var didChange = false;
        var i = 0;

        var columns = options.model.columns;
        var temp = options.model.vm.columns();
        var numBefore = temp.length;
        var numNow = columns.length;
        if (numBefore > numNow) {
            temp = temp.slice(0, numNow);
            didChange = true;
        }
        else if (numBefore < numNow) {
            for (i = numBefore; i < numNow; i++) {
                temp[i] = ko.observable();
                didChange = true;
            }
        }

        for (i = 0; i < numNow; i++) {
            var column = columns[i];
            var colBefore = options.cache[column.id];
            var colNow = JSON.stringify(column);
            var newObj = JSON.parse(colNow);
            addColumnFunctions(newObj, options);
            newObj.width = newObj.adjustedWidth || newObj.width;
            temp[i](newObj);
            didChange = true;
            options.cache[column.id] = colNow;
        }

        if (options.model.logging && didChange) {
            console.log('Updating the column bindings');
        }

        options.model.runAfter.push({id:'vm-update-bindings-column',fnRef:function(){
            options.model.vm.columns(temp);
        }});
    }
};

function addColumnFunctions(col, options) {
    if (col.type === 'select') {
        col.toggleSelectAll = function (grid) {
            return function () {
                grid.process({ selection: { all: !options.model.ui.allSelected } });
                return true;
            };
        };
    }
}
