define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'bootstrap'
],
function ($, jqx, mlRes) {
    var defConfig = {};
    var ERROR_NULL = "Null";

    var RowEditor_bool = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;
        this.mandatory = false;
    };

    RowEditor_bool.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var html = '<input type="checkbox">';
        this.$cnt.html(html);

        var me = this;

        var $chk = this.$cnt.find('input');
        $chk.on('click', function () { me.updateValidationHelp(); });
    }
    RowEditor_bool.prototype.updateValidationHelp = function () {
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
    RowEditor_bool.prototype.reset = function () {
        this.$cnt.prop('checked', false);
        this.$cnt.popover('destroy');
    }
    RowEditor_bool.prototype.setValue = function (val) {
        this.reset();
        this.$cnt.find('input').prop('checked', val);
    }
    RowEditor_bool.prototype.getValue = function () {
        return this.$cnt.find('input').prop('checked');
    }
    RowEditor_bool.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    }
    RowEditor_bool.prototype.validate = function () {
        var val = this.getValue();
        var toRet = [];
        if (this.mandatory && !val)
             return ERROR_NULL;
        return null;
    }
    RowEditor_bool.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_bool;
});