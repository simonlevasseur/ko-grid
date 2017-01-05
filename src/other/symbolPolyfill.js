/*********************/
/** SYMBOL POLYFILL **/
/*********************/

var symbolDetection;

try {
    symbolDetection = Symbol('foo');
}
catch (ignored) {} // eslint-disable-line no-empty

if (!symbolDetection) {
    Symbol = function (name) {
        return '' + name + Math.floor(Math.random() * 99999);
    };
}
