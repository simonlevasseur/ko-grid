ko.components.register('grid-paging', {
    viewModel: {
        createViewModel: function (params) {
            return params.vm;
        }
    },
    template: templates.paging
});
