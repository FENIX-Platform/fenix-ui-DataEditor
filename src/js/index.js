define([
    'jquery',
    '/DataEditor/DataEdit'
], function ($, DataEdit) {
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
        hasChanged: hasChanged
    }
});