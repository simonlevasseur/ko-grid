var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

gulp.task('watch', ['css', 'js'], function (done) {
    browserSync.init({ server: './', directory: true }, function () {
        gulp.watch(['src/**/*.js', 'src/**/*.html'], [/*'test', */'js']);
        gulp.watch(['src/scss/**/*.scss'], ['css']);
        gulp.watch(['build/*.js', 'examples/*'], browserSync.reload);
        done();
    });
});
