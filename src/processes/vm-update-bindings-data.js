/* eslint no-unused-vars: 0 */

var selectedObservables = {};

/******************************/
/** vm-Update Bindings: data **/
/******************************/
gridState.processors['vm-update-bindings-data'] = {
    watches: ['data', 'selection'],
    init: function (model) {
        if (!model.vm.data) {
            model.vm.data = ko.observableArray();
            model.vm.data.loaded = ko.observable(false);
        }
    },
    runs: function (options) {
        if (options.model.logging) {
            console.log('Updating the grid content using Knockout templates');
        }

        var uiData = options.model.data.slice();
        uiData.forEach(function (row, index) {
            var clone = JSON.parse(JSON.stringify(row));
            uiData[index] = clone;

            var obs = selectedObservables[row.$identity];
            if (!obs) {
                obs = ko.observable();
                obs.readonly = readonly(obs);
                selectedObservables[row.$identity] = obs;
            }

            clone.isSelected = obs.readonly;
            if (obs.peek() !== row.isSelected) {
                obs(row.isSelected);
            }

            clone.toggleSelection = function (grid) {
                var togglerOptions = { selection: {} };
                togglerOptions.selection[row.$identity] = !row.isSelected;
                return wrappedProcess(grid, togglerOptions);
            };
        });

        if (options.changed.data || !options.cache.didRunOnce) {
            options.model.runAfter.push({id:'vm-update-bindings-data',fnRef:function(){
                options.model.vm.data(uiData);
                options.model.vm.data.loaded(true);
            }});
            options.cache.didRunOnce = true;
        }
    }
};

function readonly(obs) {
    return ko.pureComputed(function () {
        return obs();
    });
}

function wrappedProcess(grid, options) {
    return function () {
        grid.process(options);
        return true;
    };
}
