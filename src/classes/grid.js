/**********************/
/**    GRID CLASS    **/
/**********************/
var Grid = function (userOptions) {
    var internalVM = {};
    internalVM.data = ko.observableArray();
    internalVM.data.loaded = ko.observable(false);

    //These three lines are here temporarily as the number of errors 
    // without them is disruptive to testing.  Eventually they'll be removed
    internalVM.options = {};
    internalVM.pager = {};
    internalVM.sorter = {};
    
    internalVM.columns = ko.observableArray();
    var thisGridSymbol = Symbol("Grid Instance");
    
    var pipeline = PipelineFactory.create();
    
    var gridState = createInitialGridState();
    
    gridState.vm = internalVM;
    
    if (userOptions)
    {
        process(userOptions);
    }
    
    internalVM.process = process;

    return internalVM;
    
    ////////////////////
    
    function extendProperty(target, source, propName)
    {
        var rootValue = source[propName];
        if (typeof rootValue === "object")
        {
            if (!target[propName])
            {
                target[propName] = Array.isArray(rootValue) ? [] : {};
            }
            deepReplace(target[propName], source[propName]);
        }
        else if (typeof rootValue === "undefined")
        {
            return;
        }
        else
        {
            target[propName] = rootValue;
        }
    }
    
    function process(options){
        //Pull in only the recognized properties to discourage
        //devs from trying to hack the grid again
        extendProperty(gridState, options, "filter");
        extendProperty(gridState, options, "sort");
        extendProperty(gridState, options, "columns");
        extendProperty(gridState, options, "paging");
        extendProperty(gridState, options, "selection");
        extendProperty(gridState, options, "time");
        extendProperty(gridState, options, "space");
        extendProperty(gridState, options, "processors");
        
        // The data property must be handled seperatly as we
        // actually need to transform it on import
        if (ko.isObservable(options.data))
        {
            gridState.processors["fetch-data"] = function(pipelineArgs){
                pipelineArgs.model.data = options.data.peek();
            }
            if (!options.data[thisGridSymbol])
            {
                options.data[thisGridSymbol] = true;
                options.data[thisGridSymbol] = ko.computed(function(){
                    options.time = options.time || {};
                    options.time.koDataUpdated = Date.now();
                    process(options);
                });
            }
        }
        if (typeof options.data === "function")
        {
            gridState.processors["fetch-data"] = function(pipelineArgs){
                return Promise.resolve(options.data()).then(function(data){
                    pipelineArgs.model.data = data;
                });
            }
        }
        else if (Array.isArray(options.data))
        {
            gridState.data = options.data;
        }
        pipeline.process(gridState, "start");
    }
    
    /////////////////////

};

