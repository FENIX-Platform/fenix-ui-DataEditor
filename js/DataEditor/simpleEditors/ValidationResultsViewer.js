define([
'jquery',
 'jqxall',
 'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit'
  ],
function ($, jqx, mlRes) {
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

        for (var i=0;i<valRes.length;i++)
        {
            valRes[i].mlError = mlRes[valRes[i].error];
        }

        //console.log(mlRes);

        var DS = { localdata: valRes, datatype: "array", datafields: createDatafields };
        var DA = new $.jqx.dataAdapter(DS);
        this.$valResGrid.jqxGrid({ source: DA, columns: createTableColumns(), editable: false});
    }

    var createDatafields = function () {
        //var toRet = [{ name: 'error' }, { name: 'dataIndex' }, { name: 'colId'}];
        var toRet = [{ name: 'mlError' }, { name: 'dataIndex' }, { name: 'colId' }];
        return toRet;
    }

    var createTableColumns = function () {

        var toRet = [
        { text: 'Error', datafield: 'mlError', width: "50%" },
        { text: 'Row', datafield: 'dataIndex', width: "25%" },
        { text: 'Col', datafield: 'colId', width: "25%" }
        ];
        return toRet;
    }

    return ValidationResultsViewer;
});