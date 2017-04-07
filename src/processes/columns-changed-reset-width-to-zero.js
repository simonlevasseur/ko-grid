/*****************************************/
/** Columns Changed Reset Width to zero **/
/*****************************************/
gridState.processors['columns-changed-reset-width-to-zero'] = {
    watches: ['columns'],
    runs: function (options) {
        var columnsArray = options.model.columns.filter(function (col) {
            // Only count columns which are resizable
            return col.isResizable;
        }).filter(function (col) {
            // don't count "ui" columns which get added automatically
            return col.id.indexOf('$$') !== 0;
        });

        var before = options.cache.length;
        var now = columnsArray.length;

        options.cache.length = now;

        if (typeof before !== 'number' || before === now || now === 0) {
            // this is either the first time seeing columns, nothing changed, or nothing to do
            return;
        }

        if (options.model.logging) {
            console.log('The length of the columns array changed; Resetting the width of resizable columns');
        }

        columnsArray.forEach(function (col) {
            col.width = 0;
        });
    }
};
