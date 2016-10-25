var gulp = require('gulp'),
    p = require('./package.json'),
    spawn = require('child_process').spawn,
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

gulp.task('js', [/*'jscs', 'lint'*/], function (cb) {
    // Plugins
    var minifyHTML = require('gulp-minify-html'),
        html2js = require('gulp-html-compile'),
        concat = require('gulp-concat'),
        insert = require('gulp-insert'),
        include = require('gulp-include'),
        replace = require('gulp-replace'),
        tap = require('gulp-tap'),
        uglify = require('gulp-uglify');

    // Variables
    var tpl = '';
    html2js.config = {
        namespace: 'templates',
        name: function(file) {
            var relativeName = file.relative;
            relativeName = relativeName.replace(/\\/g, "/");
            
            // Template names should match file names without extensions
            var filepath = relativeName.split('.')[0], 
                parts = filepath.split('/'),
                name = parts[parts.length - 1];

            return name;
        }
    };

    // Remove built js file
    del.sync('build/*.js');

    // Compile HTML to JS
    gulp.src('src/templates/**/*.html')
        .pipe( minifyHTML({ comments: true }) ) // Minify HTML files to 1-liners
        .pipe( html2js(html2js.config) ) // Convert HTML to JS
        .pipe( concat('myTemplates.js') ) // Concatenate all JS templates into one file
        .pipe( insert.prepend('var templates = {};\n') ) // Add a variable declaration to the top
        .pipe( tap(function (file) { tpl = file.contents.toString(); }) ) // Save the file contents to a variable
        .on('end', function () {
            // Build and Minify JS
            gulp.src('src/main.js')
                .pipe( replace(/\/\/= include templates/, tpl) ) // Replace "//= include templates" with templates
                .pipe( include() ) // Include all source files into main.js file
                // .pipe( uglify() ) // Minify final JS file
                .pipe( rename(p.name + '.js') ) // Rename to package name
                .pipe( gulp.dest( 'build') ) // Put in build folder
                .on('end', function () { cb(); }); // Notify the task is complete
        });
});

gulp.task('jscs', function() {
    var jscs = require('gulp-jscs');

    return gulp.src('src/**/*.js')
        .pipe( jscs() );
});

gulp.task('lint', function() {
    var jshint = require('gulp-jshint');

    return gulp.src('src/**/*.js')
        .pipe( jshint() )
        .pipe( jshint.reporter('jshint-stylish') )
        .pipe( jshint.reporter('fail') );
});

gulp.task('test', function(cb) {
    var karma = require('karma').server;

    karma.start({
        configFile: __dirname + '/test/karma.conf.js'
    }, function () {
        cb();
    });
});

gulp.task('watch', ['css', 'js'], function (done) {
    browserSync.init({ server: './', directory: true }, function () {
        gulp.watch(['src/**/*.js', 'src/**/*.html'], ['test', 'js']);
        gulp.watch(['src/scss/**/*.scss'], ['css']);
        gulp.watch(['build/*.js', 'examples/*'], browserSync.reload);
        done();
    });
});

gulp.task('default', ['watch']);