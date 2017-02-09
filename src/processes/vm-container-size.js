/* eslint no-unused-vars: 0 */

/***********************/
/** vm Container Size **/
/***********************/
gridState.processors['vm-container-size'] = {
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
