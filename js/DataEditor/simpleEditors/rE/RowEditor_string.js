define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = {};

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
                input: txt, message: '__MSG String null', action: 'blur, keyup, click',
                rule: function () {
                    if (!me.mandatory)
                        return true;
                    var val = txt.val();
                    if (val.trim() == '')
                        return false;
                    return true;
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

    return RowEditor_string;
});