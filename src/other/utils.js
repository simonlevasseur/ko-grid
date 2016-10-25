/*****************/
/***** UTILS *****/
/*****************/
function isArray(obj) {
    return Array.isArray(obj);
}

function isArrayOrObsArray(obj) {
    return isArray(obj) || isObservableArray(obj);
}

function isFuncNotObsArray(obj) {
    return isFunction(obj) && !ko.isObservable(obj);
}

function isFunction(obj) {
    return typeof obj === "function";
}

function isPromise(obj) {
    return obj && typeof obj === "object" && typeof obj.then === "function";
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

function isObservableArray(obj) {
    return ko.isObservable(obj) && 'push' in obj;
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
