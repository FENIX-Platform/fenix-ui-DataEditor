define([
        'jquery',
        'jqxall'
],
function ($, jqx, rowEditorBase) {
    var defConfig = { yMin: 0, yMax: 3000 };
    var ERROR_NAN = "NAN";
    var ERROR_OUT_OF_RANGE = "OutOfRange";
    var ERROR_NULL = "Null";

    var RowEditor_year = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;
        this.mandatory = false;
    };

    RowEditor_year.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var html = '<input type="text">';
        this.$cnt.html(html);
        var txt = this.$cnt.find('input');
        var me = this;
        this.$cnt.jqxValidator({
            rules: [{
                input: txt, message: 'E', action: 'blur, keyup, click',
                rule: function () {
                    var isValid = me.isValid();
                    if (!isValid)
                        this.rules[0].message = me.validate();
                    return isValid;
                }
            }]
        });
    }
    RowEditor_year.prototype.reset = function () {
        this.$cnt.find('input').val('');
        this.$cnt.jqxValidator('hide');
    }
    RowEditor_year.prototype.setValue = function (val) {
        this.reset();
        if (val)
            this.$cnt.find('input').val(val);
    }
    RowEditor_year.prototype.getValue = function () {
        return this.$cnt.find('input').val();
    }

    RowEditor_year.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    RowEditor_year.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val.trim() == '')
            return ERROR_NULL;
        if (isNaN(val))
            return ERROR_NAN;
        if (val < this.config.yMin)
            return ERROR_OUT_OF_RANGE;
        if (val > this.config.yMax)
            return ERROR_OUT_OF_RANGE;
        return null;
    }
    RowEditor_year.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_year;
});