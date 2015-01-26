define([
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
});