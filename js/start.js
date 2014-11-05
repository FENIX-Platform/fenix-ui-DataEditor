define([
    'jquery',
    'fx-DataEditor/js/DataEditor/DataEditWr',
    'domReady!'
], function ($, DataEditWr) {

    var dataEditWr;

    function DataEditor_starter() {
        dataEditWr = new DataEditWr();
        dataEditWr.render($('#DataEditorMainContainer'));

        $("#btnGetData").click(function () {
            dataEditDone(dataEditWr.getData());
        });

        //dataEditWr.setCodelistUrlFinder({ get: function (system, version) { return "http://faostat3.fao.org:7788/msd/cl/system/" + system + "/" + version; } });
        dataEditWr.setCodelistUrlFinder({ get: function (system, version) {
            return "http://faostat3.fao.org:7799/v2/msd/resources/" + system + "/" + version;
        } });

        /*$('#btnEN').click(function () {
         setLang('en');
         });
         $('#btnFR').click(function () {
         setLang('fr');
         });*/
        dataEditWr.setDataLang(localStorage.getItem('locale'));

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
        if (loc && loc.toUpperCase() == lang)
            return;
        localStorage.setItem('locale', lang.toLowerCase());
        location.reload();

    }

    return { init: DataEditor_starter,
        set: function (id) {
            console.log(id)
            dataEditWr.setMeta(id);
        }
    };

    /*END Multilang test*/
});