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
                'ui-enable-selection-column',
                'ui-enable-actions-column',
                'check-columns-valid',
                'index-columns-by-id',
                'filter-change-resets-currentpage',
                'sort-change-resets-currentpage'
            ],
            process: 'local',
            local: [
                { watches: 'time', runs: 'fetch-data' },
                'last-updated',
                'check-data-valid',
                'fetch-cell-values',
                'filter',
                'sort',
                'check-paging-valid',
                'pagesize-change-resets-currentpage',
                'paging',
            ],
            remote: [
                'pagesize-change-resets-currentpage',
                { watches: ['time', 'sort', 'filter', 'paging', 'columns'], runs: 'fetch-data' },
                'last-updated',
                'check-data-valid',
                'fetch-cell-values',
            ],
            'post-process': [
                'redistribute-space',
                'sort-indicators',
                'calculate-row-identities',
                'select-all',
                'select-single',
                'disable-multi-page-selection',
                'row-selection',
                'ui-selected-all-indicator',
                'ui-selected-count',
                'update-bindings-data',
                'update-bindings-paging',
                'update-bindings-columns',
                'update-bindings-ui',
                'update-bindings-grid-state'
            ],
            'fetch-data': function () {
                throw new Error("Grids must specifiy a 'fetch-data' function or override the definition of 'process'");
            }

        }
    };
    AddInitialProcesses(gridState);
    return gridState;
}
