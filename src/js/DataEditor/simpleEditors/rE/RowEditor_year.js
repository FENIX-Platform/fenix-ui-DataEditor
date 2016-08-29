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

    var RowEditor_year = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_year.prototype = Object.create(rowEditorDate.prototype);
    RowEditor_year.prototype.constructor = rowEditorDate;
    RowEditor_year.prototype.parent = rowEditorDate.prototype;

    RowEditor_year.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.parent.render.call(this, container, config);
        this.$datePicker.data("DateTimePicker").format("YYYY");
        this.$datePicker.data("DateTimePicker").viewMode("years");
    };
    RowEditor_year.prototype.setValue = function (val) {
        this.reset();
        if (val) {
            this.$datePicker.data('DateTimePicker').date(new Date(val, 0, 1));
        }
    };
    RowEditor_year.prototype.getValue = function () {
        var dt = this.$datePicker.data('DateTimePicker').date();
        if (!dt)
            return '';
        return "" + dt.year();
    };
    RowEditor_year.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val) 
            return this.ERROR_NULL;
        if (!val)
            return null;
        if (val < this.config.yMin)
            return this.ERROR_OUT_OF_RANGE;
        if (val > this.config.yMax)
            return this.ERROR_OUT_OF_RANGE;
    };

    return RowEditor_year;
});