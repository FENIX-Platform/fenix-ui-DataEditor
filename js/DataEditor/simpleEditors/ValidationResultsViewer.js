define([
'jquery',
 'jqxall',
 'fx-DataEditor/js/DataEditor/helpers/MLUtils'
  ],
function ($, jqx, MLUtils) {
    var ValidationResultsViewer = function () {
        this.$valResGrid;
        this.gridH = 100;
    };

    //Render - creation
    ValidationResultsViewer.prototype.render = function (container) {
        this.$valResGrid = container;
        this.$valResGrid.jqxGrid({ height: this.gridH });
    }

    ValidationResultsViewer.prototype.setValidationResults = function (valRes) {
        if (!valRes) {
            this.$valResGrid.jqxGrid({});
            return;
        }

        var DS = { localdata: valRes, datatype: "array", datafields: createDatafields };
        var DA = new $.jqx.dataAdapter(DS);
        this.$valResGrid.jqxGrid({ source: DA, columns: createTableColumns(), editable: false, height: this.gridH });
    }

    var createDatafields = function () {
        var toRet = [{ name: 'error' }, { name: 'dataIndex' }, { name: 'colId'}];
        return toRet;
    }

    var createTableColumns = function () {

        var toRet = [
        { text: 'Error', datafield: 'error' },
        { text: 'Row', datafield: 'dataIndex' },
        { text: 'Col', datafield: 'colId' }
        ];
        return toRet;
    }

    return ValidationResultsViewer;
});