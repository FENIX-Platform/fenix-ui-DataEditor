define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        //'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_date',
        'bootstrap'
],
function ($, jqx, mlRes, rowEditorDate) {
    var defConfig = { yMin: 0, yMax: 3000 };
    //var months = ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    var RowEditor_month = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_month.prototype = Object.create(rowEditorDate.prototype);
    RowEditor_month.prototype.constructor = rowEditorDate;
    RowEditor_month.prototype.parent = rowEditorDate.prototype;

    RowEditor_month.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.parent.render.call(this, container, config);
        //this.$cnt = container;
        //this.$cnt.html(RowEditorTimeHTML);

        //this.$datePicker = this.$cnt.find('#inputTime');
        //this.$datePicker.datetimepicker({ viewMode: 'months', locale: 'en', format: "MM/YYYY" });
        //var me = this;
        //this.$cnt.on('change', function () { me.updateValidationHelp(); });
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
        /*var val = this.$cnt.jqxMaskedInput('val');
        var m = val.substring(0, 2) + "";
        var y = val.substring(3, 7) + "";
        return y + m;*/

        var dt = this.$datePicker.data('DateTimePicker').date();
        if (!dt)
            return null;
        var m = "" + (dt.month() + 1);
        var y = "" + dt.year();
        if (m.length == 1)
            m = "0" + m;
        while (y.length < 4)
            y = "0" + y;
        return y + m;
    };
    /*RowEditor_month.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }*/

    RowEditor_month.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val) {
            return this.ERROR_NULL;
        }
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
        };

        /*var val = this.$cnt.jqxMaskedInput('val');
        var promptChar = this.$cnt.jqxMaskedInput('promptChar');
        var m = val.substring(0, 2);
        var y = val.substring(3, 7);
        m = m.split(promptChar).join("");
        y = y.split(promptChar).join("");

        if (this.mandatory && (m == '' || y == ''))
            return this.ERROR_NULL;
        if (m == '' && y == '') {
            return null;
        }
        if (m == '' || isNaN(m))
            return this.ERROR_NAN;
        if (y == '' || isNaN(y))
            return this.ERROR_NAN;
        if (m < 1 || m > 12)
            return this.ERROR_OUT_OF_RANGE;
        if (y < this.config.yMin || y > this.config.yMax)
            return this.ERROR_OUT_OF_RANGE;
        return null;*/
    }
    /*RowEditor_month.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }*/

    return RowEditor_month;
});