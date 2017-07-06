ko.components.register('newgrid-ko', {
    viewModel: {
        createViewModel: function (params) {
            var vm = typeof params.vm === "function" ? params.vm() : params.vm;
            vm.process({processors:{vm:"use-knockout"}});
            return params.vm;
        }
    },
    template: templates.grid
});
