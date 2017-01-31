/****************************/
/**     CUSTOMIZER CLASS   **/
/****************************/
var gridCustomizer; // eslint-disable-line no-unused-vars
gridCustomizer = function (baseOptions, baseInitializer) {
    return function CustomizedGrid(overrideOptions, overrideInitializer) {
        var realOptions = {};
        var result;

        return loadBaseOptions()
            .then(loadOverrideOptions)
            .then(addTemplates)
            .then(function () {
                result = new Grid(realOptions);
                return result.ready;
            })
            .then(function () {
                return result;
            })
            .catch(function (err) {
                console.error('Failed to initialize grid', (err && err.message ? err.message : err));
            });
        // //////////////////////

        function loadBaseOptions() {
            deepReplace(realOptions, baseOptions);
            if (typeof baseInitializer === 'function') {
                baseInitializer(realOptions);
            }
            return loadAllDependencies(realOptions);
        }
        function loadOverrideOptions() {
            deepReplace(realOptions, overrideOptions);
            if (typeof overrideInitializer === 'function') {
                overrideInitializer(realOptions);
            }
        }
        function addTemplates() {
            deepReplace(templates, realOptions.templates);
        }
        function initActualGrid() {
            actualGrid(new Grid(realOptions));
        }
    };
};

function loadAllDependencies(options) {
    var initPromises = [];
    walkObject(options, isPromise, function (value, key, obj) {
        initPromises.push(value.then(function (resolvedValue) {
            obj[key] = resolvedValue; // eslint-disable-line no-param-reassign
        }));
    });

    return Promise.all(initPromises);
}
