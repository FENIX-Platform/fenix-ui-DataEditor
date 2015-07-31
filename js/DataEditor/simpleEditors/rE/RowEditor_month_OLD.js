define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, jqx, mlRes, rowEditorBase) {
    var defConfig = { yMin: 0, yMax: 3000 };
    var separator = "-";
    //var months = ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    var RowEditor_month = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_month.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_month.prototype.constructor = RowEditor_month;
    RowEditor_month.prototype.parent = rowEditorBase.prototype;

    RowEditor_month.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var me = this;
        this.$cnt.jqxMaskedInput({ mask: '##' + separator + '####', width: 120 });
        this.$cnt.on('valuechanged', function () { me.updateValidationHelp(); });
    }
    RowEditor_month.prototype.destroy = function () {
        this.$cnt.jqxMaskedInput('destroy');
        this.$cnt.off('valuechanged');
    }
    RowEditor_month.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }
    RowEditor_month.prototype.reset = function () {
        this.$cnt.jqxMaskedInput('clear');
        this.$cnt.popover('destroy');
    }
    RowEditor_month.prototype.setValue = function (val) {
        this.reset();
        if (val) {
            var y = val.substring(0, 4) + "";
            var m = val.substring(4, 6) + "";
            this.$cnt.jqxMaskedInput('val', m + separator + y);
        }
    }
    RowEditor_month.prototype.getValue = function () {
        var val = this.$cnt.jqxMaskedInput('val');
        var m = val.substring(0, 2) + "";
        var y = val.substring(3, 7) + "";
        return y + m;
    }
    RowEditor_month.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    RowEditor_month.prototype.validate = function () {
        var val = this.$cnt.jqxMaskedInput('val');
        var promptChar = this.$cnt.jqxMaskedInput('promptChar');
        var m = val.substring(0, 2);
        var y = val.substring(3, 7);
        m = m.split(promptChar).join("");
        y = y.split(promptChar).join("");

        if (this.mandatory && (m == '' || y == ''))
            return this.ERROR_NULL;
        if (m == '' && y == '') {
            return null;
        }
        if (m == '' || isNaN(m))
            return this.ERROR_NAN;
        if (y == '' || isNaN(y))
            return this.ERROR_NAN;
        if (m < 1 || m > 12)
            return this.ERROR_OUT_OF_RANGE;
        if (y < this.config.yMin || y > this.config.yMax)
            return this.ERROR_OUT_OF_RANGE;
        return null;
    }
    RowEditor_month.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_month;
});