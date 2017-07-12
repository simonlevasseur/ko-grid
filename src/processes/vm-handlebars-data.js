/* eslint no-unused-vars: 0 */

var selectedObservables = {};

/******************************/
/** vm-Handlebars: data **/
/******************************/
gridState.processors['vm-handlebars-data'] = {
    watches: ['data', 'selection', 'ui', 'columns', 'space'],
    init: function (model) {
        if (!model.vm.data) {
            model.vm.data = ko.observableArray();
            model.vm.data.loaded = ko.observable(false);
            model.vm.hb_tbody = ko.observable('');
        }
    },
    runs: function (options) {
        if (!options.model.space || !options.model.space.width) {
            return;
        }
        options.cache.templates = options.cache.templates || {};

        if (options.model.logging) {
            console.log('Updating the grid content using Handlebar templates');
        }

        if (!options.cache.namespace) {
            options.cache.namespace = 'NSSG_' + Math.floor(Math.random() * 99999);
            options.cache.jsContext = {};
            window[options.cache.namespace] = options.cache.jsContext;
        }

        options.cache.jsContext.toggleSelect = function (rowIdentity, e) {
            var isSelected = !!options.model.selection[rowIdentity];
            // if (options.model.logging) {
                // console.log('Setting ' + rowIdentity + ' to ' + (!isSelected ? 'selected' : 'deselected'));
            // }

            var rowSelect = {};
            rowSelect[rowIdentity] = !isSelected;
            setTimeout(function () {
                options.model.vm.process({ selection: rowSelect, ui: { alreadyUpdatedSelection: true } });
                if (e) {
                    $('input', $(e).parent()).prop('checked', !isSelected);
                }
            }, 1);
            if (options.model.ui.selectMode === 'single') {
                for (var key in options.model.selection) {
                    if (options.model.selection.hasOwnProperty(key)) {
                        var id = options.cache.namespace + '_' + key;
                        var $row = $('#' + id);
                        var $select = $('.nssg-td-select input', $row);
                        $select.prop('checked', false);
                    }
                }
            }
        };

        options.cache.jsContext.invokeAction = function (rowIdentity, index) {
            var action = options.model.ui.actions[index];
            var row = findFirst(options.model.data, { $identity: rowIdentity });
            if (action && row) {
                if (action.onClick) {
                    action.onClick(row.raw);
                }
            }
            else {
                console.warn("action or row data couldn't be matched");
            }
        };

        var templateParts = [];
        templateParts.push('{{#each data as |row key|}}');
        templateParts.push("<tr class='nssg-tbody-tr' id='" + options.cache.namespace + "_{{$identity}}'>");
        templateParts = templateParts.concat(options.model.columns.map(function (col) {
            if (!col.isVisible) {
                return '';
            }
            if (templates[col.type + '_hb'] === undefined){
                console.error("Body Column type "+ col.type+" is not defined for handlebars, defaulting to text");
                col.type = "text";
            }
            return "<td class='nssg-td nssg-td-" + col.type + "'>" +
                templates[col.type + '_hb'].replace(/\{\{value/g, '{{' + col.id) +
                '</td>';
        }));
        templateParts.push("<td class='nssg-td nssg-td-gutter'></td>");
        templateParts.push('</tr>');
        templateParts.push('{{/each}}');
        var template = templateParts.join('\n');
        var compiledTemplate = options.cache.templates[template];
        if (!compiledTemplate) {
            compiledTemplate = Handlebars.compile(template);
            options.cache.templates[template] = compiledTemplate;
        }

        var actions = options.model.ui.actions ? options.model.ui.actions.map(function (action, index) {
            return { css: action.css, index: index };
        }) : [];
        var context = {
            jsContext: options.cache.namespace,
            data: options.model.data,
            actions: actions
        };

        if (!options.model.lastInput.ui || !options.model.lastInput.ui.alreadyUpdatedSelection) {
            var compiledHtml = compiledTemplate(context);
            options.model.runAfter.push({id:'vm-handlebars-data',fnRef:function(){
                options.model.vm.hb_tbody(compiledHtml);
            }});
        }
        else {
            console.log('skipping the update dom step since the dom should already be up to date');
        }

        if (!options.model.vm.data.loaded.peek()) {
            setTimeout(function () {
                options.model.vm.data.loaded(true);
            }, 100);
        }
    }
};
