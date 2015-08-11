define([
    'jquery',
    'fx-DataEditor/js/DataEditor/DataEdit'
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

    function getData() { return dataEdit.getData(); }
    function setData(data) { dataEdit.setData(data); }
    function appendData(data) { dataEdit.appendData(data); }
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
        getData: getData,
        setData: setData,
        appendData: appendData,
        getColumnsWithDistincts: getColumnsWithDistincts,
        isEditable: isEditable,
        destroy: destroy,
        hasChanged: hasChanged
    }
});