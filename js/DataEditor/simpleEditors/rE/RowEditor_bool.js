define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = {};

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

        var me=this;
        this.$cnt.jqxValidator({
            rules: [{
                message: '__not null!',
                action: 'change',
                input:this.$cnt.find('input'),
                rule: function (input) {
                    if (!me.mandatory)
                        return true;
                    var val = me.getValue();
                    if (val)
                        return true;
                    return false;
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

    return RowEditor_bool;
});