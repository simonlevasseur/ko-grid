/* eslint no-unused-vars: 0 */

/*************************/
/** Initial Grid State  **/
/*************************/

function createInitialGridState() {
    var gridState = {
        filter: {},
        // {
        //    'name': 'potato salad',  //also matches 'salad potato' and 'sweet potato and turnip salad'
        //    'description': /this is rejex/, applies the regex on the column
        //    '*'   : 'creamy coleslaw',  each word occurs in any column, order doesn't matter
        // }
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
                'paging-sort-change-resets-currentpage',
                'filter-check-valid'
            ],
            process: 'local',
            local: [
                { watches: 'time', runs: 'fetch-data' },
                'time-last-updated',
                'data-check-valid',
                'data-fetch-cell-values',
                'data-aggregate-values',
                'data-to-lowercase',
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
                'ui-animate-on-change',
                'columns-sort-indicators',
                'data-calculate-row-identities',
                'selection-select-all',
                'selection-select-single',
                'selection-disable-multi-page',
                'data-row-selection',
                'ui-selected-all-indicator',
                'ui-selected-count',
                'ui-export-selected-rows',
                'columns-apply-min-max-width',
                'columns-redistribute-space',
                'ui-columns-performance',
                'ui-columns',
                'vm-update-bindings-paging',
                'vm-update-bindings-ui',
                'vm-update-bindings-grid-state',
                'vm',
            ],
            'vm':[],
            'use-handlebars' : 'vm-handlebars-data',
            'use-knockout': 'vm-update-bindings-data',
            'ui-columns' : 'ui-ko-columns',
            'ui-handlebar-columns': 'vm-handlebars-columns',
            'ui-ko-columns':'vm-update-bindings-columns',
            'fetch-data': function () {
                throw new Error("Grids must specifiy a 'fetch-data' function or override the definition of 'process'");
            },
            'columns-redistribute-space': 'columns-redistribute-space-to-rightmost-visible'
            /* [
                'columns-lock-columns-user-just-resized',
                'columns-redistribute-space-equally',
                'columns-unlock-columns-user-just-resized',
            ]*/

        }
    };
    AddInitialProcesses(gridState);
    return gridState;
}
