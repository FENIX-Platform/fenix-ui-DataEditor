define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_base',
        'bootstrap'
],
function ($, jqx, mlRes, rowEditorBase) {
    var defConfig = {};

    var RowEditor_bool = function (config) {
        this.parent.constructor.call(this, config);
    };
    RowEditor_bool.prototype = Object.create(rowEditorBase.prototype);
    RowEditor_bool.prototype.constructor = RowEditor_bool;
    RowEditor_bool.prototype.parent = rowEditorBase.prototype;

    RowEditor_bool.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;
        var html = '<input type="checkbox" />';
        this.$cnt.html(html);
        var me = this;
        var $chk = this.$cnt.find('input');




        //WAIT for the CSS to be fixed and remove this
        $chk.show();



        $chk.on('click', function () { me.updateValidationHelp(); });
    }
    RowEditor_bool.prototype.destroy = function () { this.$cnt.find('input').off('click'); }

    RowEditor_bool.prototype.updateValidationHelp = function () {
        var error = this.validate();
        this.parent.updateValidationHelp.call(this, error);
    }
    RowEditor_bool.prototype.reset = function () {
        this.$cnt.find('input').prop('checked', false);
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
        /*var val = this.getValue();
        var toRet = [];
        if (this.mandatory && !val)
            return this.ERROR_NULL;*/
        return null;
    }
    RowEditor_bool.prototype.isValid = function () {
        if (this.validate() == null)
            return true;
        return false;
    }

    return RowEditor_bool;
});