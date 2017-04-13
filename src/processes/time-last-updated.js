/* eslint no-unused-vars: 0 */

/***********************/
/** Time Last Updated **/
/***********************/
gridState.processors['time-last-updated'] = {
    watches: 'data',
    runs: function (options) {
        if (options.model.logging) {
            console.log("Data changed, recording the time of the update");
        }

        options.model.time.lastFetch = Date.now();
    }
};
