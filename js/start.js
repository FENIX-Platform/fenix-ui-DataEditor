/*
config format:

{
    "D3SConnector": {
        metadataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata",
        dsdUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/dsd",
        dataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources",
        getDataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/data",
        getMetaAndDataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/uid/dan3?dsd=true",
        codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources/data",
        contextSystem: "CountrySTAT",
        datasource:"CountrySTAT"
    }
}
*/

define([
    'jquery',
    'fx-DataEditor/js/DataEditor/DataEdit',
    'fx-DataEditor/js/DataEditor/dataConnectors/Connector_D3S',
    'domReady!'
], function ($, DataEdit, Connector) {

    var cfg = {};
    var dataEdit;

    function init(containerID, config, callB) {
        cfg = config;
        dataEdit = new DataEdit();
        dataEdit.render($(containerID), cfg, callB);
    }

    function setDSDAndData(dsd, data, callB) {
        getCodelists(dsd.columns, function (codelists) {
            dataEdit.setDSDAndData(dsd, codelists, data);
            if (callB) callB();
        });
    }

    function getData() { return dataEdit.getData(); }
    function setData(data) { dataEdit.setData(data); }
    function getDSDWithDistincts() { return dataEdit.getDSDWithDistincts(); }


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
        if (typeof(editable) != 'undefined')
            dataEdit.isEditable(editable);
        else
            return dataEdit.isEditable();
    }

    return {
        init: init,
        setDSDAndData: setDSDAndData,
        loadMetaAndData: loadMetaAndData,
        getData: getData,
        setData: setData,
        updateDSD: updateDSD,
        updateData: updateData,
        getDSDWithDistincts: getDSDWithDistincts,
        isEditable: isEditable
    }
});