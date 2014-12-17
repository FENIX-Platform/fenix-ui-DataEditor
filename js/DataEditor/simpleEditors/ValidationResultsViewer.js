define([
'jquery',
 'jqxall'
  ],
function ($, jqx) {
    var ValidationResultsViewer = function () {
        this.$valResGrid;
    };

    //Render - creation
    ValidationResultsViewer.prototype.render = function (container) {
        this.$valResGrid = container;
        this.$valResGrid.jqxGrid({});
    }

    ValidationResultsViewer.prototype.setValidationResults = function (valRes) {
        if (!valRes) {
            this.$valResGrid.jqxGrid({});
            return;
        }
        var DS = { localdata: valRes, datatype: "array", datafields: createDatafields };
        var DA = new $.jqx.dataAdapter(DS);
        this.$valResGrid.jqxGrid({ source: DA, columns: createTableColumns(), editable: false});
    }

    var createDatafields = function () {
        var toRet = [{ name: 'error' }, { name: 'dataIndex' }, { name: 'colId'}];
        return toRet;
    }

    var createTableColumns = function () {

        var toRet = [
        { text: 'Error', datafield: 'error', width:"50%"},
        { text: 'Row', datafield: 'dataIndex', width: "25%" },
        { text: 'Col', datafield: 'colId', width: "25%" }
        ];
        return toRet;
    }

    return ValidationResultsViewer;
});