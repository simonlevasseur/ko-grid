var gulp = require('gulp'),
    rename = require("gulp-rename"),
    browserSync = require('browser-sync').create();

gulp.task('img', function (cb) {
    // Compile CSS
    return gulp.src('src/img/**/*.*')
        //.pipe( rename({dirname: ''}))
        .pipe( gulp.dest('build/img') ) // Put in build folder
        .pipe( browserSync.stream() );
});