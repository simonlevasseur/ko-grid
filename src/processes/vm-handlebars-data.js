/* eslint no-unused-vars: 0 */

var selectedObservables = {};

/******************************/
/** vm-Handlebars: data **/
/******************************/
gridState.processors['vm-handlebars-data'] = {
    watches: ['data', 'selection'],
    init: function (model) {
        if (!model.vm.data){
            model.vm.data = ko.observableArray();
            model.vm.data.loaded = ko.observable(false);
            model.ui.hb_tbody = ko.observable('');
        }
    },
    runs: function (options) {
        options.cache.templates = options.cache.templates || {};
        
        if (options.model.logging) {
            console.log('Updating the handlebar data template');
        }
        
        if (!options.cache.namespace){
            options.cache.namespace="NSSG_"+ Math.floor(Math.random()*99999);
            options.cache.jsContext = {};
            window[options.cache.namespace] = options.cache.jsContext;
        }
        
        options.cache.jsContext.toggleSelect = function(rowIdentity, isSelected) {
            console.log("Setting "+ rowIdentity+" to "+(!isSelected?"selected":"deselected"));
            var rowSelect = {};
            rowSelect[rowIdentity]= !isSelected;
            setTimeout(function(){
                options.model.vm.process({"selection":rowSelect});
            },1);
        }
        
        var templateParts = [];
        templateParts.push("{{#each data as |row key|}}");
        templateParts.push("<tr>");
        templateParts=templateParts.concat(options.model.columns.map(function(col){
            if (!col.isVisible){
                return;
            }
            return "<td class='nssg-td nssg-td-"+col.type+"'>"+templates[col.type + "_hb"].replace(/\{\{value\}\}/g, "{{"+col.id+"}}")+"</td>";
        }));
        templateParts.push("</tr>");
        templateParts.push("{{/each}}");
        var template = templateParts.join("\n");
        var compiledTemplate = options.cache.templates[template];
        if (!compiledTemplate){
            compiledTemplate = Handlebars.compile(template);
            options.cache.templates[template] = compiledTemplate;
        }
        var context= {
            jsContext: options.cache.namespace,
            data: options.model.data
        }
        
        var timeA = performance.now();
        var compiledHtml = compiledTemplate(context);
        var timeB = performance.now();
        options.model.ui.hb_tbody(compiledHtml);
        var timeC = performance.now();
        
        console.log("Render template", (timeB - timeA));
        console.log("Update Binding", (timeC - timeB));
        
        if (options.changed.data) {
            options.model.vm.data.loaded(true);
        }
    }
};