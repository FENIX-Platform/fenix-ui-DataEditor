if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([
        'jquery',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, mlRes, rowEditorBase) {
    var defConfig = {
        decimalDigits: 5,
        html: '<input type="input" class="form-control">'
    };

    var RowEditor_number = function (config) {
        this.parent.constructor.call(this, config);
        $.extend(true, this.config, defConfig);
        this.$cnt;
        this.$txt;
    };
    RowEditor_number.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_number.prototype.constructor = RowEditor_number;
    RowEditor_number.prototype.parent = rowEditorBase.prototype;

    RowEditor_number.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        this.$cnt.html(this.config.html);
        this.$txt = this.$cnt.find('input');
        var me = this;
        this.$cnt.on('valueChanged', function () { me.updateValidationHelp(); });
    }
    RowEditor_number.prototype.destroy = function () {
        this.$cnt.off('valueChanged');
    }
    RowEditor_number.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }
    RowEditor_number.prototype.reset = function () {
        this.$txt.val('');
        this.$cnt.popover('destroy');
    }
    RowEditor_number.prototype.setValue = function (val) {
        this.reset();
        this.$txt.val(val);
    }
    RowEditor_number.prototype.getValue = function () {
        var toRet = this.$txt.val().trim();
        return toRet;
    }
    RowEditor_number.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    RowEditor_number.prototype.validate = function () {
        var val = this.getValue();
        if (val != '') {
            if (isNaN(val))
                return this.ERROR_NAN;
        }
        else {
            if (this.mandatory)
                return this.ERROR_NULL;
        }
        return null;
    }
    RowEditor_number.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_number;
});