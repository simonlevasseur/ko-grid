/* eslint no-unused-vars: 0 */

/*********************************/
/** UI Flag pipeline is running **/
/*********************************/
gridState.processors['ui-flag-pipeline-is-running'] = function (options) {
    options.model.timers = options.model.timers || {};
    options.model.ui = options.model.ui || {};
    options.model.ui.running = options.model.ui.running || ko.observable(false);
    options.model.timers.running = setTimeout(function() {
        options.model.ui.running(true);
    }, options.model.ui.showSpinnerDelay);
};
