/* eslint no-unused-vars: 0 */

/************************/
/** Filter Check Valid **/
/************************/
gridState.processors['filter-check-valid'] = {
    watches: ['filter'],
    runs: function (options) {

        if (options.model.logging) {
            console.log('Checking the filter criteria looks right');
        }

        if (typeof options.model.filter === 'string')
        {
            options.model.filter= {
                '*': options.model.filter
            };
        }
        
        for(var key in options.model.filter)
        {
            var filter = options.model.filter[key];
            if (typeof filter === "string"){
                options.model.filter[key] = filter.toLowerCase();
            }
        }
    }
};
