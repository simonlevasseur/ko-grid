/* eslint no-unused-vars :0 */

/**********************/
/**    GRID CLASS    **/
/**********************/
var Grid = function (userOptions) {
    var internalVM = {};
    internalVM.data = ko.observableArray();
    internalVM.data.loaded = ko.observable(false);
    internalVM.paging = ko.observable({});
    internalVM.ui = ko.observable({});
    internalVM.size = ko.observable();

    internalVM.columns = ko.observableArray();
    var thisGridSymbol = Symbol('Grid Instance');

    var inputPipeline = PipelineFactory.create();
    inputPipeline.processors["process"] = processInput;
    
    var pipeline = PipelineFactory.create();

    var gridState = createInitialGridState();

    gridState.vm = internalVM;

    if (userOptions) {
        internalVM.ready = process(userOptions);
    }

    internalVM.process = process;

    ko.computed(function () {
        var size = internalVM.size();
        if (size) {
            process({ space: size });
        }
    });

    return internalVM;

    // //////////////////

    function extendProperty(target, source, propName) {
        var rootValue = source[propName];
        if (Array.isArray(rootValue)) {
            target[propName] = rootValue;
        }
        else if (typeof rootValue === 'object') {
            if (!target[propName]) {
                target[propName] = {};
            }
            deepReplace(target[propName], source[propName]);
        }
        else if (typeof rootValue === 'undefined') {
            // do nothing
        }
        else {
            target[propName] = rootValue;
        }
    }

    function process(options) {
        return inputPipeline.process(options, "process");
    }
    function processInput(outerOptions){
        var options = outerOptions.model;
        // Pull in only the recognized properties to discourage
        // devs from trying to hack the grid again
        extendProperty(gridState, options, 'filter');
        extendProperty(gridState, options, 'sort');
        extendProperty(gridState, options, 'columns');
        extendProperty(gridState, options, 'columnsById');
        extendProperty(gridState, options, 'paging');
        extendProperty(gridState, options, 'selection');
        extendProperty(gridState, options, 'time');
        extendProperty(gridState, options, 'space');
        extendProperty(gridState, options, 'processors');
        extendProperty(gridState, options, 'logging');
        extendProperty(gridState, options, 'ui');

        // The data property must be handled seperatly as we
        // actually need to transform it on import
        if (ko.isObservable(options.data)) {
            gridState.processors['fetch-data'] = function (pipelineArgs) {
                pipelineArgs.model.data = options.data.peek();
            };
            if (!options.data[thisGridSymbol]) {
                options.data[thisGridSymbol] = true;
                options.data[thisGridSymbol] = ko.computed(function () {
                    options.time = options.time || {};
                    options.time.koDataUpdated = Date.now();
                    process(options);
                });
            }
        }
        if (typeof options.data === 'function') {
            gridState.processors['fetch-data'] = function (pipelineArgs) {
                return Promise.resolve(options.data()).then(function (data) {
                    pipelineArgs.model.data = data;
                });
            };
        }
        else if (Array.isArray(options.data)) {
            gridState.data = options.data;
        }
        gridState.gridInput = options;
        return pipeline.process(gridState, 'start');
    }

    // ///////////////////
};
