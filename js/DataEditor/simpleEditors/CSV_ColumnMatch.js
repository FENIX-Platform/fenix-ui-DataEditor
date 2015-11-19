define([
        'jquery',
        'text!fx-DataEditor/html/DataEditor/simpleEditors/CSV_ColumnMatch.htm'
],
function ($, CSV_ColumnMatchHTML) {
    var widgetName = "CSV_ColumnMatch";

    var CSV_ColumnMatch = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);

        this.$cnt;
        this.dsdCols;
        this.csvCols;
    };

    CSV_ColumnMatch.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$cnt = container;

        this.$cnt.html(CSV_ColumnMatchHTML);

    }
    CSV_ColumnMatch.prototype.setColumns = function (dsdCols, csvCols) {
        this.dsdCols = dsdCols;
        this.csvCols = csvCols;
        this.updateUI();
    }

    CSV_ColumnMatch.prototype.createUI = function () {
    }

    return CSV_ColumnMatch;
});