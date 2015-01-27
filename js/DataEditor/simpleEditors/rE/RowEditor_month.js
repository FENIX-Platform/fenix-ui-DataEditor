define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
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
        var me = this;
        this.$cnt.jqxMaskedInput({ mask: '##-####', width: 120 });

        this.$cnt.jqxValidator({
            rules: [{
                input: me.$cnt, message: 'E', action: 'blur, valuechanged',
                rule: function () {
                    var isValid = me.isValid();
                    if (!isValid)
                        this.rules[0].message = me.validate();
                    return isValid;
                }
            }]
        });
    }
    RowEditor_month.prototype.reset = function () {
        this.$cnt.jqxMaskedInput('clear');
        this.$cnt.jqxValidator('hide');
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
        if (isNaN(m))
            return ERROR_NAN;
        if (isNaN(y))
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