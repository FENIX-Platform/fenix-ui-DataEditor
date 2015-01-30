﻿define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'bootstrap'
],
function ($, jqx, mlRes) {
    var defConfig = { decimalDigits: 5 };
    var ERROR_NAN = "NAN";
    var ERROR_NULL = "Null";

    var RowEditor_number = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;
        this.mandatory = false;
    };

    RowEditor_number.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        this.$cnt.jqxNumberInput({ spinButtons: false, promptChar: '_', decimalDigits: this.config.decimalDigits, groupSeparator: '' });

        var me = this;
        this.$cnt.on('valueChanged', function () { me.updateValidationHelp(); });
    }
    RowEditor_number.prototype.updateValidationHelp = function () {
        var error = this.validate();
        if (error == null) {
            this.$cnt.popover('destroy');
        }
        else {
            var errMSG = mlRes[error];
            this.$cnt.popover({ container: this.$cnt, content: errMSG, html: true });
            this.$cnt.popover('show');
        }
    }
    RowEditor_number.prototype.reset = function () {
        this.$cnt.jqxNumberInput('val', '');
        this.$cnt.popover('destroy');
    }
    RowEditor_number.prototype.setValue = function (val) {
        this.reset();
        if (val)
            this.$cnt.jqxNumberInput('val', val);
    }
    RowEditor_number.prototype.getValue = function () {
        return parseFloat(this.$cnt.jqxNumberInput('val'));
    }
    RowEditor_number.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    RowEditor_number.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val == '')
            return ERROR_NULL;
        if (isNaN(val))
            return ERROR_NAN;
        return null;
    }
    RowEditor_number.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_number;
});