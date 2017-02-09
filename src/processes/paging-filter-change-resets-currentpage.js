/* eslint no-unused-vars: 0 */

/*****************************************************/
/** Paging Filter changes should reset current page **/
/*****************************************************/
gridState.processors['paging-filter-change-resets-currentpage'] = {
    watches: ['filter'],
    runs: function (options) {
        if (!options.cache.ranOnce) {
            options.cache.ranOnce = true;
            return;
        }

        options.model.paging.currentPage = 1;
        if (options.model.logging) {
            console.log('Filter changed so the currentPage was reset');
        }
    }
};
