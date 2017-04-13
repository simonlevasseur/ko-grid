/* eslint no-unused-vars: 0 */
var ABSOLUTE_MIN_COL_WIDTH = 80;

/****************************************/
/** Columns-Redistribute Space Equally **/
/****************************************/
/**
 * #1 too small distribute proportionally
 * #2 cols too big grid scrolls
 * #3 window resize distribute proportionally
 * #4 cols added/removed recalculate
 * #5 some cols not resizable
 * #6 drag finished transition distribute proportionally
 */
gridState.processors['columns-redistribute-space-equally'] = {
    watches: ['columns', 'space'],
    runs: function (options) {
        if (!options.model.space || options.model.space.width <= 0) {
            return;
        }
        var columnsArray = options.model.columns.filter(function (col) {
            return col.isVisible;
        });

        widthToTemp(columnsArray);

        var containerWidth = Math.floor(options.model.space.width) - 2;
        var availableWidth;
        var previousAvailableWidth;
        var usedWidth;

        applyMinMax(columnsArray);

        // min, max width and non-resizable columns can leave small amounts of space left over.
        // we run this in an iteration so that should those edge cases occur we still mostly fill the space
        // The limit of 10 is just to ensure we don't end up looping forever
        // usually this will exit after the second iteration
        for (var iterations = 0; iterations < 10; iterations++) {
            previousAvailableWidth = availableWidth;

            usedWidth = calculateUsedWidth(columnsArray);

            availableWidth = Math.max(0, containerWidth - usedWidth);

            distributeAvailableSpace(columnsArray, availableWidth);

            if (availableWidth === previousAvailableWidth) {
                break;
            }
        }

        var whatWasChanged = tempToAdjustedWidth(columnsArray);
        removeTemp(columnsArray);

        if (options.model.logging && whatWasChanged) {
            console.log('Redistributing exta space amoung the columns', whatWasChanged);
        }
    }
};

function widthToTemp(columnsArray) {
    columnsArray.forEach(function (col) {
        col.tempWidth = typeof col.width === 'number' && col.width >= 0 ? col.width : ABSOLUTE_MIN_COL_WIDTH;
    });
}

function tempToAdjustedWidth(columnsArray) {
    var somethingChanged = false;
    var whatWasChanged = {};
    columnsArray.forEach(function (col) {
        if (col.adjustedWidth !== col.tempWidth) {
            whatWasChanged[col.id] = { before: col.adjustedWidth || col.width, after: col.tempWidth };
            somethingChanged = true;
        }
        col.adjustedWidth = col.tempWidth;
    });
    return somethingChanged ? whatWasChanged : null;
}

function removeTemp(columnsArray) {
    columnsArray.forEach(function (col) {
        delete col.tempWidth;
    });
}

function calculateUsedWidth(columnsArray) {
    return columnsArray.reduce(function (total, col) {
        return total + (col.tempWidth ? col.tempWidth : 0);
    }, 0);
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

function distributeAvailableSpace(columnsArray, space) {
    var resizableColumns = columnsArray.reduce(function (total, col) {
        return total + (col.isResizable ? 1 : 0);
    }, 0);

    var spacePerColumn = Math.floor(space / resizableColumns);
    if (spacePerColumn <= 0) {
        return;
    }

    columnsArray.forEach(function (col) {
        if (col.isResizable) {
            col.tempWidth += spacePerColumn;
        }
    });

    applyMinMax(columnsArray);
}
