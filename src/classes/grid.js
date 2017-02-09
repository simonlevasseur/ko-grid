/* eslint no-unused-vars :0 */

/**********************/
/**    GRID CLASS    **/
/**********************/
var Grid = function (userOptions) {
    var didInitSymbol = Symbol('did run init');

    var internalVM = {};

    var inputPipeline = PipelineFactory.create();
    inputPipeline.processors.process = processInput;

    var pipeline = PipelineFactory.create();

    var gridState = createInitialGridState();
    gridState.vm = internalVM;
    internalVM.process = process;

    checkInit();

    if (userOptions) {
        internalVM.ready = process(userOptions);
    }
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

    function checkInit() {
        for (var key in gridState.processors) {
            var processor = gridState.processors[key];
            if (typeof processor.init === 'function' && !processor[didInitSymbol]) {
                processor[didInitSymbol] = true;
                try {
                    processor.init(gridState);
                }
                catch (err) {
                    console.error('Error during grid processor initialization', err);
                }
            }
        }
    }

    function getImportedProperties() {
        var allProcessors = values(gridState.processors);
        var inputs = allProcessors.map(function (processor) {
            return processor.input;
        }).filter(isTruthy);
        var watches = allProcessors.map(function (processor) {
            return processor.watches;
        }).filter(isTruthy);
        var propertiesInArrays = inputs.concat(watches).map(arrayify);
        var properties = propertiesInArrays.reduce(function (all, arr) {
            return all.concat(arr);
        }, []);
        var uniqueProperties = unique(properties);

        return uniqueProperties;
    }

    function process(options) {
        return inputPipeline.process(options, 'process');
    }
    function processInput(outerOptions) {
        var options = outerOptions.model;

        // re-run the init in case any processors got added/replaced since the last run
        checkInit();

        // Pull in only the recognized properties to discourage
        // devs from trying to hack the grid again
        getImportedProperties().forEach(function (property) {
            extendProperty(gridState, options, property);
        });

        gridState.lastInput = options;
        return pipeline.process(gridState, 'start');
    }

    // ///////////////////
};
