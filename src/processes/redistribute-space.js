/* eslint no-unused-vars: 0 */

/************************/
/** Redistribute Space **/
/************************/
gridState.processors['redistribute-space'] = {
    watches: ['columns', 'space'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Redistributing exta space amoung the columns');
        }

        var byId = options.model.columnsById;
        for(var key in byId)
        {
            var col = byId[key];
            if (!col.width){
                col.width = col.minWidth || col.maxWidth;
            }
            if (!!col.minWidth)
            {
                col.width = Math.max(col.width, col.minWidth);
            }
            if (!!col.maxWidth)
            {
                col.width = Math.min(col.width, col.maxWidth);
            }
            if (col.width < 0) {
                col.width = 0;
            }
            console.log(key, col.width)
        }
        // Resize the columns under some conditions
    }
};
