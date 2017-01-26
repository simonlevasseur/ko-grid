/**********************/
/**    GRID CLASS    **/
/**********************/
var Grid = function (userOptions) {
    var internalVM = {};
    internalVM.data = ko.observableArray();
    internalVM.data.loaded = ko.observable(false);
    internalVM.paging = ko.observable({});

    //These three lines are here temporarily as the number of errors 
    // without them is disruptive to testing.  Eventually they'll be removed
    internalVM.options = {};
    internalVM.pager = {};
    
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
        if (Array.isArray(rootValue))
        {
            target[propName] = rootValue;
        }
        else if (typeof rootValue === "object")
        {
            if (!target[propName])
            {
                target[propName] = {};
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
        extendProperty(gridState, options, "logging");
        
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
        var loggingEnabled = gridState.logging;
        if (loggingEnabled)
        {
            console.group("Processing grid state change");
            console.log("Applying change", JSON.stringify(options, filterUninterestingProperties));
        }
        var cleanup = function(){
            if (loggingEnabled)
            {
                console.log("Final grid state", JSON.stringify(gridState, filterUninterestingProperties));
                console.groupEnd();
            }
        }
        var promise = pipeline.process(gridState, "start");
        promise.then(cleanup, cleanup);
    }
    
    /////////////////////

};

function filterUninterestingProperties(key, value)
{
    if (key==="data"){return undefined;}
    if (key==="processors"){return undefined;}
    if (key==="vm"){return undefined;}
    if (key==="columns"){return value.length;}
    if (key==="columnsById"){return undefined;}
    if (key==="data_ChangeMode"){return undefined;}
    if (key==="logging"){return undefined;}
    return value;
}