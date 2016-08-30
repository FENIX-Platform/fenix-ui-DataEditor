if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([
        'jquery',
        'i18n!fx-DataEditor/nls/labels',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, mlRes, rowEditorBase) {
    var defConfig = {
        html: '<input type="text" class="form-control">'
    };
    var ERROR_NULL = "Null";

    var RowEditor_string = function (config) {
        this.parent.constructor.call(this, config, defConfig);
        $.extend(true, this.config, defConfig);
        this.$cnt;
        this.txt;
        //this.$cnt;
    };
    RowEditor_string.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_string.prototype.constructor = RowEditor_string;
    RowEditor_string.prototype.parent = rowEditorBase.prototype;

    RowEditor_string.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        this.$cnt.html(this.config.html);
        this.txt = this.$cnt.find('input');
        var me = this;
        this.$cnt.on('valueChanged', function () { me.updateValidationHelp(); });
    };
    RowEditor_string.prototype.destroy = function () {
        this.$cnt.off('valuechanged');
    };
    RowEditor_string.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    };
    RowEditor_string.prototype.reset = function () {
        this.txt.val('');
        this.$cnt.popover('destroy');
    };
    RowEditor_string.prototype.setValue = function (val) {
        this.reset();
        this.txt.val(val);
    };
    RowEditor_string.prototype.getValue = function () {
        return this.txt.val().trim();
    };
    RowEditor_string.prototype.isMandatory = function (m) {
        if (m == 'undefined')
            return this.mandatory;
        this.mandatory = m;
    };
    RowEditor_string.prototype.validate = function () {
        var val = this.getValue();
        if (this.mandatory && val.trim() == '')
            return this.ERROR_NULL;
        return null;
    };
    RowEditor_string.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    };

    return RowEditor_string;
});