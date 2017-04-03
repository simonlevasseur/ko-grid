/* eslint no-unused-vars: 0 */

/***********************************/
/** Columns Enable Actions Column **/
/***********************************/
gridState.processors['columns-enable-actions-column'] = {
    watches: ['ui', 'columns'],
    runs: function (options) {
        if (options.model.ui && options.model.ui.actions) {
            var foundAny = false;
            for (var key in options.model.ui.actions) { // eslint-disable-line guard-for-in
                foundAny = true;
            }
            if (!foundAny) {
                return;
            }

            var actionCol = findFirst(options.model.columns, { id: '$$action' });
            if (!actionCol) {
                if (options.model.logging) {
                    console.log('Adding the action column');
                }
                actionCol = {
                    id: '$$action',
                    type: 'actions',
                    isSortable: false,
                    isIdentity: false,
                    isResizable: false,
                    width: 0
                };
                options.model.columns.unshift(actionCol);
            }
        }
    }
};
