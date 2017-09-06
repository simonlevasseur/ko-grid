/* eslint no-unused-vars: 0 */

/**********************************/
/** UI Flag pipeline is finished **/
/**********************************/
gridState.processors['ui-flag-pipeline-is-finished'] =
function (options) {
    clearTimeout(options.model.timers.running);
    options.model.ui.running(false);
};
