/* eslint no-unused-vars :0 */
/* istanbul ignore next */
(function (factory) {
    'use strict';

    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        factory(require('ko'), require('jquery'), require('processing-pipeline'), // eslint-disable-line global-require
        require('handlebars'), exports);  // eslint-disable-line global-require
    }
    else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
        define(['ko', 'jquery', 'processing-pipeline', 'handlebars', 'exports'], factory); // eslint-disable-line no-undef
    }
    else {
        factory(ko, $, PipelineFactory, Handlebars); // eslint-disable-line no-undef
    }
}(function (ko, $, PipelineFactory, Handlebars) {
    'use strict';

    //= include "other/symbolPolyfill.js"

    /*********************/
    /**     TEMPLATES   **/
    /*********************/
    //= include templates

    //= include "other/utils.js"

    //= include "other/defaults.js"

    function AddInitialProcesses(gridState) {
        //= include "processes/columns-check-valid.js"
        //= include "processes/columns-changed-reset-width.js"
        //= include "processes/columns-enable-actions-column.js"
        //= include "processes/columns-enable-selection-column.js"
        //= include "processes/columns-index-by-id.js"
        //= include "processes/columns-redistribute-space.js"
        //= include "processes/columns-sort-indicators.js"
        //= include "processes/filter-check-valid.js"
        //= include "processes/data-calculate-row-identities.js"
        //= include "processes/data-check-valid.js"
        //= include "processes/data-fetch-cell-values.js"
        //= include "processes/data-aggregate-values.js"
        //= include "processes/data-to-lowercase.js"
        //= include "processes/data-filter.js"
        //= include "processes/data-paging.js"
        //= include "processes/data-row-selection.js"
        //= include "processes/data-sort.js"
        //= include "processes/fetch-data-init.js"
        //= include "processes/log-done.js"
        //= include "processes/log-start.js"
        //= include "processes/paging-check-valid.js"
        //= include "processes/paging-filter-change-resets-currentpage.js"
        //= include "processes/paging-pagesize-change-resets-currentpage.js"
        //= include "processes/paging-sort-change-resets-currentpage.js"
        //= include "processes/selection-disable-multi-page.js"
        //= include "processes/selection-select-all.js"
        //= include "processes/selection-select-single.js"
        //= include "processes/time-last-updated.js"
        //= include "processes/ui-export-selected-rows.js"
        //= include "processes/ui-selected-all-indicator.js"
        //= include "processes/ui-selected-count.js"
        //= include "processes/vm-container-size.js"
        //= include "processes/vm-handlebars-data.js"
        //= include "processes/vm-update-bindings-columns.js"
        //= include "processes/vm-update-bindings-data.js"
        //= include "processes/vm-update-bindings-grid-state.js"
        //= include "processes/vm-update-bindings-paging.js"
        //= include "processes/vm-update-bindings-ui.js"


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

    ko.NewGrid = Grid; // eslint-disable-line no-undef, no-param-reassign
    ko.NewGrid.customize = gridCustomizer; // eslint-disable-line no-undef, no-param-reassign
}));
