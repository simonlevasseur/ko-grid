/* eslint no-unused-vars: 0 */

/*************************/
/** Initial Grid State  **/
/*************************/

function createInitialGridState() {
    var gridState = {
        filter: '',
        sort: [
        // { sortBy: '', sortAsc: true }
        ],
        columns: [
            // {
            //    id: '',
            //    isIdentity: '',
            //    type: ''
            //    visible: true,
            //    isSortable: true,
            //    isSorted: true,
            //    isSortedAsc: true,
            //    isResizable: true,
            //    width: 0,
            //    min-width: 0,
            //    max-width: 0,
            //    header: ''
            //    dataAccessor: '' || function(){}
            // }
        ],
        logging: true,
        paging: {
            pageSize: 100,
            pageCount: 1,
            currentPage: 1
        },
        selection: {
            // rowid67: true
        },
        time: {
            lastRefreshRequest: new Date(),
            lastFetch: new Date()
        },
        space: {
            width: 0,
            height: 0
        },
        ui: {
            allowResizing: true,
            allowSorting: true
        },
        data: [],
        data_ChangeMode: 'Identity',
        processors: {
            start: ['log-start', 'pre-process', 'process', 'post-process', 'log-done'],
            'pre-process': [
                'fetch-data-init',
                'columns-enable-selection-column',
                'columns-enable-actions-column',
                'vm-container-size',
                'columns-check-valid',
                'columns-index-by-id',
                'paging-filter-change-resets-currentpage',
                'paging-sort-change-resets-currentpage'
            ],
            process: 'local',
            local: [
                { watches: 'time', runs: 'fetch-data' },
                'time-last-updated',
                'data-check-valid',
                'data-fetch-cell-values',
                'data-filter',
                'data-sort',
                'paging-check-valid',
                'paging-pagesize-change-resets-currentpage',
                'data-paging'
            ],
            remote: [
                'paging-pagesize-change-resets-currentpage',
                { watches: ['time', 'sort', 'filter', 'paging', 'columns'], runs: 'fetch-data' },
                'time-last-updated',
                'data-check-valid',
                'data-fetch-cell-values'
            ],
            'post-process': [
                'columns-sort-indicators',
                'data-calculate-row-identities',
                'selection-select-all',
                'selection-select-single',
                'selection-disable-multi-page',
                'data-row-selection',
                'ui-selected-all-indicator',
                'ui-selected-count',
                'ui-export-selected-rows',
                'columns-redistribute-space',
                'vm-handlebars-data',
                'vm-update-bindings-data',
                'vm-update-bindings-paging',
                'vm-update-bindings-columns',
                'vm-update-bindings-ui',
                'vm-update-bindings-grid-state'
            ],
            'fetch-data': function () {
                throw new Error("Grids must specifiy a 'fetch-data' function or override the definition of 'process'");
            }

        }
    };
    AddInitialProcesses(gridState);
    return gridState;
}
