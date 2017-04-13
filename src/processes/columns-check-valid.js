/* eslint no-unused-vars: 0 */

/*************************/
/** Columns Check Valid **/
/*************************/
gridState.processors['columns-check-valid'] = {
    watches: ['columns'],
    runs: function (options) {
        if (!Array.isArray(options.model.columns)) {
            throw new Error('Columns must be an array of objects');
        }
        
        var didChange = false;

        var identityColPresent = !!findFirst(options.model.columns, { isIdentity: true });
        var columnIds = {};
        options.model.columns.forEach(function (column) {
            if (!column.id && !column.dataAccessor) {
                throw new Error('You must specify column id or dataAccessor');
            }
            if (!column.id && typeof column.dataAccessor !== 'string') {
                throw new Error('Column id must be specified if dataAccessor is a not a string');
            }

            didChange |= setDefault(column, 'type', 'string', 'text');
            didChange |= setDefault(column, 'id', 'string', column.dataAccessor);
            if (typeof column.dataAccessor !== 'function') {
                didChange |= setDefault(column, 'dataAccessor', 'string', column.id);
            }
            didChange |= setDefault(column, 'heading', 'string', column.id);
            didChange |= setDefault(column, 'isIdentity', 'boolean', !identityColPresent);
            didChange |= setDefault(column, 'isSortable', 'boolean', true);
            didChange |= setDefault(column, 'isResizable', 'boolean', true);
            didChange |= setDefault(column, 'isVisible', 'boolean', true);

            if (columnIds[column.id]) {
                throw new Error("Columns must have unique id's: " + column.id);
            }
            columnIds[columnIds] = true;
        });
        
        if (options.model.logging && didChange) {
            console.log('Default values applied to the columns');
        }
    }
};

function setDefault(obj, prop, type, defaultValue) {
    if (typeof obj[prop] !== type || (type === 'object' && !type)) { // eslint-disable-line valid-typeof
        obj[prop] = defaultValue;
        return true;
    }
    else {
        return false;
    }
}
