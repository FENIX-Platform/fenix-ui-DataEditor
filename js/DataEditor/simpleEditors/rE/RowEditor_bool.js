define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = {};
    var ERROR_NULL = "Null";

    var RowEditor_bool = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;

        this.mandatory = false;
    };

    RowEditor_bool.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var html = '<input type="checkbox">';
        this.$cnt.html(html);

        var me = this;
        this.$cnt.jqxValidator({
            rules: [{
                input: this.$cnt, message: 'E', action: 'change',
                rule: function () {
                    var isValid = me.isValid();
                    if (!isValid)
                        this.rules[0].message = me.validate();
                    return isValid;
                }
            }]
        });
    }
    RowEditor_bool.prototype.reset = function () {
        this.$cnt.prop('checked', false);
    }
    RowEditor_bool.prototype.setValue = function (val) {
        this.reset();
        this.$cnt.find('input').prop('checked', val);
    }
    RowEditor_bool.prototype.getValue = function () {
        return this.$cnt.find('input').prop('checked');
    }
    RowEditor_bool.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }
    RowEditor_bool.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val)
            return ERROR_NULL;
        return null;
    }
    RowEditor_bool.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_bool;
});