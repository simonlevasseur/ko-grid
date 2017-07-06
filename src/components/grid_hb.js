ko.components.register('newgrid-hb', {
    viewModel: {
        createViewModel: function (params) {
            var vm = typeof params.vm === "function" ? params.vm() : params.vm;
            vm.process({processors:{vm:"use-handlebars"}});
            return params.vm;
        }
    },
    template: templates.grid_hb
});
