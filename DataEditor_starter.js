// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl": "lib",
    "paths": {
        config: "../config",
        js: "../js",
        templates: "../templates",
        multiLang:"../multiLang",
        root:".."
    }
});

require([
'jquery',
'js/DataEditor/DataEditWr',
'text!root/testData/dataset_233CPD010.txt',
'text!root/testData/data_233CPD010.txt',
'domReady!'
], function ($, DataEditWr, testDatasetMETA, testDatasetDATA) {

    DataEditor_starter();

    function DataEditor_starter() {
        var dataEditWr = new DataEditWr();
        dataEditWr.render($('#mainContainer'));

        dataEditWr.setCodelistUrlFinder({ get: function (system, version) { return "http://faostat3.fao.org:7788/msd/cl/system/" + system + "/" + version; } });


        /*Test*/
        //var metaAdapter = { source: { url: 'http://localhost:1031/dataUpload_03/js/z_tmp/dataset_233CPD010.txt'} };
        //dataEditWr.setMetaAdapter(metaAdapter);
        dataEditWr.setColsAndData(JSON.parse(testDatasetMETA).dsd.columns, JSON.parse(testDatasetDATA));
        /*END Test*/
    }
});