/* eslint no-unused-vars: 0 */
var ABSOLUTE_MIN_COL_WIDTH = 80;

/********************************************/
/** Columns-Lock Columns user just resized **/
/********************************************/
gridState.processors['columns-lock-columns-user-just-resized'] = {
    watches: ['columns'],
    runs: function (options) {
        if (!options.model.lastInput.columnsById){
            return;
        }
        
        var columnsThatWereJustResizedByUser = {};
        for(var key in options.model.lastInput.columnsById){
            var col = options.model.lastInput.columnsById[key];
            if (col.width && options.model.columnsById[key].isResizable) {
                columnsThatWereJustResizedByUser[key]=true;
            }
        }
        
        var resizableColumnsThatWerentResized = options.model.columns.filter(function(col){
            return col.isVisible && col.isResizable && !columnsThatWereJustResizedByUser[col.id];
        })
        
        if (resizableColumnsThatWerentResized.length == 0) {
            //If there are no other valid resizable columns then we can't lock anything without creating ui glitches
            if (options.model.logging) {
                console.log('Unable to lock column size', columnsThatWereJustResizedByUser);
            }
        }
        else {
            var whatWasLocked = [];
            for(var key in columnsThatWereJustResizedByUser){
                var col = options.model.columnsById[key];
                col.isResizable = false;
                col.$temporarilyIsResizableFalse = true;
                whatWasLocked.push(key);
            }
            if (options.model.logging) {
                console.log('Locking column width', whatWasLocked);
            }
        }
    }
};
