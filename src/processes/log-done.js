/* eslint no-unused-vars: 0 */

/***************/
/** Log Done **/
/***************/
gridState.processors['log-done'] = function (options) {
    if (options.model.logging) {
        console.log('Final grid state', JSON.parse(JSON.stringify(options.model, filterUninterestingProperties)));
        console.groupEnd();
    }
};


function filterUninterestingProperties(key, value) {
    if (key === 'data') {
        return undefined;
    }
    if (key === 'processors') {
        return undefined;
    }
    if (key === 'vm') {
        return undefined;
    }
    if (key === 'columnsById') {
        return undefined;
    }
    if (key === 'data_ChangeMode') {
        return undefined;
    }
    if (key === 'logging') {
        return undefined;
    }
    return value;
}
