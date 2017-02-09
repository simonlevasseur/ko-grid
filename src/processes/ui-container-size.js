/* eslint no-unused-vars: 0 */

/***********************/
/** UI Container Size **/
/***********************/
gridState.processors['ui-container-size'] = {
    init: function (model) {
        model.vm.size = ko.observable();

        ko.computed(function () {
            var size = model.vm.size();
            if (size) {
                model.vm.process({ space: size });
            }
        });
    },
    runs: function () {
        // noop
    }
};
