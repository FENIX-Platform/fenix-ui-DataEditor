define([
        'jquery',
        'jqxall'
],
function ($, jqx, rowEditorBase) {
    var defConfig = { yMin: 0, yMax: 3000 };

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
                input: txt, message: '__MSG Year limit', action: 'blur, keyup, click',
                rule: function () {
                    var val = txt.val();
                    if (isNaN(val))
                        return false;
                    if (val < me.config.yMin)
                        return false;
                    if (val > me.config.yMax)
                        return false;
                    return true;
                }
            },
            {
                input: txt, message: '__MSG Year null', action: 'blur, keyup, click',
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

    return RowEditor_year;
});