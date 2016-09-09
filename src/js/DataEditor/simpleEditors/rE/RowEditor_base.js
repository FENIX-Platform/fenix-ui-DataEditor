define([
        'jquery',
        '../../../nls/labels',
        'bootstrap'
],
function ($, mlRes) {
    var defConfig = {};

    var RowEditor_base = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        this.$cnt;
        this.mandatory = false;

        this.ERROR_NAN = "NAN";
        this.ERROR_OUT_OF_RANGE = "OutOfRange";
        this.ERROR_NULL = "Null";
    };
    RowEditor_base.prototype.updateValidationHelp = function () {
        var error = this.validate();
        if (error == null) {
            this.$cnt.popover('destroy');
        }
        else {
            var errMSG = mlRes[error];
            this.$cnt.popover({ container: this.$cnt, content: errMSG, html: true });
            this.$cnt.popover('show');
        }
        /*if (error == null) {
            this.$cnt.popover('destroy');
        }
        else {
            var errMSG = mlRes[error];
            this.$cnt.popover({ container: this.$cnt, content: errMSG, html: true });
            this.$cnt.popover('show');
        }*/
    };
    RowEditor_base.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    };
    RowEditor_base.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }
    return RowEditor_base;
});