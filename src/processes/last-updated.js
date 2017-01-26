/* eslint no-unused-vars: 0 */

/******************/
/** Last Updated **/
/******************/
gridState.processors['last-updated'] = {
    watches: 'data',
    runs: function (options) {
        if (options.model.logging) {
            console.log("Updating the lastFetch'd timestamp");
        }

        options.model.time.lastFetch = Date.now();
    }
};
