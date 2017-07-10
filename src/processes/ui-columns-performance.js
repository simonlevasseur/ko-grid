/* eslint no-unused-vars: 0 */

/***************************/
/** UI Columns Performance **/
/***************************/
gridState.processors['ui-columns-performance'] = {
    watches: ['paging'],
    init: function(model){
        model.ui["columns-use-handlebars"] = ko.observable(false);
    },
    runs: function (options) {
        var useHandlebars = options.model.paging.pageSize > 100;
        options.model.ui["columns-use-handlebars"](useHandlebars);
        options.model.processors["ui-columns"] = useHandlebars ? "ui-handlebar-columns" : "ui-ko-columns";
    }
};
