var gulp = require('gulp'),
    p = require('../package.json'),
    del = require('del'),
    rename = require("gulp-rename"),
    browserSync = require('browser-sync').create();

gulp.task('css', function (cb) {
    var sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer');

    // Remove built css file
    del.sync('build/*.css');

    // Compile CSS
    return gulp.src('src/scss/**/*.scss')
        .pipe( sass({ outputStyle: 'compressed' }).on('error', sass.logError) ) // Compile SASS to CSS
        .pipe( autoprefixer() ) // Autoprefix the CSS
        .pipe( rename(p.name + '.css') ) // Rename to package name
        .pipe( gulp.dest('build') ) // Put in build folder
        .pipe( browserSync.stream() );
});