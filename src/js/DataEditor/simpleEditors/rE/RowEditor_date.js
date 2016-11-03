define([
        'jquery',
        'eonasdan-bootstrap-datetimepicker',
        '../../../../nls/labels',
        './RowEditor_base',
        '../../../../html/DataEditor/simpleEditors/RowEditorTime.hbs',
        'moment',
        'bootstrap'
],
function ($, datetimepicker, mlRes, rowEditorBase, RowEditorTimeHTML) {
    var defConfig = { yMin: 0, yMax: 3000 };
    var h = {
        inputTime: '#inputTime'
    };

    var RowEditor_date = function (config) {
        this.parent.constructor.call(this, config);
        $.extend(true, this.config, defConfig);
        this.$datePicker;
    };
    RowEditor_date.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_date.prototype.constructor = rowEditorBase;
    RowEditor_date.prototype.parent = rowEditorBase.prototype;

    RowEditor_date.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        this.$cnt.html(RowEditorTimeHTML);

        this.$datePicker = this.$cnt.find('#inputTime');
        this.$datePicker.datetimepicker({ viewMode: 'days', locale: 'en', format: "DD/MM/YYYY" });
        var me = this;
        this.$cnt.on('change', function () { me.updateValidationHelp(); });
    };
    RowEditor_date.prototype.destroy = function () {
        this.$datePicker.data("DateTimePicker").destroy();
        this.$datePicker.off('change');
    };
    /*RowEditor_date.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    };*/

    RowEditor_date.prototype.reset = function () {
        this.$datePicker.data("DateTimePicker").clear();
        //this.$cnt.popover('destroy');
    };
    RowEditor_date.prototype.setValue = function (val) {
        this.reset();
        if (val) {
            val = "" + val;
            var d = val.substring(6, 8);
            var m = val.substring(4, 6);
            m = m - 1;
            var y = val.substring(0, 4);
            this.$datePicker.data('DateTimePicker').date(new Date(y, m, d));
        }
    };
    RowEditor_date.prototype.getValue = function () {
        var dt = this.$datePicker.data('DateTimePicker').date();
        if (!dt)
            return '';
        var d = "" + dt.date();
        var m = "" + (dt.month() + 1);
        var y = "" + dt.year();
        if (d.length == 1)
            d = "0" + d;
        if (m.length == 1)
            m = "0" + m;
        while (y.length < 4)
            y = "0" + y;
        return y + m + d;
    };
    /*RowEditor_date.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }*/

    RowEditor_date.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val)
            return this.ERROR_NULL;
        var y = val.substring(4, 8);
        if (y < this.config.yMin) return this.ERROR_OUT_OF_RANGE;
        if (y > this.config.yMax) return this.ERROR_OUT_OF_RANGE;
        return null;
    };
    /*RowEditor_date.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }*/

    return RowEditor_date;
});


/*
define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, jqx, mlRes, rowEditorBase) {
    var defConfig = { yMin: 0, yMax: 3000 };

    var RowEditor_date = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_date.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_date.prototype.constructor = RowEditor_date;
    RowEditor_date.prototype.parent = rowEditorBase.prototype;

    RowEditor_date.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;

        this.$cnt.jqxCalendar();
        var me = this;
        this.$cnt.on('change', function () { me.updateValidationHelp(); });
    }
    RowEditor_date.prototype.destroy = function () {
        this.$cnt.jqxCalendar('destroy');
        this.$cnt.off('change');
    }
    RowEditor_date.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }

    RowEditor_date.prototype.reset = function () {
        this.$cnt.jqxCalendar('clear');
        this.$cnt.popover('destroy');
    }
    RowEditor_date.prototype.setValue = function (val) {
        this.reset();
        if (val) {
            val = "" + val;
            var d = val.substring(6, 8);
            var m = val.substring(4, 6);
            m = m - 1;
            var y = val.substring(0, 4);
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
        return y + m + d;
    }
    RowEditor_date.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }

    RowEditor_date.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && !val)
            return this.ERROR_NULL;
        var y = val.substring(4, 8);
        if (y < this.config.yMin) return this.ERROR_OUT_OF_RANGE;
        if (y > this.config.yMax) return this.ERROR_OUT_OF_RANGE;
        return null;
    }
    RowEditor_date.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_date;
});
*/
