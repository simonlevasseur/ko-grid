/* eslint no-unused-vars: 0 */
var ABSOLUTE_MIN_COL_WIDTH = 80;

/**********************************************/
/** Columns-Unlock columns user just resized **/
/**********************************************/
gridState.processors['columns-unlock-columns-user-just-resized'] = {
    watches: ['columns'],
    runs: function (options) {
        var didRemoveLock = false;
        var whatWasUnlocked = [];
    
        options.model.columns.forEach(function(col){
            if (col.$temporarilyIsResizableFalse){
                delete col.$temporarilyIsResizableFalse;
                col.isResizable = true;
                didRemoveLock = true;
                whatWasUnlocked.push(col.id);
            }
        });
        
        if (didRemoveLock && options.model.logging) {
            console.log('Unlocked columns', whatWasUnlocked);
        }
    }
};
