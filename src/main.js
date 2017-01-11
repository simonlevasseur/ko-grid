/* istanbul ignore next */
(function (factory) {
    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        factory(require('ko'), require('jquery'), require('processing-pipeline'), exports);  // eslint-disable-line global-require
    }
    else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
        define(['ko', 'jquery', 'processing-pipeline', 'exports'], factory); // eslint-disable-line no-undef
    }
    else {
        factory(ko, $, PipelineFactory); // eslint-disable-line no-undef
    }
}(function (ko, $, PipelineFactory) {
 // eslint-disable-line no-unused-vars

    'use strict';

    var pipeline = PipelineFactory.create();

    //= include "other/symbolPolyfill.js"

    //= include "classes/internalReferences.js"

    /*********************/
    /**     TEMPLATES   **/
    /*********************/
    //= include templates

    //= include "other/utils.js"

    //= include "other/defaults.js"

    //= include "model/model.js"

    //= include "processes/check-paging-valid.js"
    //= include "processes/filter.js"
    //= include "processes/last-updated.js"
    //= include "processes/paging.js"
    //= include "processes/redistribute-space.js"
    //= include "processes/sort.js"
    //= include "processes/update-bindings-columns.js"
    //= include "processes/update-bindings-data.js"
    //= include "processes/update-bindings-paging.js"

    //= include "classes/Grid.js"

    //= include "classes/Pager.js"

    //= include "classes/Sorter.js"

    //= include "classes/gridCustomizer.js"

    /**********************/
    /**     COMPONENTS   **/
    /**********************/
    //= include "components/grid.js"
    //= include "components/paging.js"

    /********************/
    /**     BINDINGS   **/
    /********************/
    //= include "bindings/nssg-thead-tr.js"
    //= include "bindings/nssg-th.js"
    //= include "bindings/nssg-td.js"
    //= include "bindings/nssg-tbody.js"
    //= include "bindings/nssg-tbody-tr.js"

    ko.Grid = Grid; // eslint-disable-line no-undef, no-param-reassign
    ko.Grid.Sorter = Sorter; // eslint-disable-line no-undef, no-param-reassign
    ko.Grid.Pager = Pager; // eslint-disable-line no-undef, no-param-reassign
    ko.Grid.customize = gridCustomizer; // eslint-disable-line no-undef, no-param-reassign

    var theCurrentData;

    gridState.processors['fetch-data'] = function (options) {
        options.model.data = theCurrentData;
    };

    function delay(cb, ms) {
        return function () {
            setTimeout(cb, ms);
        };
    }

    function pass1() {
        console.log('Pass #1');
        console.log('Initial State');
        theCurrentData = [1, 2, 3];
        pipeline.process(gridState, 'start').then(delay(pass2, 5000));
    }
    function pass2() {
        console.log('Pass #2');
        console.log('Nothing has changed');
        pipeline.process(gridState, 'start').then(delay(pass3, 5000));
    }
    function pass3() {
        console.log('Pass #3');
        console.log('Changing the data');
        theCurrentData.push(4);
        pipeline.process(gridState, 'start');
    }

    pass1();
}));
