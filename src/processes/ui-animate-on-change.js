/* eslint no-unused-vars: 0 */

/**************************/
/** UI Animate on change **/
/**************************/
gridState.processors['ui-animate-on-change'] = {
    watches: ['paging','space','columns'],
    init: function(model){
        model.ui = model.ui || {};
        model.ui.animationEnabled = ko.observable(false);
    },
    runs: function (options) {
        options.model.ui.animationEnabled(true);
        
        if (options.cache.lastTimeout) {
            clearTimeout(options.cache.lastTimeout);
        }
        
        options.cache.lastTimeout = setTimeout(function(){
            options.model.ui.animationEnabled(false);
        }, 500)
    }
};
