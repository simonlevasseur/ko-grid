ko.components.register('grid-paging', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            return params.vm;
        }
    },
    template: templates.paging
});
