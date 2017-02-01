ko.components.register('newgrid', {
    viewModel: {
        createViewModel: function (params) {
            return params.vm;
        }
    },
    template: templates.grid
});
