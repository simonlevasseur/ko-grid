module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dev: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            hmtl: {
                files: ['examples/*.html']
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['compass:dev']
            }
        }
    });

    grunt.registerTask('default', 'watch');
};