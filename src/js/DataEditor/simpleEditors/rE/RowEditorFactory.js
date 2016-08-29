﻿if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([
        'jquery',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_bool',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_code',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_date',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_month',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_number',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_string',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditor_year'
],
function ($, reBool, reCode, reDate, reMonth, reNumber, reString, reYear) {
    var defConfig = {};

    var RowEditorFactory = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
    };

    RowEditorFactory.prototype.create = function (id, config) {
        switch (id) {
            case 'code':
                return new reCode(config);
                break;
            case 'customCode':
                //return new reCustomCode();
                break;
            case 'year':
                return new reYear(config);
                break;
            case 'month':
                return new reMonth(config);
                break;
            case 'date':
                return new reDate(config);
                break;
            case 'number':
            case 'percentage':
                return new reNumber(config);
                break;
            case 'text':
                return new reString(config);
                break;
            case 'bool':
                return new reBool(config);
                break;
        }
    }

    return RowEditorFactory;
});