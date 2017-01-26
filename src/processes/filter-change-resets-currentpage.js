/* eslint no-unused-vars: 0 */

/**********************************************/
/** Filter changes should reset current page **/
/**********************************************/
gridState.processors['filter-change-resets-currentpage'] = {
    watches: ['filter'],
    runs: function (options) {
        if (!options.cache.ranOnce){
            options.cache.ranOnce = true;
            options.cache.filter = options.model.filter;
            return;
        }
        console.log('Checking if filter changed');

        var now = options.model.filter;
        var before = options.cache.filter;
        
        if (before !== now)
        {
            options.cache.filter = now;
            options.model.paging.currentPage = 1;
            console.log("Filter changed so the currentPage was reset");
        }
    }
};
