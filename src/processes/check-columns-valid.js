/* eslint no-unused-vars: 0 */

/************************/
/** Check Paging Valid **/
/************************/
gridState.processors['check-columns-valid'] = {
    watches: ['paging', 'data'],
    runs: function (options) {
        console.log('Validating column options');

        if (!Array.isArray(options.model.columns))
        {
            throw new Error("Columns must be an array of objects");
        }
        options.model.columns.forEach(function(column){
            if (!column.type)
            {
                column.type = "text"
            }
            if (!column.id)
            {
                column.id = column.dataAccessor;
            }
            if (!column.dataAccessor)
            {
                column.dataAccessor = column.id;
            }
            if (!column.heading)
            {
                column.heading = column.id;
            }
        });
    }
};
