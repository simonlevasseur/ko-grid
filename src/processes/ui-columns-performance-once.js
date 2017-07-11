/* eslint no-unused-vars: 0 */

/*********************************/
/** UI Columns Performance Once **/
/*********************************/
gridState.processors['ui-columns-performance-once'] = {
    watches: ['sort', 'columns', 'space'],
    init: function(model){
        model.processors['ui-columns-performance-once-runner'] = [];
    },
    runs: function (options) {
        if (!options.model.space || !options.model.space.width) {
            return;
        }
        var runOnce = [];
        if (!options.model.vm.columns || !options.model.vm.columns())
        {
            console.log("Running vm-update-bindings-columns once");
            runOnce.push('vm-update-bindings-columns');
        }
        if (!options.model.vm.hb_columns || !options.model.vm.hb_columns())
        {
            console.log("Running vm-handlebars-columns once");
            runOnce.push('vm-handlebars-columns');
        }
        options.model.processors['ui-columns-performance-once-runner'] = runOnce;
    }
};
