define([
    'jquery',
    'loglevel',
    '../../../src/js/index'
], function ($, log, DataEditor)
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
        var testCols = [
            //HS
            //{ "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "HS", "version":"2012" }] }, "subject": "item", "supplemental": null },
            //GAUL
            //{ "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "GAUL", "version": "2014" }] }, "subject": "item", "supplemental": null },
            //ECO_Elements
            { "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "ECO_Elements" }] }, "subject": "item", "supplemental": null },
            { "id": "YEAR", "title": { "EN": "y" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null },
            { "id": "MONTH", "title": { "EN": "m" }, "key": false, "dataType": "month", "domain": null, "subject": "time", "supplemental": null },
            { "id": "DATE", "title": { "EN": "date" }, "key": false, "dataType": "date", "domain": null, "subject": "time", "supplemental": null },
            { "id": "NUMBER", "title": { "EN": "v" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null },
            { "id": "STRING", "title": { "EN": "string" }, "key": false, "dataType": "string", "subject": "item", "supplemental": null },
            { "id": "BOOL", "title": { "EN": "bool" }, "key": false, "dataType": "boolean", "subject": "item", "supplemental": null }
        ];

        //DataEditor.setDSD({ columns: testCols }, callB);
        //Editor.setData([["01063", "2000", 5, "test"]]);
        var data = [
            ["434", 2000, '201502', '20150205', 777, "testString", true],
            ["152", 2000, '201503', '20150206', 777, "testString", true]
        ];
        DataEditor.setData(data);
        DataEditor.isEditable(true);


        //Editor.loadMetaAndData("dan3", null, function (d) { Editor.setDSDAndData(d.metadata.dsd,d.data,null); })


        $('#btnGetData').click(function () {
            var data = Editor.getData();
            var cols = Editor.getDSDWithDistincts();

            console.log("data");
            console.log(data);
            console.log("cols");
            console.log(cols);
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
