/* eslint no-unused-vars :0 */
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

    function AddInitialProcesses(gridState) {
        //= include "processes/check-paging-valid.js"
        //= include "processes/check-columns-valid.js"
        //= include "processes/check-data-valid.js"
        //= include "processes/filter.js"
        //= include "processes/last-updated.js"
        //= include "processes/paging.js"
        //= include "processes/redistribute-space.js"
        //= include "processes/sort.js"
        //= include "processes/sort-indicators.js"
        //= include "processes/row-selection.js"
        //= include "processes/index-columns-by-id.js"
        //= include "processes/update-bindings-columns.js"
        //= include "processes/update-bindings-data.js"
        //= include "processes/update-bindings-paging.js"
        //= include "processes/update-bindings-ui.js"
        //= include "processes/filter-change-resets-currentpage.js"
        //= include "processes/pagesize-change-resets-currentpage.js"
        //= include "processes/sort-change-resets-currentpage.js"
        //= include "processes/ui-enable-selection-column.js"
        //= include "processes/calculate-row-identities.js"
    }
    //= include "model/model.js"

    //= include "classes/Grid.js"

    //= include "classes/Pager.js"

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
    //= include "bindings/nssg-container-size.js"

    ko.Grid = Grid; // eslint-disable-line no-undef, no-param-reassign
    ko.Grid.customize = gridCustomizer; // eslint-disable-line no-undef, no-param-reassign
}));
