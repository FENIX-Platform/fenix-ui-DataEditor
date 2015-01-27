define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = {};
    var ERROR_NULL = "Null";

    var RowEditor_string = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;

        this.mandatory = false;
    };

    RowEditor_string.prototype.render = function (container, config) {
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
    RowEditor_string.prototype.reset = function () {
        this.$cnt.find('input').val('');
        this.$cnt.jqxValidator('hide');
    }
    RowEditor_string.prototype.setValue = function (val) {
        this.reset();
        this.$cnt.find('input').val(val);
    }
    RowEditor_string.prototype.getValue = function () {
        return this.$cnt.find('input').val();
    }
    RowEditor_string.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    RowEditor_string.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val.trim() == '')
            return ERROR_NULL;
        return null;
    }
    RowEditor_string.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_string;
});