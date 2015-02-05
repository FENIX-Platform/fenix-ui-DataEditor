define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, jqx, mlRes, rowEditorBase) {
    var defConfig = {};
    var ERROR_NULL = "Null";

    var RowEditor_string = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_string.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_string.prototype.constructor = RowEditor_string;
    RowEditor_string.prototype.parent = rowEditorBase.prototype;

    RowEditor_string.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var html = '<input type="text">';
        this.$cnt.html(html);
        var txt = this.$cnt.find('input');
        var me = this;
        this.$cnt.on('valueChanged', function () { me.updateValidationHelp(); });
    }
    RowEditor_string.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }

    RowEditor_string.prototype.reset = function () {
        this.$cnt.find('input').val('');
        this.$cnt.popover('destroy');
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

    RowEditor_string.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val.trim() == '')
            return this.ERROR_NULL;
        return null;
    }
    RowEditor_string.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_string;
});
/*define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'bootstrap'
],
function ($, jqx, mlRes) {
    var defConfig = {};
    var ERROR_NULL = "Null";

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
        this.$cnt.on('valueChanged', function () { me.updateValidationHelp(); });
    }
    RowEditor_string.prototype.updateValidationHelp = function () {
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

    RowEditor_string.prototype.reset = function () {
        this.$cnt.find('input').val('');
        this.$cnt.popover('destroy');
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

    RowEditor_string.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val.trim() == '')
            return ERROR_NULL;
        return null;
    }
    RowEditor_string.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_string;
});*/