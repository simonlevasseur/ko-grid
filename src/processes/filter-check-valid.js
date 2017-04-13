/* eslint no-unused-vars: 0 */

/************************/
/** Filter Check Valid **/
/************************/
gridState.processors['filter-check-valid'] = {
    watches: ['filter'],
    runs: function (options) {
        var hasKeys = false;
        for(var key in options.model.filter){
            hasKeys = true;
            break;
        }
        if (!hasKeys) {
            return;
        }
        
        if (options.model.logging) {
            console.log('Checking the filter criteria looks right');
        }

        if (typeof options.model.filter === 'string') {
            options.model.filter = {
                '*': options.model.filter
            };
        }

        for (var key in options.model.filter) {
            if (options.model.filter.hasOwnProperty(key)) {
                var filter = options.model.filter[key];
                if (filter === '') {
                    delete options.model.filter[key];
                }
                else if (typeof filter === 'string') {
                    options.model.filter[key] = filter.toLowerCase();
                }
            }
        }
    }
};
