/* eslint no-unused-vars: 0 */
var ABSOLUTE_MIN_COL_WIDTH = 80;

/*****************************************************/
/** Columns-Redistribute Space to Rightmost Visible **/
/*****************************************************/
gridState.processors['columns-redistribute-space-to-rightmost-visible'] = {
    watches: ['columns', 'space'],
    runs: function (options) {
        if (!options.model.space || options.model.space.width <= 0) {
            return;
        }
        var columnsVisible = options.model.columns.filter(function (col) {
            return col.isVisible;
        });
        var columnsVisibleAndResizable = columnsVisible.filter(function (col) {
            return col.isResizable;
        });
        if (columnsVisibleAndResizable.length === 0) {
            // we wouldn't be able to do anything anyway so exit early
            return;
        }
        var rightmost = columnsVisibleAndResizable[columnsVisibleAndResizable.length - 1];

        widthToTemp(columnsVisible);

        var containerWidth = Math.floor(options.model.space.width) - 2;
        var availableWidth;
        var previousAvailableWidth;
        var usedWidth;

        applyMinMax(columnsVisible);

        usedWidth = calculateUsedWidth(columnsVisible);
        availableWidth = Math.max(0, containerWidth - usedWidth);

        rightmost.tempWidth += availableWidth;

        var whatWasChanged = tempToAdjustedWidth(columnsVisible);
        removeTemp(columnsVisible);

        if (options.model.logging && whatWasChanged) {
            console.log('Redistributing exta space amoung the columns', whatWasChanged);
        }
    }
};

function widthToTemp(columnsVisible) {
    columnsVisible.forEach(function (col) {
        col.tempWidth = typeof col.width === 'number' && col.width >= 0 ? col.width : ABSOLUTE_MIN_COL_WIDTH;
    });
}

function tempToAdjustedWidth(columnsVisible) {
    var somethingChanged = false;
    var whatWasChanged = {};
    columnsVisible.forEach(function (col) {
        if (col.adjustedwidth !== col.tempWidth) {
            whatWasChanged[col.id] = { before: col.adjustedwidth || col.width, after: col.tempWidth };
            somethingChanged = true;
        }
        col.adjustedWidth = col.tempWidth;
    });
    return somethingChanged ? whatWasChanged : null;
}

function removeTemp(columnsVisible) {
    columnsVisible.forEach(function (col) {
        delete col.tempWidth;
    });
}

function calculateUsedWidth(columnsVisible) {
    return columnsVisible.reduce(function (total, col) {
        return total + (col.tempWidth ? col.tempWidth : 0);
    }, 0);
}

function applyMinMax(columnsVisible) {
    columnsVisible.forEach(function (col) {
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
