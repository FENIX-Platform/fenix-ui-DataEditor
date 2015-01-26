define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = { decimalDigits: 5 };

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
        this.$cnt.jqxValidator({
            rules: [{
                input: me.$cnt, message: '__MSG number null', action: 'blur, keyup, click',
                rule: function () {
                    if (!me.mandatory)
                        return true;
                    val = me.$cnt.jqxNumberInput('val');
                    if (val == '')
                        return false;
                    return true;
                }
            }]
        });
    }
    RowEditor_number.prototype.reset = function () {
        this.$cnt.jqxNumberInput('val', '');
        this.$cnt.jqxValidator('hide');
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

    return RowEditor_number;
});