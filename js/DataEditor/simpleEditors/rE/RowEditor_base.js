define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'bootstrap'
],
function ($, jqx, mlRes) {
    var defConfig = {};
    var ERROR_NAN = "NAN";
    var ERROR_OUT_OF_RANGE = "OutOfRange";
    var ERROR_NULL = "Null";

    var RowEditor_base = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;
        this.mandatory = false;
    };

    /*RowEditor_base.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var html = '<input type="checkbox">';
        this.$cnt.html(html);

        var me = this;

        var $chk = this.$cnt.find('input');
        $chk.on('click', function () { me.updateValidationHelp(); });
    }*/
    RowEditor_base.prototype.updateValidationHelp = function () {
        var error = this.validate();
        if (error == null) {
            this.$cnt.popover('destroy');
        }
        else {
            var errMSG = error;
            this.$cnt.popover({ container: this.$cnt, content: errMSG, html: true });
            this.$cnt.popover('show');
        }
    }
    /* RowEditor_base.prototype.reset = function () {
        this.$cnt.prop('checked', false);
        this.$cnt.popover('destroy');
    }*/
    /*RowEditor_base.prototype.setValue = function (val) {
        this.reset();
        this.$cnt.find('input').prop('checked', val);
    }*/
    /*RowEditor_base.prototype.getValue = function () {
        return this.$cnt.find('input').prop('checked');
    }*/
    RowEditor_base.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }
    /*RowEditor_base.prototype.validate = function () {
        var val = this.getValue();
        var toRet = [];
        if (this.mandatory && !val)
            return ERROR_NULL;
        return null;
    }*/
    RowEditor_base.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_base;
});





/*define([
        'jquery',
        'jqxall'
],
function ($, jqx) {
    var defConfig = {};

    var RowEditor = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;

        this.isMandatory = false;
    };

    RowEditor.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
    }
    RowEditor.prototype.reset = function () {
    }
    RowEditor.prototype.setValue = function (val) {
    }
    RowEditor.prototype.getValue = function () {
    }

    RowEditor.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }
    return RowEditor;
});*/