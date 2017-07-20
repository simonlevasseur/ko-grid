/* eslint no-unused-vars: 0 */

/***********************************/
/** data-calculate-row-identities **/
/***********************************/
gridState.processors['data-calculate-row-identities'] = {
    watches: ['data', 'columns'],
    runs: function (options) {
        if (!options.model.ui.selectable && (!options.model.ui.actions || options.model.ui.actions.length === 0)) {
            return;
        }
        var didChange = false;

        var identityColumns = options.model.columns.filter(function (col) {
            return col.isIdentity;
        }).sort(function (colA, colB) {
            return colA.id < colB.id ? -1 : 1;
        });

        options.model.data.forEach(function (row) {
            var identity = identityColumns.reduce(function (total, col) {
                return total + '_' + getCellData(row, col);
            }, '');
            var formattedIdentity = identity.replace(/[\s'".@+\-|]/g, '');
            if (row.$identity !== formattedIdentity) {
                didChange = true;
            }
            row.$identity = formattedIdentity;
        });

        if (options.model.logging && didChange) {
            console.log('Row identities calculated');
        }
    }
};

function getCellData(row, col) {
    return row[col.id];
}
