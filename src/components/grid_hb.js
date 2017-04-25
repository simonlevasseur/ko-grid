ko.components.register('newgrid-hb', {
    viewModel: {
        createViewModel: function (params) {
            params.vm().process({processors:{vm:"use-handlebars"}});
            return params.vm;
        }
    },
    template: templates.grid_hb
});
