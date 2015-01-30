define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'bootstrap'
],
function ($, jqx, mlRes) {
    var defConfig = { yMin: 0, yMax: 3000 };
    var ERROR_NAN = "NAN";
    var ERROR_OUT_OF_RANGE = "OutOfRange";

    var RowEditor_month = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;
        this.mandatory = false;
    };

    RowEditor_month.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;





        var html = '<table><tr><td><div id="rowEditoMonthM"></div></td><td><div id="rowEditoMonthY"><input type="text"></div></td></tr></table>';





        var me = this;
        this.$cnt.jqxMaskedInput({ mask: '##-####', width: 120 });
        this.$cnt.on('valueChanged', function () { me.updateValidationHelp(); });
    }
    RowEditor_month.prototype.updateValidationHelp = function () {
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
    RowEditor_month.prototype.reset = function () {
        this.$cnt.jqxMaskedInput('clear');
        this.$cnt.popover('destroy');
    }
    RowEditor_month.prototype.setValue = function (val) {
        this.reset();
        if (val)
            this.$cnt.jqxMaskedInput('inputValue', val);
    }
    RowEditor_month.prototype.getValue = function () {
        var val = this.$cnt.jqxMaskedInput('val');
        var m = val.substring(0, 2) + "";
        var y = val.substring(3, 7) + "";
        return m + y;
    }
    RowEditor_month.prototype.isMandatory = function (m) {
        console.log(m);
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
            return ERROR_NULL;
        if (m == '' && y == '') {
            return null;
        }
        if (m == '' || isNaN(m))
            return ERROR_NAN;
        if (y == '' || isNaN(y))
            return ERROR_NAN;
        if (m < 1 || m > 12)
            return ERROR_OUT_OF_RANGE;
        if (y < this.config.yMin || y > this.config.yMax)
            return ERROR_OUT_OF_RANGE;
        return null;
    }
    RowEditor_month.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_month;
});