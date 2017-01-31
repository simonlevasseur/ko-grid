/* eslint no-unused-vars: 0 */

/*****************************/
/** Enable Selection Column **/
/*****************************/
gridState.processors['disable-multi-page-selection'] = {
    watches: ['data','selection'],
    runs: function (options) {
        if (options.model.ui.selectable){
            var rowsPresent = {};
            options.model.data.forEach(function(row){
                rowsPresent[row.$identity] = true;
            });
            
            var toBeRemoved = [];
            
            for(var key in options.model.selection){
                if (!rowsPresent[key]){
                    toBeRemoved.push(key);
                }
            }
            
            if (toBeRemoved.length > 0 && options.model.logging){
                console.log("Removing selected rows which are not present on the current page");
            }
            
            toBeRemoved.forEach(function(key){
                delete options.model.selection[key];
            });
        }
    }
};