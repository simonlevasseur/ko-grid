var gulp = require('gulp'),
    p = require('../package.json'),
    del = require('del'),
    rename = require("gulp-rename");

gulp.task('js', function (cb) {
    // Plugins
    var minifyHTML = require('gulp-minify-html'),
        html2js = require('gulp-html-compile'),
        concat = require('gulp-concat'),
        insert = require('gulp-insert'),
        include = require('gulp-include'),
        replace = require('gulp-replace'),
        tap = require('gulp-tap');

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