/* eslint no-unused-vars: "off" */

/*****************/
/**     UTILS   **/
/*****************/

// All properties in objTarget which also occur in objSource will be replaced with the versions
// from objSource.  Nested objects will be processed recursively.  Arrays will be replaced, not merged.

function deepReplace(objTarget) {
    var objSources = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < objSources.length; i++) {
        var objSource = objSources[i];
        for (var key in objSource) { // eslint-disable-line guard-for-in
            var value = objSource[key];
            if (typeof value === 'object' && !(Array.isArray(value) || isPromise(value))) {
                objTarget[key] = objTarget[key] || {}; // eslint-disable-line no-param-reassign
                deepReplace(objTarget[key], value);
            }
            else {
                if (Array.isArray(value)) {
                    value = value.slice();
                }
                objTarget[key] = value; // eslint-disable-line no-param-reassign
            }
        }
    }
    return objTarget;
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
    for (name in obj) { // eslint-disable-line guard-for-in
        return false;
    }

    return true;
}

function isFuncNotObsArray(obj) {
    return isFunction(obj) && !ko.isObservable(obj);
}

function isFunction(obj) {
    return typeof obj === 'function';
}


function promisify(value) {
    if (!isPromise(value)) {
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
    return obj && typeof obj === 'object' && typeof obj.then === 'function';
}

// Recursively walks through objects, invoking the supplied predicate whenever
// the condition function returns true
//
// condition/predicate signature: (value, key, obj)
function walkObject(obj, condition, predicate) {
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        var value = obj[key];
        if (condition(value, key, obj)) {
            predicate(value, key, obj);
        }
        if (typeof value === 'object' && !Array.isArray(value)) {
            walkObject(value, condition, predicate);
        }
    }
}

/**
 * This is a standin for lodash _.first(_.filter(array, obj))
 */
function findFirst(array, obj) {
    for (var i = 0; i < array.length; i++) {
        var found = true;
        for (var key in obj) {
            if (array[i][key] !== obj[key]) {
                found = false;
                break;
            }
        }
        if (found) {
            return array[i];
        }
    }
    return undefined;
}

function arrayify(input) {
    return Array.isArray(input) ? input : [input];
}

function isTruthy(obj) {
    return !!obj;
}

function unique(array) {
    var temp = {};
    var result = [];
    array.forEach(function (value) {
        if (!temp[value]) {
            temp[value] = true;
            result.push(value);
        }
    });
    return result;
}

function objectKeys(obj) {
    return objectKeyValuePairs(obj).map(function (prop) {
        return prop.key;
    });
}
function objectValues(obj) {
    return objectKeyValuePairs(obj).map(function (prop) {
        return prop.value;
    });
}

function objectKeyValuePairs(obj) {
    var result = [];
    for (var key in obj) { // eslint-disable-line guard-for-in
        result.push({ key: key, value: obj[key] });
    }
    return result;
}


/************************/
/**     KO EXTENDERS   **/
/************************/
ko.extenders.nssgSingleSelect = function (target, option) {
    // Before change clears the array before the new value is set
    target.subscribe(function (oldVal) {
        if (oldVal && oldVal.length) {
            oldVal.length = 0; // eslint-disable-line no-param-reassign
        }
    }, null, 'beforeChange');

    target.subscribe(function (newVal) {
        if (newVal && newVal.length > 1) {
            newVal.splice(0, newVal.length - 1);
        }
    });
};

function throttle(options) {
    if (typeof options !== 'object' || !options) {
        throw new Error('throttle expects a configuration object');
    }
    var invoke = options.callback;
    var frequency = options.frequency;
    var leading = options.leading;
    var trailing = options.trailing;
    var invokeTimer = null;

    if (typeof invoke !== 'function') {
        throw new Error('callback must be a function');
    }
    if (typeof frequency !== 'number' || frequency <= 0) {
        throw new Error('frequency must be a number greater than 0');
    }
    if (!leading && !trailing) {
        leading = true;
        trailing = true;
    }

    function doLeading() {
        if (leading) {
            invoke();
        }
    }
    function doTrailing() {
        invokeTimer = null;
        if (trailing) {
            invoke();
        }
    }

    function requestInvoke() {
        if (invokeTimer) {
            return;
        }
        doLeading();
        invokeTimer = setTimeout(doTrailing, frequency);
    }
    function dispose() {
        options = null;
        invoke = null;
        if (invokeTimer) {
            clearTimeout(invokeTimer);
        }
    }
    requestInvoke.dispose = dispose;
    return requestInvoke;
}
