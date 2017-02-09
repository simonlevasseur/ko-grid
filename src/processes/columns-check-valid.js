/* eslint no-unused-vars: 0 */

/*************************/
/** Columns Check Valid **/
/*************************/
gridState.processors['columns-check-valid'] = {
    watches: ['columns'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Validating column options');
        }

        if (!Array.isArray(options.model.columns)) {
            throw new Error('Columns must be an array of objects');
        }

        var identityColPresent = !!findFirst(options.model.columns, { isIdentity: true });
        var columnIds = {};
        options.model.columns.forEach(function (column) {
            if (!column.id && !column.dataAccessor) {
                throw new Error('You must specify column id or dataAccessor');
            }
            if (!column.id && typeof column.dataAccessor !== 'string') {
                throw new Error('Column id must be specified if dataAccessor is a not a string');
            }

            setDefault(column, 'type', 'string', 'text');
            setDefault(column, 'id', 'string', column.dataAccessor);
            if (typeof column.dataAccessor !== 'function') {
                setDefault(column, 'dataAccessor', 'string', column.id);
            }
            setDefault(column, 'heading', 'string', column.id);
            setDefault(column, 'isIdentity', 'boolean', !identityColPresent);
            setDefault(column, 'isSortable', 'boolean', true);
            setDefault(column, 'isResizable', 'boolean', true);
            setDefault(column, 'isVisible', 'boolean', true);

            if (columnIds[column.id]) {
                throw new Error("Columns must have unique id's: " + column.id);
            }
            columnIds[columnIds] = true;
        });
    }
};

function setDefault(obj, prop, type, defaultValue) {
    if (typeof obj[prop] !== type || (type === 'object' && !type)) { // eslint-disable-line valid-typeof
        obj[prop] = defaultValue;
    }
}
