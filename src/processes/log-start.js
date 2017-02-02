/* eslint no-unused-vars: 0 */

/***************/
/** Log Start **/
/***************/
gridState.processors['log-start'] = function (options) {
    if (options.model.logging) {
        console.group('Processing grid state change');
        var whatChanged = JSON.stringify(options.model, filterUninterestingProperties);
        if (whatChanged.length === 2) {
            whatChanged = JSON.stringify(options.model);
        }
        console.log('Applying change', whatChanged);
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
    if (key === 'columns') {
        return value.length;
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
