'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');

function lint(dir)
{
    return gulp.src(dir + '/**/*.js')
    .pipe(eslint({fix:true}))
    // eslint.format() outputs the lint results to the console.
    .pipe(eslint.format())
    .pipe(gulp.dest(dir));
}

gulp.task('eslint-src', function(){
    return lint('./src');
});

gulp.task('eslint-test', function(){
    return lint('./test');
});

gulp.task('eslint', function(done){
  runSequence('eslint-test', 'eslint-src', done);
});
