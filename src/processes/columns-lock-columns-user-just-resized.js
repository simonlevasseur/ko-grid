/* eslint no-unused-vars: 0 */
var ABSOLUTE_MIN_COL_WIDTH = 80;

/********************************************/
/** Columns-Lock Columns user just resized **/
/********************************************/
gridState.processors['columns-lock-columns-user-just-resized'] = {
    watches: ['columns'],
    runs: function (options) {
        var changedColumnsById = options.model.lastInput.columnsById;
        if (!changedColumnsById) {
            return;
        }

        var key;
        var col;
        var columnsThatWereJustResizedByUser = {};
        for (key in changedColumnsById) {
            if (changedColumnsById.hasOwnProperty(key)) {
                col = changedColumnsById[key];
                if (col.width && options.model.columnsById[key].isResizable) {
                    columnsThatWereJustResizedByUser[key] = true;
                }
            }
        }

        var resizableColumnsThatWerentResized = options.model.columns.filter(function (filterCol) {
            return filterCol.isVisible && filterCol.isResizable && !columnsThatWereJustResizedByUser[filterCol.id];
        });

        if (resizableColumnsThatWerentResized.length === 0) {
            // If there are no other valid resizable columns then we can't lock anything without creating ui glitches
            if (options.model.logging) {
                console.log('Unable to lock column size', columnsThatWereJustResizedByUser);
            }
        }
        else {
            var whatWasLocked = [];
            for (key in columnsThatWereJustResizedByUser) {
                if (columnsThatWereJustResizedByUser.hasOwnProperty(key)) {
                    col = options.model.columnsById[key];
                    col.isResizable = false;
                    col.$temporarilyIsResizableFalse = true;
                    whatWasLocked.push(key);
                }
            }
            if (options.model.logging) {
                console.log('Locking column width', whatWasLocked);
            }
        }
    }
};
