define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, jqx, mlRes, rowEditorBase) {
    var defConfig = {};
    var emptyEntryValue = "-";
    var emptyEntryLabel = "-";

    var RowEditor_code = function (config) {
        this.parent.constructor.call(this, config);
        this.codelists;
    }
    RowEditor_code.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_code.prototype.constructor = RowEditor_code;
    RowEditor_code.prototype.parent = rowEditorBase.prototype;

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
        this.$cnt.on('select', function () { me.updateValidationHelp(); });
    }
    RowEditor_code.prototype.destroy = function () {
        this.$cnt.jqxComboBox('destroy');
        this.$cnt.off('select');
    }
    RowEditor_code.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }
    RowEditor_code.prototype.reset = function () {
        this.$cnt.jqxComboBox('selectIndex', 0)
        this.$cnt.popover('destroy');
    }
    RowEditor_code.prototype.setValue = function (val) {
        this.reset();
        if (!val)
            val = emptyEntryValue;
        var items = this.$cnt.jqxComboBox('getItems');
        for (var i = 0; i < items.length; i++)
            if (items[i].value == val) {
                this.$cnt.jqxComboBox('selectIndex', i);
            }
        this.updateValidationHelp();
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
    RowEditor_code.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val)
            return this.ERROR_NULL;
        return null;
    }
    RowEditor_code.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_code;
});