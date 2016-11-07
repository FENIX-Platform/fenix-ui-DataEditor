define([
    'jquery',
    './DataEditor/DataEdit',
    './DataEditor/helpers/CSV_To_Dataset',
    './DataEditor/helpers/Validator_CSV',
    './DataEditor/helpers/Data_Validator',
    './DataEditor/ColumnsMatch/ColumnsMatch'

], function ($, DataEdit, Csv2Dataset, ValidatorCSV, DataValidator, ColumnsMatch) {
    var cfg = {};
    var dataEdit;

    function init(containerID, config, callB) {
        cfg = config;
        dataEdit = new DataEdit();
        dataEdit.render($(containerID), cfg, callB);
    }

    function setColumns(columns, cLists, callB) {
        dataEdit.setColumns(columns, cLists, callB);
    }
    function getColumns() { return dataEdit.getColumns(); }
    function getCodelists() { return dataEdit.getCodelists(); }

    function getData() { return dataEdit.getData(); }
    function getDataWithoutValidation() { return dataEdit.getDataWithoutValidation(); }
    function setData(data) { dataEdit.setData(data); }
    function appendData(data) { dataEdit.appendData(data); }
    function removeAllData() { dataEdit.removeAllData(); }
    function getColumnsWithDistincts() { return dataEdit.getColumnsWithDistincts(); }

    function setStatus(stat) {
        dataEdit.setStatus(stat);
    }

    function getStatus() {
        return dataEdit.getStatus();
    }


    function isEditable(editable) {
        if (typeof (editable) != 'undefined')
            dataEdit.isEditable(editable);
        else
            return dataEdit.isEditable();
    }
    function destroy() {
        if (dataEdit)
            dataEdit.destroy();
    }
    function hasChanged() { return dataEdit.hasChanged(); }

    function CSV_To_Dataset(a,b) {
        return new Csv2Dataset(a,b);
    }

    function Validator_CSV() {
        return ValidatorCSV;
    }

    function Columns_Match() {
        return new ColumnsMatch();
    }

    function Data_Validator() {
        return new DataValidator();
    }

    return {
        init: init,
        setColumns: setColumns,
        getColumns: getColumns,
        getCodelists: getCodelists,
        getData: getData,
        getDataWithoutValidation: getDataWithoutValidation,
        setData: setData,
        appendData: appendData,
        removeAllData: removeAllData,
        getColumnsWithDistincts: getColumnsWithDistincts,
        isEditable: isEditable,
        destroy: destroy,
        hasChanged: hasChanged,
        CSV_To_Dataset: CSV_To_Dataset,
        Validator_CSV: Validator_CSV,
        Columns_Match: Columns_Match,
        Data_Validator: Data_Validator,
        setStatus: setStatus,
        getStatus: getStatus
    }
});