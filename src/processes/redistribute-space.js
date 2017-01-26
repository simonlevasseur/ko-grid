/* eslint no-unused-vars: 0 */

/************************/
/** Redistribute Space **/
/************************/
gridState.processors['redistribute-space'] = {
    watches: ['columns', 'space'],
    runs: function (options) {
        if (options.model.logging) {
            console.log('Redistributing exta space amoung the columns');
        }

        // Resize the columns under some conditions
    }
};
