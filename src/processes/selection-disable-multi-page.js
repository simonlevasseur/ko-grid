/* eslint no-unused-vars: 0 */

/*****************************/
/** Selection Disable Multi-page **/
/*****************************/
gridState.processors['selection-disable-multi-page'] = {
    watches: ['data', 'selection'],
    runs: function (options) {
        if (options.model.ui.selectable) {
            var rowsPresent = {};
            options.model.data.forEach(function (row) {
                rowsPresent[row.$identity] = true;
            });

            var toBeRemoved = [];

            for (var key in options.model.selection) {
                if (!rowsPresent[key] && key !== 'all') {
                    toBeRemoved.push(key);
                }
            }

            if (toBeRemoved.length > 0 && options.model.logging) {
                console.log('Removing selected rows which are not present on the current page');
            }

            toBeRemoved.forEach(function (keyToRemove) {
                delete options.model.selection[keyToRemove];
            });
        }
    }
};
