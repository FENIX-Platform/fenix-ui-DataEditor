require([
    './paths'
], function (DataEditor) {
    // NOTE: This setTimeout() call is used because, for whatever reason, if you make
    // a 'require' call in here or in the Cart without it, it will just hang
    // and never actually go fetch the files in the browser. There's probably a
    // better way to handle this, but I don't know what it is.
    setTimeout(function () {
        /*
         @param: prefix of Components paths to reference them also in absolute mode
         @param: paths to override
         @param: callback function
         */
        DataEditor.initialize('./', null, function () {
            require([
                'fx-DataEditor/start'
            ], function (Editor) {
                //var config = {};
                var config = { D3SConnector: { getMetaAndDataUrl: "http://faostat3.fao.org:7799/v2/msd/resources" } };
                var callB = null;
                Editor.init("#mainContainer", config, callB);

                //var testCols = { columns: [{ "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "ECO_AgeRange" }] }, "subject": "item", "supplemental": null }, { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null }, { "id": "NUMBER", "title": { "EN": "Value" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }] };
                /*var testCols = [
                    { "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "HS|2012" }] }, "subject": "item", "supplemental": null },
                    { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "UAE_DOMAINS" }] }, "subject": "time", "supplemental": null },
                    { "id": "NUMBER", "title": { "EN": "Value" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }
                ];*/
                var testCols = [
                    { "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "HS", "version":"2012" }] }, "subject": "item", "supplemental": null },
                    //{ "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "GAUL", "version": "2014" }] }, "subject": "item", "supplemental": null },
                    //{ "id": "CODE", "title": { "EN": "i" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "ECO_Elements" }] }, "subject": "item", "supplemental": null },
                    { "id": "YEAR", "title": { "EN": "y" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null },
                    { "id": "NUMBER", "title": { "EN": "v" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null },
                    { "id": "STRING", "title": { "EN": "string" }, "key": false, "dataType": "string", "subject": "item", "supplemental": null }
                ];
                //Editor.setData([["2312", "2000", 5, "test"]]);
                Editor.setDSD({ columns: testCols }, callB);
                Editor.setData([["01063", "2000", 5, "test"]]);

                //Editor.loadMetaAndData("dan3", null, function (d) { Editor.setDSDAndData(d.metadata.dsd,d.data,null); })


                $('#btnGetData').click(function () {
                    var data = Editor.getData();
                    var cols = Editor.getDSDWithDistincts();

                    console.log("data");
                    console.log(data);
                    console.log("cols");
                    console.log(cols);
                });

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
            });
        });
    }, 0);
});