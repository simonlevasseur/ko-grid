/* eslint no-unused-vars: 0 */

/**********************************************/
/** sort changes should reset current page **/
/**********************************************/
gridState.processors['sort-change-resets-currentpage'] = {
    watches: ['sort'],
    runs: function (options) {
        if (!options.cache.ranOnce) {
            options.cache.ranOnce = true;
            return;
        }
        options.model.paging.currentPage = 1;
        if (options.model.logging) {
            console.log('sort changed so the currentPage was reset');
        }
    }
};
