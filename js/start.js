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

    function getData() { return dataEdit.getData(); }
    function setData(data) { dataEdit.setData(data); }
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
        getData: getData,
        setData: setData,
        getColumnsWithDistincts: getColumnsWithDistincts,
        isEditable: isEditable,
        destroy: destroy,
        hasChanged: hasChanged
    }
});