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
    'use strict';

    //= include "other/symbolPolyfill.js"

    //= include "classes/internalReferences.js"

    /*********************/
    /**     TEMPLATES   **/
    /*********************/
    //= include templates

    //= include "other/utils.js"

    //= include "other/defaults.js"

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
}));
