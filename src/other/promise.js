/****************************/
/***** PROMISE POLYFILL *****/
/****************************/

//Uses native Promise if able, otherwise use a quick polyfill based on JQuery
var Promise = globalRef.Promise || PromisePolyFill;
function PromisePolyFill(cb)
{
    if (!isFunction(cb))
    {
        throw new Error("Promise requires the first argument be a function");
    }
    var jqDeferred = $.Deferred();
    cb(jqDeferred.resolve, jqDeferred.reject);
    return jqDeferred.promise();
}
PromisePolyFill.resolve = function(value)
{
    return new Promise(function(resolve, reject){resolve(value);});
}
PromisePolyFill.reject = function(reason)
{
    return new Promise(function(resolve, reject){reject(reason);});
}
PromisePolyFill.all = function(promises)
{
    return new Promise(function(resolve, reject)
    {
       var result = [];
       var count = promises.length;
       var decAndCheck = function()
       {
           count--;
           if (count === 0)
           {
               resolve(result);
           }
       }
       promises.forEach(function(p, i)
       {
          p.then(function(value){
              result[i] = value;
              decAndCheck();
          }, reject);
       });
    });
}
PromisePolyFill.race = function(promises)
{
    return new Promise(function(resolve, reject)
    {
       promises.forEach(function(p)
       {
          p.then(resolve, reject);
       });
    });
}
PromisePolyFill.prototype.catch = function(onError)
{
    return this.then(null, onerror);
}