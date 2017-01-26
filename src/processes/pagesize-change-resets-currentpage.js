/* eslint no-unused-vars: 0 */

/************************************************/
/** Pagesize changes should reset current page **/
/************************************************/
gridState.processors['pagesize-change-resets-currentpage'] = {
    watches: ['paging'],
    runs: function (options) {
        if (!options.cache.ranOnce){
            options.cache.ranOnce = true;
            options.cache.pageSize = options.model.paging.pageSize;
            return;
        }
        
        var paging = options.model.paging;
        var before = options.cache.pageSize;
        var now = paging.pageSize;
        
        if (before !== now)
        {
            options.cache.pageSize = now;
            paging.currentPage = 1;
            if (options.model.logging) {
                console.log("Pagesize changed so the currentPage was reset");
            }
        }
    }
};
