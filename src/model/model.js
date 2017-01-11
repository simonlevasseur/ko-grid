/* eslint no-unused-vars: 0 */

/*************************/
/** Initial Grid State  **/
/*************************/

var gridState = {
    filter: '',
    sort: [
    // { sortBy: '', sortAsc: true }
    ],
    columns: [
        // {
        //    key: '',
        //    isIdentity: '',
        //    type: ''
        // }
    ],
    paging: {
        pageSize: 10,
        pageCount: 1,
        currentPage: 1
    },
    selection: {
        // rowid67: true
    },
    time: {
        lastRefresh: new Date(),
        lastFetch: new Date()
    },
    space: {
        width: 0,
        height: 0
    },
    data: [],
    data_ChangeMode: 'Identity',
    processors: {
        start: ['pre-process', 'process', 'post-process'],
        'pre-process': [],
        process: 'local-process',
        'post-process': ['redistribute-space', 'update-bindings-data', 'update-bindings-paging', 'update-bindings-columns'],
        'local-process': [{ watches: 'time', runs: 'fetch-data' }, 'last-updated', 'filter', 'sort', 'check-paging-valid', 'paging'],

        'fetch-data': function () {
            throw new Error("Grids must specifiy a 'fetchdata' function or override the definition of 'process'");
        }

    }
};
