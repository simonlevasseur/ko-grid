/* eslint no-unused-vars: 0 */

/***********************/
/** vm Container Size **/
/***********************/
gridState.processors['vm-container-size'] = {
    init: function (model) {
        model.vm.size = ko.observable();

        ko.computed(function () {
            var previous = model.space ? model.space.width : undefined;
            
            var size = model.vm.size();
            if (size && size.width !== previous) {
                model.vm.process({ space: size });
            }
        });
    },
    runs: function () {
        // noop
    }
};
