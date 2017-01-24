/* eslint no-unused-vars: 0 */

/***************/
/** Sort Data **/
/***************/
gridState.processors.sort = {
    watches: ['sort', 'data'],
    runs: function (options) {
        console.log('Sorting the data');

        var originalData = options.changed.data ? options.model.data : options.cache.data;
        options.cache.data = originalData;
        
        var sort = options.model.sort;
        var columnsById = options.model.columnsById;
        
        options.model.data = sort.length == 0 ? originalData : originalData.slice().sort(function(rowA, rowB){
            for(var i=0;i<sort.length;i++)
            {
                var criteria = sort[i];
                var column = columnsById[criteria.sortBy];
                if (!column) {
                    console.warn("Tried to sort on a column that wasn't present in the data", criteria.sortBy);
                    continue;
                }
                var sortFn = gridState.sortFunctions[column.type];
                if (!sortFn){
                    console.warn("No comparator available for the specified column type, using generic compare", column.type);
                    sortFn = gridState.sortFunctions["generic"];
                }
                var valueA = rowA[column.dataAccessor];
                var valueB = rowB[column.dataAccessor];
                var result = sortFn(valueA, valueB);
                if (result !== 0){
                    return criteria.sortAsc ? result: 0-result;
                }
            }
            return 0;
        });
    }
};

function genericCompare(valueA, valueB) {
    return valueA === valueB ? 0 : (valueA < valueB ? -1 : 1);
}

gridState.sortFunctions = {
    generic: genericCompare,
    text: genericCompare
};

