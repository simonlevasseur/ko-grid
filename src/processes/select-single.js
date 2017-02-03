/* eslint no-unused-vars: 0 */

/*******************/
/** Select Single **/
/*******************/
gridState.processors['select-single'] = {
    watches: ['selection', 'data'],
    runs: function (options) {
        var single = options.model.ui.selectMode !== "multi";
        if (single) {
            var selectedArray = [];
            var lastTime = options.cache.selected || [];
            for(var key in options.model.selection)
            {
                if (options.model.selection[key]){selectedArray.push(key);}
            }
            if (selectedArray.length > 1)
            {
                if (options.model.logging) {
                    console.log('Applying select single');
                }
                function removeThis(old){
                    var index = selectedArray.indexOf(old)
                    if (index !== -1){
                        selectedArray.splice(index,1);
                    }
                    delete options.model.selection[old];
                }
                //remove the previous selection
                lastTime.forEach(removeThis);
                //if we're still over the limit then effectively remove randomly until 1 item selected
                if (selectedArray.length > 1)
                {
                    selectedArray.splice(0, selectedArray.length - 1).forEach(removeThis);
                }
            }
            options.cache.selected = selectedArray;
        }
        else {
            return;
        }
    }
};
