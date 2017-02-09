/* eslint no-unused-vars: 0 */

/*********************/
/** Fetch-Data Init **/
/*********************/
gridState.processors['fetch-data-init'] = {
    input: ['data', 'time'],
    watches: 'data',
    runs: function (options) {
        if (typeof options.model.data === 'function') {
            var theLoadDataFunction = options.model.data;
            options.model.data = [];
            options.model.time.dataFunctionChanged = Date.now();

            options.model.processors['fetch-data'] = {
                watches: 'time',
                runs: function (pipelineArgs) {
                    return Promise.resolve(theLoadDataFunction()).then(function (data) {
                        options.model.data = data;
                    });
                }
            };
        }
    }
};
