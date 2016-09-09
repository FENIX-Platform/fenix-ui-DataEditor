define([
        'jquery',
        '../../../../nls/labels',
        './RowEditor_base',
        'bootstrap'
],
function ($, mlRes, rowEditorBase) {
    var defConfig = {
        elemCode: '<select class="%class%"></select>',
        elemClass: "form-control",
        optionCode: '<span class="cl_lev%lev%">%label%</span>',
        emptyEntryValue: "-",
        emptyEntryLabel: "-"
    };

    var RowEditor_code = function (config) {
        this.parent.constructor.call(this, config);
        $.extend(true, this.config, defConfig);
        this.codelists;
        this.$ddl;
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
        var e = defConfig.elemCode.replace('%class%', defConfig.elemClass);
        this.$ddl = $(e);
        //Err?
        if (!this.codelists || !this.codelists[0] || !this.codelists[0].data)
            return;
        var toApp = $('<option></option>');
        toApp.val(this.config.emptyEntryValue);
        toApp.html(this.config.emptyEntryLabel);
        this.$ddl.append(toApp);

        for (var i = 0; i < this.codelists[0].data.length; i++) {
            toApp = $('<option></option>').val(this.codelists[0].data[i].code);
            toApp.html(_getTitle(this.codelists[0].metadata.levels, this.codelists[0].data[i].level, this.codelists[0].data[i].title));
            this.$ddl.append(toApp);
        }
        this.$cnt.append(this.$ddl);
        this._bindEvents();
    };

    function _getTitle(levels, level, label) {
        if (levels == 0)
            return title;
        var toRet = defConfig.optionCode;
        toRet = toRet.replace('%lev%', level);
        var blanks = "";
        switch (level) {
            case 2:
                blanks = "&nbsp;";
                break;
            case 3:
                blanks = "&nbsp;&nbsp;";
                break;
            case 4:
                blanks = "&nbsp;&nbsp;&nbsp;";
                break;
            default:
                blanks = "&nbsp;&nbsp;&nbsp;&nbsp;";
                break;
        }
        return toRet.replace('%label%', blanks + "" + label);
    };

    RowEditor_code.prototype._bindEvents = function () {
        var me = this;
        this.$cnt.on('select', function () { me.updateValidationHelp(); });
    };
    RowEditor_code.prototype._unbindEvents = function () {
        this.$cnt.off('select');
    };

    RowEditor_code.prototype.destroy = function () {
        this._unbindEvents();
        //Is this needed???//this.$cnt.html('');
        //this.$cnt.jqxComboBox('destroy');
    }
    RowEditor_code.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }
    RowEditor_code.prototype.reset = function () {
        this.$ddl.val(this.config.emptyEntryValue);
        //this.$cnt.jqxComboBox('selectIndex', 0)
        //this.$cnt.popover('destroy');
    }
    RowEditor_code.prototype.setValue = function (val) {
        this.reset();
        this.$ddl.val(val);
        this.updateValidationHelp();
    }
    RowEditor_code.prototype.getValue = function () {
        var toRet = this.$ddl.val();
        if (toRet == this.config.emptyEntryValue)
            return '';
        return toRet;
    }
    /*RowEditor_code.prototype.getSelectedItem = function () {
         //var item = this.$cnt.jqxComboBox('getSelectedItem');
         //if (!item)
         //    return null;
         //return item;
    }*/
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


/*
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
                if (me.codelists[0].data[index]) {
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
});*/