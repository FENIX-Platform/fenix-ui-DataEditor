if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([
        'jquery',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_date',
        'bootstrap'
],
function ($, mlRes, rowEditorDate) {
    var defConfig = { yMin: 0, yMax: 3000 };

    var RowEditor_month = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_month.prototype = Object.create(rowEditorDate.prototype);
    RowEditor_month.prototype.constructor = rowEditorDate;
    RowEditor_month.prototype.parent = rowEditorDate.prototype;

    RowEditor_month.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.parent.render.call(this, container, config);
        this.$datePicker.data("DateTimePicker").format("MM/YYYY");
        this.$datePicker.data("DateTimePicker").viewMode("months");
    };
    RowEditor_month.prototype.setValue = function (val) {
        this.reset();
        if (val) {
            var y = val.substring(0, 4) + "";
            var m = val.substring(4, 6) + "";
            m = m - 1;
            this.$datePicker.data('DateTimePicker').date(new Date(y, m, 1));
        }
    };
    RowEditor_month.prototype.getValue = function () {
        var dt = this.$datePicker.data('DateTimePicker').date();
        if (!dt)
            return '';
        var m = "" + (dt.month() + 1);
        var y = "" + dt.year();
        if (m.length == 1)
            m = "0" + m;
        while (y.length < 4)
            y = "0" + y;
        return y + m;
    };
    RowEditor_month.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val)
            return this.ERROR_NULL;
        if (!val)
            return null;
        var y = val.substring(0, 4);
        var m = val.substring(4, 6);
        if (this.mandatory && (m == '' || y == ''))
            return this.ERROR_NULL;
        if (y < this.config.yMin || y > this.config.yMax)
            return this.ERROR_OUT_OF_RANGE;
        if (m == '' && y == '') {
            return null;
        }
    };
    return RowEditor_month;
});