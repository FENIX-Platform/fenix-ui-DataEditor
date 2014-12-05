/*
config format:

{
    "D3SConnector": {
        "datasource": "CountrySTAT",
        "contextSystem": "CountrySTAT",
        "metadataUrl": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata",
        "dsdUrl": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/dsd",
        "dataUrl": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources",
        "codelistUrl": "http://faostat3.fao.org:7799/v2/msd/resources/data"
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

    function setColsAndData(cols, data, callB) {
        getCodelists(cols, function (codelists) {
            dataEdit.setColsAndData(cols, codelists, data);
            if (callB) callB();
        });
    }

    function getData() { dataEdit.getData(); }
    function setData(data) { dataEdit.setData(data); }
    function getDistincts() { dataEdit.getDistincts(); }

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
        var conn;
        if (cfg.D3SConnector.servicesUrls)
            conn = new Connector(cfg.D3SConnector);
        else
            conn = new Connector();
        conn.updateDSD(uid, version, dsd, callB);
    }

    function updateData(uid, version, data, callB) {
        var conn;
        if (cfg.D3SConnector)
            conn = new Connector(cfg.D3SConnector);
        else
            conn = new Connector();
        conn.putData(uid, version, data, callB);
    }
    //END Conn

    return {
        init: init,
        setColsAndData: setColsAndData,
        getData: getData,
        setData: setData,
        updateDSD: updateDSD,
        updateData: updateData,
        getColumnsWithDistincts: getColumnsWithDistincts
    }
});