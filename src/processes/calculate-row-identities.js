/* eslint no-unused-vars: 0 */

/******************************/
/** calculate-row-identities **/
/******************************/
gridState.processors['calculate-row-identities'] = {
    watches: ['data', 'columns'],
    runs: function (options) {
        if (!options.model.ui.selectable) {
            return;
        }
        if (options.model.logging) {
            console.log('Calculating row identities');
        }

        var identityColumns = options.model.columns.filter(function (col) {
            return col.isIdentity;
        }).sort(function (colA, colB) {
            return colA.id < colB.id ? -1 : 1;
        });

        options.model.data.forEach(function (row) {
            var identity = identityColumns.reduce(function (total, col) {
                return total + '$' + getCellData(row, col);
            }, '');
            row.$identity = identity;
        });
        // todo calculate identities
    }
};

function getCellData(row, col) {
    return typeof col.dataAccessor === 'string' ? row[col.dataAccessor] : col.dataAccessor(row);
}
