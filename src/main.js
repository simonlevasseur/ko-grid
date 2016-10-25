function __nssgGetGlobal()
{
    var globalRef;

    (function(){globalRef=this;})();
    if (!globalRef)
    {
        try{globalRef = window;}catch(ignored){}
        try{globalRef = global;}catch(ignored){}
    }
    return globalRef || {};
}

/* istanbul ignore next */
;(function (factory) {
    'use strict';

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("ko"), require("jquery"), exports);
    } else if (typeof define === "function" && define.amd) {
        define(["ko", "jquery", "exports"], factory);
    } else {
        factory(ko, $);
    }
}(function (ko, $, exports) {
    'use strict';
    
    var globalRef = __nssgGetGlobal();

    /*********************/
    /***** TEMPLATES *****/
    /*********************/
    //= include templates

    //= include "other/promise.js"
    
    //= include "other/utils.js"

    //= include "other/defaults.js"

    //= include "classes/Grid.js"

    //= include "classes/Pager.js"

    //= include "classes/Sorter.js"
    
    /**********************/
    /***** COMPONENTS *****/
    /**********************/
    //= include "components/grid.js"
    //= include "components/paging.js"

    /********************/
    /***** BINDINGS *****/
    /********************/
    //= include "bindings/nssg-thead-tr.js"
    //= include "bindings/nssg-th.js"
    //= include "bindings/nssg-td.js"
    //= include "bindings/nssg-tbody.js"
    //= include "bindings/nssg-tbody-tr.js"

    ko.Grid = Grid;
    ko.Grid.Sorter = Sorter;
    ko.Grid.Pager = Pager;
}));
