ko.components.register('grid', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            return params.vm;
        }
    },
    template: templates.grid
});
