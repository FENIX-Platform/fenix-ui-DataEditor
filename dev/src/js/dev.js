define([
    'jquery',
    'loglevel',
    '../../../src/js/index',
    '../config/codelist.json' //CountrySTAT_Indicators
], function ($, log, DataEditor, Codelist)
    {
        //var config = {};
        var config = { D3SConnector: { getMetaAndDataUrl: "http://faostat3.fao.org:7799/v2/msd/resources" } };
        var callB = null;
        DataEditor.init("#standard", config, callB);

        //var testCols = { columns: [{ "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "ECO_AgeRange" }] }, "subject": "item", "supplemental": null }, { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null }, { "id": "NUMBER", "title": { "EN": "Value" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }] };
        /*var testCols = [
         { "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "HS|2012" }] }, "subject": "item", "supplemental": null },
         { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "UAE_DOMAINS" }] }, "subject": "time", "supplemental": null },
         { "id": "NUMBER", "title": { "EN": "Value" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }
         ];*/
        var testDSD = [
            //HS
            //{ "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "HS", "version":"2012" }] }, "subject": "item", "supplemental": null },
            //GAUL
            //{ "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "GAUL", "version": "2014" }] }, "subject": "item", "supplemental": null },
            //ECO_Elements
            { "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "CountrySTAT_Indicators" }] }, "subject": "item", "supplemental": null },
            { "id": "YEAR", "title": { "EN": "y" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null },
            { "id": "MONTH", "title": { "EN": "m" }, "key": false, "dataType": "month", "domain": null, "subject": "time", "supplemental": null },
            { "id": "DATE", "title": { "EN": "date" }, "key": false, "dataType": "date", "domain": null, "subject": "time", "supplemental": null },
            { "id": "NUMBER", "title": { "EN": "v" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null },
            { "id": "STRING", "title": { "EN": "string" }, "key": false, "dataType": "text", "subject": "item", "supplemental": null },
            { "id": "BOOL", "title": { "EN": "bool" }, "key": false, "dataType": "bool", "subject": "item", "supplemental": null }
        ];
        //DataEditor.setData([["01063", "2000", 5, "test"]]);
        var testData = [
            ["0105", 2000, '201502', '20150205', 777, "testString1", true],
            ["0201", 2000, '201503', '20150206', 777, "testString2", true]
        ];
        DataEditor.setColumns(testDSD, {'CountrySTAT_Indicators': Codelist}, callB);
        DataEditor.setData(testData);
//        DataEditor.isEditable(true);

        //Editor.loadMetaAndData("dan3", null, function (d) { Editor.setDSDAndData(d.metadata.dsd,d.data,null); })


        $('#btnGetData').click(function () {
            var data = DataEditor.getData();
            var cols = DataEditor.getColumnsWithDistincts();

            $('#DataOutput').html("<h3>Data</h3><code>"+data+"</code><h3>Columns</h3><code>"+JSON.stringify(cols)+"</code>")
        });
/*
        //ML
        $('#btnEN').click(function () {
            var locale = localStorage.getItem('locale');
            if (!locale || locale != 'en')
                localStorage.setItem('locale', 'en');
            location.reload();
        });
        $('#btnFR').click(function () {
            var locale = localStorage.getItem('locale');
            if (!locale || locale != 'fr')
                localStorage.setItem('locale', 'fr');
            location.reload();
        });
        //ML End
*/
    }
);
