/*
config format:
{
    "D3SConnector": {
        baseAddress: "http://fenix.fao.org/d3s_dev/msd",
        metadataUrl: "resources/metadata",
        dsdUrl: "resources/dsd",
        dataUrl: "resources",
        getDataUrl: "resources/data",
        getMetaAndDataUrl: "resources",
        
        codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources",
        codelistMetaUrl: "http://faostat3.fao.org:7799/v2/msd/resources/metadata",
        codelistFilteredUrl: "http://faostat3.fao.org:7799/v2/msd/codes/filter",
        
        contextSystem: "CountrySTAT",
        datasources: ["D3S"]
    }
}
*/

define([
    'jquery',
    'fx-DataEditor/js/DataEditor/DataEdit',
    'fx-DataEditor/js/DataEditor/dataConnectors/Connector_D3S'
], function ($, DataEdit, Connector) {

    var cfg = {};
    var dataEdit;

    function init(containerID, config, callB) {
        cfg = config;
        dataEdit = new DataEdit();
        dataEdit.render($(containerID), cfg, callB);
        return data
    }

    function setColumns(columns, callB) {
        getCodelists(columns, function (codelists) {
            dataEdit.setColumns(columns, codelists);
            if (callB) callB();
        });
    }

    function getData() { return dataEdit.getData(); }
    function setData(data) { dataEdit.setData(data); }
    function getColumnsWithDistincts() { return dataEdit.getColumnsWithDistincts(); }


    function getCodelists(cols, callB) {
        if (!cols)
            return null;
        if (cfg.D3SConnector)
            var conn = new Connector(cfg.D3SConnector);

        var codelistsToGet = [];
        var toRet = {};
        for (var i = 0; i < cols.length; i++)
            if (cols[i].dataType == 'code') {
                codelistsToGet.push({ uid: cols[i].domain.codes[0].idCodeList, version: cols[i].domain.codes[0].version });
            }
        var conn = new Connector();
        conn.getCodelists(codelistsToGet, function (cLists) {
            if (callB)
                callB(cLists);
        })
    }

    //Conn
    function updateDSD(uid, version, dsd, callB) {
        var conn = getConnector();
        conn.updateDSD(uid, version, dsd, callB);
    }
    function updateData(uid, version, data, callB) {
        var conn = getConnector();
        conn.putData(uid, version, data, callB);
    }
    function loadMetaAndData(uid, version, callB) {
        var conn = getConnector();
        conn.getMetaAndData(uid, version, callB);
    }
    function getConnector() {
        if (cfg.D3SConnector)
            return new Connector(cfg.D3SConnector);
        else
            return new Connector();
    }
    //END Conn

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

    return {
        init: init,
        setColumns: setColumns,
        loadMetaAndData: loadMetaAndData,
        getData: getData,
        setData: setData,
        updateDSD: updateDSD,
        updateData: updateData,
        getColumnsWithDistincts: getColumnsWithDistincts,
        isEditable: isEditable,
        destroy: destroy
    }
});