define([
    'jquery',
    'fx-DataEditor/js/DataEditor/DataEditWr',
    'fx-DataEditor/js/DataEditor/dataConnectors/D3S_Connector',
    'domReady!'
], function ($, DataEditWr, Connector) {

    var dataEditWr;

    function DataEditor_starter() {
        dataEditWr = new DataEditWr();
        dataEditWr.render($('#DataEditorMainContainer'));

        $("#btnGetData").click(function () {
            dataEditDone(dataEditWr.getData());
        });

        //dataEditWr.setCodelistUrlFinder({ get: function (system, version) { return "http://faostat3.fao.org:7788/msd/cl/system/" + system + "/" + version; } });
        dataEditWr.setCodelistUrlFinder({ get: function (system, version) {
            if (version)
                return "http://faostat3.fao.org/d3s2/v2/msd/resources/" + system + "/" + version;
            else
                return "http://faostat3.fao.org/d3s2/v2/msd/resources/uid/" + system;
        } });

        /*$('#btnEN').click(function () {
         setLang('en');
         });
         $('#btnFR').click(function () {
         setLang('fr');
         });*/
        dataEditWr.setDataLang(localStorage.getItem('locale'));


        /*dataEditWr.setMeta({dsd: {columns: [
         {"id": "CODE", "title": {"EN": "Item"}, "key": true, "dataType": "code", "domain": {"codes": [
         {"idCodeList": "UAE_Elements"}
         ]}, "subject": {"uid": "item"}, "supplemental": {}},
         {"id": "YEAR", "title": {"EN": "Year"}, "key": true, "dataType": "year", "domain": null, "subject": {"uid": "time"}, "supplemental": {}},
         {"id": "NUMBER", "title": {"EN": "Val"}, "key": false, "dataType": "number", "supplemental": {}}
         ]}});*/


        //Test
        //var metaAdapter = { source: { url: 'http://localhost:1031/dataUpload_03/js/z_tmp/dataset_233CPD010.txt'} };
        /*var metaAdapter = { source: { url: 'http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true'} };
         dataEditWr.setMetaAdapter(metaAdapter);
         dataEditWr.setData([
         ["01059", 2000, 4],
         [null, 2001, null]]);*/
        //dataEditWr.setColsAndData(JSON.parse(testDatasetMETA).dsd.columns, JSON.parse(testDatasetDATA));
        //END Test
    }

    function dataEditDone(data) {
        console.log(data);
    }

    /*Multilang test*/
    //var setLang = function (lang) {
    function setLang(lang) {
        var loc = localStorage.getItem('locale');
        var loc = localStorage.getItem('locale');
        if (loc && loc.toUpperCase() == lang)
            return;
        localStorage.setItem('locale', lang.toLowerCase());
        location.reload();

    }

    function updateDSD(uid, version, dsd, datasource, contextSys callback) {
        var conn = new Connector();
        conn.getMetadata(uid, version, function (meta) {
            if (!meta)
                throw new Error("Cannot find metadata with UID " + uid + " and version " + version);
            conn.updateDSD(meta, dsd ,datasource, contextSys,callback);
        });
    }

    function updateData(uid, version, data, callback) {
        var conn = new Connector();
        conn.getMetadata(uid, version, function (meta) {
            if (!meta)
                throw new Error("Cannot find metadata with UID " + uid + " and version " + version);
            conn.putData(meta, data, callback);
        });
    }

    return {
        init: DataEditor_starter,
        set: function (meta) {
            dataEditWr.setMeta(meta)
        },
        getData: function () {
            return dataEditWr.getData();
        },
        setData:function(){dataEditWr.setData();},
        getDistincts: function () {
            return dataEditWr.getColumnsDistinct();
        },
        updateDSD: updateDSD,
        updateData: updateData,
        getMeta:function()
        {
         return dataEditWr.getMeta();
        }


    }

    /*END Multilang test*/
});