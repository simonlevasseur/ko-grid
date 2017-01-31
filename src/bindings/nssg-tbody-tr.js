ko.bindingHandlers.newnssgTbodyTr = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var gridVM = ko.unwrap(bindingContext.$component);

        var colsWithGutter = ko.pureComputed(function(){
            var cols = ko.unwrap(gridVM.columns);
            var temp = cols.slice();
            temp.push({id:"$gutter",type:"gutter",isSortable:false, isResizable:false});
            return temp;
        });
        
        /************************/
        /**    DATA BINDING    **/
        /************************/
        ko.applyBindingsToNode(element, {
            foreach: {
                data: colsWithGutter,
                as: 'col'
            }
        }, bindingContext);

        return { controlsDescendantBindings: true };
    }
};
