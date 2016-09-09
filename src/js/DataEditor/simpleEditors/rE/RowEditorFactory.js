define([
        'jquery',
        './RowEditor_bool',
        './RowEditor_code',
        './RowEditor_date',
        './RowEditor_month',
        './RowEditor_number',
        './RowEditor_string',
        './RowEditor_year'
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