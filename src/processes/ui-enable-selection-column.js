/* eslint no-unused-vars: 0 */

/*****************************/
/** Enable Selection Column **/
/*****************************/
gridState.processors['ui-enable-selection-column'] = {
    watches: ['ui'],
    runs: function (options) {
        if (options.model.ui.selectable){
            var selectCol = findFirst(options.model.columns, {id:"$$select"});
            if (!selectCol){
                console.log("Adding the row selection column");
                selectCol = {
                    id:"$$select",
                    type:"select",
                    isSortable: false,
                    isIdentity: false
                }
                options.model.columns.unshift(selectCol);
            }
            if (typeof options.model.ui.selectMode === "undefined"){
                options.model.ui.selectMode = "multi";
            }
        }
    }
};