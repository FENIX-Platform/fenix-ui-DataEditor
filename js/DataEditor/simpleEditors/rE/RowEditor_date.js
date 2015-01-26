define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = { yMin: 0, yMax: 3000 };

    var RowEditor_date = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;
        this.mandatory = false;
    };

    RowEditor_date.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;

        this.$cnt.jqxCalendar();
        var me = this;
        this.$cnt.jqxValidator({
            rules: [{
                input: me.$cnt, message: '__MSG Date limit', action: 'valuechanged, blur',
                rule: function (input, commit) {
                    var val = me.$cnt.jqxCalendar('value');
                    var y = val.getFullYear();
                    if (y < me.config.yMin) return false;
                    if (y > me.config.yMax) return false;
                    return true;
                }
            },
            {
                input: me.$cnt, message: '__MSG Date null', action: 'valuechanged, blur',
                rule: function (input, commit) {
                    if (!me.mandatory)
                        return true;
                    var val = me.$cnt.jqxCalendar('value');
                    if (!val)
                        return false;
                    return true;
                }
            }]
        });
    }

    RowEditor_date.prototype.reset = function () {
        this.$cnt.jqxCalendar('clear');
        this.$cnt.jqxValidator('hide');
    }
    RowEditor_date.prototype.setValue = function (val) {
        this.reset();
        if (val) {
            val = "" + val;
            var d = val.substring(0, 2);
            var m = val.substring(2, 4);
            m = m - 1;
            var y = val.substring(4, 8);
            this.$cnt.jqxCalendar('setDate', new Date(y, m, d));
        }
    }
    RowEditor_date.prototype.getValue = function () {
        var dt = this.$cnt.jqxCalendar('getDate');
        if (!dt)
            return null;
        var d = "" + dt.getDate();
        var m = "" + (dt.getMonth() + 1);
        var y = "" + dt.getFullYear();
        if (d.length == 1)
            d = "0" + d;
        if (m.length == 1)
            m = "0" + m;
        while (y.length < 4)
            y = "0" + y;
        return d + m + y;
    }
    RowEditor_date.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    return RowEditor_date;
});