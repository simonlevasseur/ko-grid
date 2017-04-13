window.doRegisterPaging = function () {
    ko.components.register('newgrid-paging', {
        viewModel: {
            createViewModel: function (params) {
                return params.vm;
            }
        },
        template: templates.paging
    });

    window.doRegisterPaging = function () {};
};

var abc = 123;
