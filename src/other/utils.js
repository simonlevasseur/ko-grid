/*****************/
/***** UTILS *****/
/*****************/

//All properties in objTarget which also occur in objSource will be replaced with the versions
//from objSource.  Nested objects will be processed recursively.  Arrays will be replaced, not merged.
function deepReplace(objTarget, objSource)
{
    for(var key in objSource)
    {
        var value = objSource[key];
        if (typeof value === "object" && !Array.isArray(value))
        {
            objTarget[key] = objTarget[key] || {};
            deepReplace(objTarget[key], value);
        }
        else
        {
            objTarget[key] = value;
        }
    }
}

function isArray(obj) {
    return Array.isArray(obj);
}

function isArrayOrObsArray(obj) {
    return isArray(obj) || isObservableArray(obj);
}

function isEmptyObject(obj) {
    if (!isObject(obj)) {
        return false;
    }

    var name;
    for (name in obj) {
        return false;
    }

    return true;
}

function isFuncNotObsArray(obj) {
    return isFunction(obj) && !ko.isObservable(obj);
}

function isFunction(obj) {
    return typeof obj === "function";
}


function promisify(value)
{
    if (!isPromise(value))
    {
        return Promise.resolve(value);
    }
    return value;
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object' && !isArray(obj);
}

function isObservableArray(obj) {
    return ko.isObservable(obj) && 'push' in obj;
}

function isPromise(obj) {
    return obj && typeof obj === "object" && typeof obj.then === "function";
}

//Recursively walks through objects, invoking the supplied predicate whenever
//the condition function returns true
//
// condition/predicate signature: (value, key, obj)
function walkObject(obj, condition, predicate)
{
    for(var key in obj)
    {
        var value = obj[key];
        if (condition(value, key, obj))
        {
            predicate(value, key, obj);
        }
        if (typeof value === "object" && !Array.isArray(value))
        {
            walkObject(value, condition, predicate);
        }
    }
}

/************************/
/***** KO EXTENDERS *****/
/************************/
ko.extenders.nssgSingleSelect = function (target, option) {
    // Before change clears the array before the new value is set
    target.subscribe(function (oldVal) {
        if (oldVal && oldVal.length) {
            oldVal.length = 0;
        }
    }, null, 'beforeChange');

    target.subscribe(function (newVal) {
        if (newVal && newVal.length > 1) {
            newVal.splice(0, newVal.length - 1);
        }
    });
};
