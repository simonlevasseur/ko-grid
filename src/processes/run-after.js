/* eslint no-unused-vars: 0 */

/******************/
/** ko run after **/
/******************/
gridState.processors['run-after'] = {
    init: function (model) {
        model.runAfter = [];
    },
    runs: function (options) {
        var temp = options.model.runAfter;
        var perf = {};
        temp.forEach(function(req){
            try{
                var before = performance.now();
                req.fnRef();
                var after = performance.now();
                perf[req.id] = after - before;
            }
            catch(err){
                console.error(err);
            }
        });
        console.log("Run after performance: ", perf);
        options.model.runAfter = [];
    }
};
