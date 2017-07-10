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
        var didChange = options.model.ui["columns-use-handlebars"]() !== useHandlebars;
        options.model.ui["columns-use-handlebars"](useHandlebars);
        options.model.processors["ui-columns"] = useHandlebars ? "ui-handlebar-columns" : "ui-ko-columns";
        
        var description = useHandlebars?"handlebars (faster performance)":"knockout (animations enabled)";
        if (options.cache.didRunOnce && didChange) {
            console.log("Pagesize crossed 100 items/page threshold; Header row will now use " + description);
        } else if (!options.cache.didRunOnce) {
            console.log("Header row will use "+ description);
        }
        options.cache.didRunOnce = true;
    }
};
