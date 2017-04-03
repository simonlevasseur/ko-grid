/* eslint no-unused-vars: 0 */
var ABSOLUTE_MIN_COL_WIDTH = 80;

/********************************/
/** Columns-Apply Min Max Width **/
/********************************/
gridState.processors['columns-apply-min-max-width'] = {
    watches: ['columns', 'space'],
    runs: function (options) {
        if (!options.model.space || options.model.space.width <= 0) {
            return;
        }
        var columnsArray = options.model.columns.filter(function (col) {
            return col.isVisible;
        });

        widthToTemp(columnsArray);

        applyMinMax(columnsArray);

        var whatWasChanged = tempToWidth(columnsArray);
        removeTemp(columnsArray);
        
        if (options.model.logging && whatWasChanged){
            console.log('Applying Min/Max column widths', whatWasChanged);
        }
    }
};

function widthToTemp(columnsArray) {
    columnsArray.forEach(function (col) {
        col.tempWidth = typeof col.width === 'number' && col.width >= 0 ? col.width : ABSOLUTE_MIN_COL_WIDTH;
    });
}

function tempToWidth(columnsArray) {
    var somethingChanged = false;
    var whatWasChanged = {};
    columnsArray.forEach(function (col) {
        if (col.width !== col.tempWidth){
            whatWasChanged[col.id] = {before:col.width, after:col.tempWidth}
            somethingChanged = true;
        }
        col.width = col.tempWidth;
    });
    return somethingChanged? whatWasChanged : null;
}

function removeTemp(columnsArray) {
    columnsArray.forEach(function (col) {
        delete col.tempWidth;
    });
}

function applyMinMax(columnsArray) {
    columnsArray.forEach(function (col) {
        if (col.isResizable === false || !col.isVisible) {
            return;
        }
        if (col.minWidth) {
            col.tempWidth = Math.max(col.tempWidth, col.minWidth);
        }
        if (col.maxWidth) {
            col.tempWidth = Math.min(col.tempWidth, col.maxWidth);
        }
        if (col.tempWidth < ABSOLUTE_MIN_COL_WIDTH) {
            col.tempWidth = ABSOLUTE_MIN_COL_WIDTH;
        }
    });
}
