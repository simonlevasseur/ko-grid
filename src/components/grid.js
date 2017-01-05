ko.components.register('grid', {
    viewModel: {
        createViewModel: function (params) {
            return params.vm;
        }
    },
    template: templates.grid
});
