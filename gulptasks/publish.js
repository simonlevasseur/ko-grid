var gulp = require('gulp');

gulp.task('publish', ['js'/*, 'eslint','test'*/], function(){
    return gulp.src('build/not-so-simple-grid.js')
        .pipe(gulp.dest('dist'));
});
