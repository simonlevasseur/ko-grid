/* eslint no-unused-vars: 0 */

/**********************************************/
/** sort changes should reset current page **/
/**********************************************/
gridState.processors['sort-change-resets-currentpage'] = {
    watches: ['sort'],
    runs: function (options) {
        if (!options.cache.ranOnce){
            options.cache.ranOnce = true;
            return;
        }
        console.log('Checking if sort changed');

        options.model.paging.currentPage = 1;
        console.log("sort changed so the currentPage was reset");
    }
};
