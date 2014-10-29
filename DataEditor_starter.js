﻿var locale = localStorage.getItem('locale' || 'en-us');
// Place third party dependencies in the lib folder
requirejs.config({
    config: { i18n: { locale: locale} },
    "baseUrl": "lib",
    "paths": {
        config: "../config",
        js: "../js",
        templates: "../templates",
        multiLang: "../multiLang",
        root: ".."
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

        //dataEditWr.setCodelistUrlFinder({ get: function (system, version) { return "http://faostat3.fao.org:7788/msd/cl/system/" + system + "/" + version; } });
        dataEditWr.setCodelistUrlFinder({ get: function (system, version) { return "http://faostat3.fao.org:7799/v2/msd/resources/" + system + "/" + version; } });

        $('#btnEN').click(function () { setLang('en'); });
        $('#btnFR').click(function () { setLang('fr'); });
        dataEditWr.setDataLang(localStorage.getItem('locale'));

        /*Test*/
        //var metaAdapter = { source: { url: 'http://localhost:1031/dataUpload_03/js/z_tmp/dataset_233CPD010.txt'} };
        var metaAdapter = { source: { url: 'http://faostat3.fao.org:7799/v2/msd/resources/metadata/dan2/1.0?dsd=true'} };
        dataEditWr.setMetaAdapter(metaAdapter);
        //dataEditWr.setColsAndData(JSON.parse(testDatasetMETA).dsd.columns, JSON.parse(testDatasetDATA));
        /*END Test*/

        
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
    /*END Multilang test*/
});