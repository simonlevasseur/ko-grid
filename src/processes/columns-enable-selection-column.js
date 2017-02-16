/* eslint no-unused-vars: 0 */

/*************************************/
/** Columns Enable Selection Column **/
/*************************************/
gridState.processors['columns-enable-selection-column'] = {
    watches: ['ui'],
    runs: function (options) {
        if (options.model.ui.selectable) {
            var selectCol = findFirst(options.model.columns, { id: '$$select' });
            if (!selectCol) {
                if (options.model.logging) {
                    console.log('Adding the row selection column');
                }
                selectCol = {
                    id: '$$select',
                    type: 'select',
                    isSortable: false,
                    isIdentity: false,
                    isResizable: false,
                    width: 40
                };
                options.model.columns.unshift(selectCol);
            }
            if (typeof options.model.ui.selectMode === 'undefined') {
                options.model.ui.selectMode = 'multi';
            }
        }
    }
};
