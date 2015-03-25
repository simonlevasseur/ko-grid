/********************/
/***** DEFAULTS *****/
/********************/
var defaultOptions = {
    // actions: [],
    // columns: [],
    // data: [],
    deletable: {
        css: 'nssg-action-delete',
        onClick: function (rowData) {
            this.data.remove(rowData);
        }
    },
    invokable: {
        css: 'nssg-action-invoke',
        onClick: function (rowData) {
            alert('Item invoked.');
        }
    },
    pageable: {
        enabled: true,
        // defaultPageSize: 10,
        hideSinglePage: false,
        pageSizes: [10, 50, 100, 500, 1000],
        serverPaging: false
    },
    resizable: true,
    selectable: {
        multiSelect: true,
        width: 40,
        minWidth: 40,
        maxWidth: 40
    },
    sortable: {
        enabled: true,
        defaultSortCol: null,
        defaultSortDir: 'asc',
        dataAccessor: function (dataObj, col) {
            if (!dataObj) { return null; }
            return (typeof col.dataAccessor === 'function') ? col.dataAccessor(dataObj) : dataObj[col.dataAccessor];
        },
        serverSorting: false
    }
    // onOptionsChange: function (gridObj) {
    //     console.log(gridObj);
    // }
};
