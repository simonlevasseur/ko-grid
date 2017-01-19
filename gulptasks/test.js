var gulp = require('gulp');
    
gulp.task('test', function(cb) {
    var karma = require('karma').server;

    karma.start({
        configFile: __dirname + '/../test/karma.conf.js'
    }, function () {
        cb();
    });
});