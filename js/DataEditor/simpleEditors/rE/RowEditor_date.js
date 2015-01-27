define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = { yMin: 0, yMax: 3000 };
    var ERROR_OUT_OF_RANGE = "OutOfRange";
    var ERROR_NULL = "Null";

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

    RowEditor_date.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val)
            return ERROR_NULL;
        var y = val.substring(4, 8);
        if (y < this.config.yMin) return ERROR_OUT_OF_RANGE;
        if (y > this.config.yMax) return ERROR_OUT_OF_RANGE;
        return null;
    }
    RowEditor_date.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_date;
});