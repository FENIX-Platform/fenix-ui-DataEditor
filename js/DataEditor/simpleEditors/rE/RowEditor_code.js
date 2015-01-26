define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = {};
    var emptyEntryValue = "-";
    var emptyEntryLabel = "-";

    var RowEditor_code = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;

        this.codelists;
        this.mandatory = false;
    };

    RowEditor_code.prototype.render = function (container, config, codelists) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        this.codelists = codelists;
        this.createEditor();
    }

    RowEditor_code.prototype.createEditor = function () {
        //TODO make it handle multiple codelists
        var codesSrc = {
            localdata: this.codelists[0].data, datatype: 'array', datafields: [
                { name: 'code', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'level', type: 'string' }
            ]
        };
        var codesTextDataAdapter = new $.jqx.dataAdapter(codesSrc);

        var me = this;
        this.$cnt.jqxComboBox({
            source: codesTextDataAdapter,
            displayMember: 'title',
            valueMember: 'code',
            promptText: '',
            autoComplete: true,
            searchMode: 'containsignorecase',
            renderer: function (index, label, value) {
                if (me.codelists[0].metadata.levels == 1)
                    return label;
                switch (me.codelists[0].data[index].level) {
                    case 1:
                        return '<span class="cl_lev1">' + label + '</span>';
                        break;
                    case 2:
                        return '<span class="cl_lev2">&nbsp;' + label + '</span>';
                        break;
                    case 3:
                        return '<span class="cl_lev3">&nbsp;&nbsp;' + label + '</span>';
                        break;
                    case 4:
                        return '<span class="cl_lev4">&nbsp;&nbsp;&nbsp;' + label + '</span>';
                        break;
                    default:
                        return '<span class="cl_lev5">&nbsp;&nbsp;&nbsp;&nbsp;' + label + '</span>';
                        break;
                }
            }
        });

        this.$cnt.jqxComboBox('insertAt', { label: emptyEntryLabel, value: emptyEntryValue }, 0);

        this.$cnt.jqxValidator({
            rules: [
                {
                    message: '__not null!',
                    action: 'select',
                    input: this.$cnt,
                    rule: function (input) {
                        if (!me.$cnt)
                            return true;
                        if (!me.mandatory)
                            return;
                        val = me.$cnt.jqxComboBox('getSelectedItem').value;
                        if (val == emptyEntryValue)
                            return false;
                        return true;
                    }
                }]
        });
    }

    RowEditor_code.prototype.reset = function () {
        this.$cnt.jqxComboBox('clearSelection');
        this.$cnt.jqxValidator('hide');
    }
    RowEditor_code.prototype.setValue = function (val) {
        this.reset();
        if (!val)
            return;
        var items = this.$cnt.jqxComboBox('getItems');
        for (var i = 0; i < items.length; i++)
            if (items[i].value == val) {
                this.$cnt.jqxComboBox('selectIndex', i);
                return;
            }
    }
    RowEditor_code.prototype.getValue = function () {
        var item = this.$cnt.jqxComboBox('getSelectedItem');
        if (!item)
            return null;
        if (item.value == emptyEntryValue)
            return null;
        return item.value;
    }
    RowEditor_code.prototype.getSelectedItem = function () {
        var item = this.$cnt.jqxComboBox('getSelectedItem');
        if (!item)
            return null;
        return item;
    }
    RowEditor_code.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    return RowEditor_code;
});