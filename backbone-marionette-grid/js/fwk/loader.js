/**
 * suppose require.js has loaded
 */
define(['jquery'], function() {

    Loader = {

    };

    Loader.deferRquire = function(deps, callback, errback, optional) {

        var deferred = $.Deferred();
        var promised = deferred.promise();

        //original args of require: (deps, callback, errback, optional)
        require(deps, function() {
            var args = arguments;
            deferred.resolve.apply(deferred, args);
        }, function() {
            var args = arguments;
            deferred.reject.apply(deferred, args);
        }, optional);

        return deferred.promise();
    };


    return Loader;

});