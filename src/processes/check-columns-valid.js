/* eslint no-unused-vars: 0 */

/************************/
/** Check Paging Valid **/
/************************/
gridState.processors['check-columns-valid'] = {
    watches: ['columns'],
    runs: function (options) {
        console.log('Validating column options');

        if (!Array.isArray(options.model.columns))
        {
            throw new Error("Columns must be an array of objects");
        }
        var columnIds = {};
        options.model.columns.forEach(function(column){
            if (!column.id && !column.dataAccessor){
                throw new Error("You must specify column id or dataAccessor");
            }
            if (!column.id && typeof column.dataAccessor !== "string"){
                throw new Error("Column id must be specified if dataAccessor is a not a string");
            }
            
            setDefault(column, "type", "string", "text");
            setDefault(column, "id", "string", column.dataAccessor);
            setDefault(column, "dataAccessor", "string", column.id);
            setDefault(column, "heading", "string", column.id);
            setDefault(column, "isIdentity", "boolean", false);
            setDefault(column, "isSortable", "boolean", true);
            setDefault(column, "isResizable", "boolean", true);
            setDefault(column, "visible", "boolean", true);
            
            if (columnIds[column.id]){
                throw new Error("Columns must have unique id's: "+column.id);
            }
            columnIds[columnIds]= true;
        });
    }
};

function setDefault(obj, prop, type, defaultValue){
    if (typeof obj[prop] !== type || (type === "object" && !type)){
        obj[prop] = defaultValue;
    }
}
