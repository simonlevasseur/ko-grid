// Karma configuration
// Generated on Wed Jun 03 2015 11:26:36 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // Dependencies
            'ext/knockout-3.3.0.min.js',
            'ext/jquery-2.1.0.min.js',

            // Source
            'src/other/utils.js',
            'src/classes/Pager.js',
            'src/classes/Sorter.js',

            // Stubs
            'test/unit/stubs/data.js',
            'test/unit/stubs/mockGrid.js',

            // Specs
            'test/unit/specs/pagerSpec.js',
            // 'test/unit/specs/sorterSpec.js',
            'test/unit/specs/utilsSpec.js'
            // 'test/unit/specs/**/*Spec.js'
        ],


        preprocessors: {
            'src/classes/Sorter.js': ['coverage'],
            'src/classes/Pager.js': ['coverage'],
            'src/other/utils.js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
