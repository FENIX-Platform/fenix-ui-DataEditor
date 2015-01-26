define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = { yMin: 0, yMax: 3000 };

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
                input: me.$cnt, message: '__MSG Month limit', action: 'valuechanged, blur',
                rule: function () {
                    var val = me.$cnt.jqxMaskedInput('val');
                    var promptChar = me.$cnt.jqxMaskedInput('promptChar');
                    var m = val.substring(0, 2);
                    var y = val.substring(3, 7);
                    m = m.split(promptChar).join("");
                    y = y.split(promptChar).join("");

                    if (m == '' && y == '') //empty val
                        return true;
                    if (isNaN(m))
                        return false;
                    if (isNaN(y))
                        return false;
                    if (m < 1 || m > 12)
                        return false;
                    if (y < me.config.yMin || y > me.config.yMax)
                        return false;
                    return true;
                }
            },
            {
                input: me.$cnt, message: '__MSG Month null', action: 'blur, keyup, click',
                rule: function () {
                    if (!me.mandatory)
                        return true;
                    var val = me.$cnt.jqxMaskedInput('val');
                    if (val == '')
                        return false;
                    return true;
                }
            }
            ]
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
    return RowEditor_month;
});