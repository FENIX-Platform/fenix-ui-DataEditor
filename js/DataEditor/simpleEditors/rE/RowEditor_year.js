define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, jqx, mlRes, rowEditorBase) {
    var defConfig = { yMin: 0, yMax: 3000 };

    var RowEditor_year = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_year.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_year.prototype.constructor = RowEditor_year;
    RowEditor_year.prototype.parent = rowEditorBase.prototype;

    RowEditor_year.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var html = '<input type="text">';
        this.$cnt.html(html);
        var txt = this.$cnt.find('input');
        var me = this;
        txt.on('keyup', function () { me.updateValidationHelp(); });
    }
    RowEditor_year.prototype.destroy = function () {
        this.$cnt.find('input').off('keyup');
    }
    RowEditor_year.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }

    RowEditor_year.prototype.reset = function () {
        this.$cnt.find('input').val('');
        this.$cnt.popover('destroy');
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

    RowEditor_year.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val.trim() == '')
            return this.ERROR_NULL;
        if (isNaN(val))
            return this.ERROR_NAN;
        if (val < this.config.yMin)
            return this.ERROR_OUT_OF_RANGE;
        if (val > this.config.yMax)
            return this.ERROR_OUT_OF_RANGE;
        return null;
    }
    RowEditor_year.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_year;
});
/*define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'bootstrap'
],
function ($, jqx, mlRes) {
    var defConfig = { yMin: 0, yMax: 3000 };
    var ERROR_NAN = "NAN";
    var ERROR_OUT_OF_RANGE = "OutOfRange";
    var ERROR_NULL = "Null";

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
        txt.on('keyup', function () { me.updateValidationHelp(); });
    }
    RowEditor_year.prototype.updateValidationHelp = function () {
        var error = this.validate();
        if (error == null) {
            this.$cnt.popover('destroy');
        }
        else {
            var errMSG = mlRes[error];
            this.$cnt.popover({ container: this.$cnt, content: errMSG, html: true });
            this.$cnt.popover('show');
        }
    }

    RowEditor_year.prototype.reset = function () {
        this.$cnt.find('input').val('');
        this.$cnt.popover('destroy');
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

    RowEditor_year.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val.trim() == '')
            return ERROR_NULL;
        if (isNaN(val))
            return ERROR_NAN;
        if (val < this.config.yMin)
            return ERROR_OUT_OF_RANGE;
        if (val > this.config.yMax)
            return ERROR_OUT_OF_RANGE;
        return null;
    }
    RowEditor_year.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_year;
});*/