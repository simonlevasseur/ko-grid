ko.components.register('newgrid-ko', {
    viewModel: {
        createViewModel: function (params) {
            params.vm().process({processors:{vm:"use-knockout"}});
            return params.vm;
        }
    },
    template: templates.grid
});
