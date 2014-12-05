//Config
/*


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

        /*//dataEditWr.setCodelistUrlFinder({ get: function (system, version) { return "http://faostat3.fao.org:7788/msd/cl/system/" + system + "/" + version; } });
        dataEditWr.setCodelistUrlFinder({
            get: function (system, version) {
                return "http://faostat3.fao.org:7799/v2/msd/resources/" + system + "/" + version;
            }
        });

        //TEST
        //var metaAdapter = { source: { url: 'http://localhost:1031/dataUpload_03/js/z_tmp/dataset_233CPD010.txt'} };
        var metaAdapter = { source: { url: 'http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true' } };
        dataEditWr.setMetaAdapter(metaAdapter);
        dataEditWr.setData([
            ["01059", 2000, 4],
            [null, 2001, null]]);
        //dataEditWr.setColsAndData(JSON.parse(testDatasetMETA).dsd.columns, JSON.parse(testDatasetDATA));
        //END Test*/
    }

    function setColsAndData(cols, data, callB) {
        getCodelists(cols, function (codelists) {
            dataEdit.setColsAndData(cols, codelists, data);
            if (callB) callB();
        });
    }

    function getData() {
        dataEdit.getData();
    }

    function getCodelists(cols, callB) {
        if (!cols)
            return null;
        if (cfg.servicesUrls)
            var conn = new Connector(cfg.servicesUrls);

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

    return {
        init: init,
        setColsAndData: setColsAndData,
        getData:getData
    }
});

/*define([
    'jquery',
    'fx-DataEditor/js/DataEditor/DataEditWr',
    'domReady!'
], function ($, DataEditWr) {


    function DataEditor_starter() {
        var dataEditWr = new DataEditWr();
        dataEditWr.render($('#mainContainer'));

        $("#btnGetData").click(function () {
            dataEditDone(dataEditWr.getData());
        });

        //dataEditWr.setCodelistUrlFinder({ get: function (system, version) { return "http://faostat3.fao.org:7788/msd/cl/system/" + system + "/" + version; } });
        dataEditWr.setCodelistUrlFinder({ get: function (system, version) {
            return "http://faostat3.fao.org:7799/v2/msd/resources/" + system + "/" + version;
        } });

        $('#btnEN').click(function () {
            setLang('en');
        });
        $('#btnFR').click(function () {
            setLang('fr');
        });
        dataEditWr.setDataLang(localStorage.getItem('locale'));

        //TEST
        //var metaAdapter = { source: { url: 'http://localhost:1031/dataUpload_03/js/z_tmp/dataset_233CPD010.txt'} };
        var metaAdapter = { source: { url: 'http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true'} };
        dataEditWr.setMetaAdapter(metaAdapter);
        dataEditWr.setData([
            ["01059", 2000, 4],
            [null, 2001, null]]);
        //dataEditWr.setColsAndData(JSON.parse(testDatasetMETA).dsd.columns, JSON.parse(testDatasetDATA));
        //END Test


    }

    function dataEditDone(data) {
        console.log(data);
    }

    //Multilang test
    //var setLang = function (lang) {
    function setLang(lang) {
        var loc = localStorage.getItem('locale');
        if (loc && loc.toUpperCase() == lang)
            return;
        localStorage.setItem('locale', lang.toLowerCase());
        location.reload();

    }

    return {init:DataEditor_starter}

    //END Multilang test
});
*/