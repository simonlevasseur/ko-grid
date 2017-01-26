/* eslint no-unused-vars: 0 */

/**********************/
/** Check-data-Valid **/
/**********************/
gridState.processors['check-data-valid'] = {
    watches: ['data'],
    runs: function (options) {
        console.log('Checking if filter changed');

        var valid = true;
        if (!Array.isArray(options.model.data))
        {
            valid = false;
            options.model.data = [];
        }
        
        if (options.model.data.filter(notNullObject).length !== options.model.data.length){
            valid = false;
        }
        
        if (!valid){
            throw new Error("Data must be an array of non-null objects")
        }
    }
};

function notNullObject(row){
    return row && typeof row === "object";
}
