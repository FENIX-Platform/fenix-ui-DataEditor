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
        console.log(DataEditor.CSV_To_Dataset());
        //var testCols = { columns: [{ "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "ECO_AgeRange" }] }, "subject": "item", "supplemental": null }, { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "year", "domain": null, "subject": "time", "supplemental": null }, { "id": "NUMBER", "title": { "EN": "Value" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }] };
        /*var testCols = [
         { "id": "CODE", "title": { "EN": "Item" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "HS|2012" }] }, "subject": "item", "supplemental": null },
         { "id": "YEAR", "title": { "EN": "Year" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "UAE_DOMAINS" }] }, "subject": "time", "supplemental": null },
         { "id": "NUMBER", "title": { "EN": "Value" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }
         ];*/
        var testDSD = [{"dataType":"code","title":{"EN":"Topic"},"values":{"codes":[{"version":"2.0","idCodeList":"UNECA_ClassificationOfActivities","codes":[{"code":"0103","label":{"EN":"Health"}}],"extendedName":{"EN":"UNECA Classification of Activities -Domains, topics and indicators"}}]},"domain":{"codes":[{"version":"2.0","idCodeList":"UNECA_ClassificationOfActivities","extendedName":{"EN":"UNECA Classification of Activities -Domains, topics and indicators"}}]},"key":false,"id":"TopicCode"},{"dataType":"code","title":{"EN":"Indicator"},"values":{"codes":[{"version":"2.0","idCodeList":"UNECA_ClassificationOfActivities","codes":[{"code":"010301","label":{"EN":"Percentage of children under-five and underweight"}},{"code":"010302","label":{"EN":"Prevalence of undernourishment"}},{"code":"010303","label":{"EN":"Under five mortality rate (both sexes) per 1,000"}},{"code":"010304","label":{"EN":"Infant mortality rate (both sexes) per 1,000"}},{"code":"010307","label":{"EN":"Percentage of children provided the vaccines (BCG)"}},{"code":"010308","label":{"EN":"Percentage of children provided the vaccines (DPT3)"}},{"code":"010309","label":{"EN":"Percentage of children provided the vaccines (Polio)"}},{"code":"010310","label":{"EN":"Percentage of children provided the vaccines (Measles)"}},{"code":"010311","label":{"EN":"Percentage of mothers provided at least one antenatal care"}},{"code":"010312","label":{"EN":"Percentage of deliveries attended by skilled health personnel"}},{"code":"010313","label":{"EN":"Number of doctors per 10,000 population"}},{"code":"010314","label":{"EN":"Number of nurses and Midwives per 10,000 population"}},{"code":"010315","label":{"EN":"Hospital beds - Total (per 10 000 population)"}},{"code":"010316","label":{"EN":"Births registered (per 1 000)"}},{"code":"010317","label":{"EN":"Deaths registered (per 1 000)"}}],"extendedName":{"EN":"UNECA Classification of Activities -Domains, topics and indicators"}}]},"domain":{"codes":[{"version":"2.0","idCodeList":"UNECA_ClassificationOfActivities","extendedName":{"EN":"UNECA Classification of Activities -Domains, topics and indicators"}}]},"subject":"item","key":true,"id":"IndicatorCode"},{"dataType":"code","title":{"EN":"Country"},"values":{"codes":[{"idCodeList":"UNECA_ISO3","codes":[{"code":"AGO","label":{"FR":"Angola","EN":"Angola"}},{"code":"BDI","label":{"FR":"Burundi","EN":"Burundi"}},{"code":"BEN","label":{"FR":"Bénin","EN":"Benin"}},{"code":"BFA","label":{"FR":"Burkina Faso","EN":"Burkina Faso"}},{"code":"BWA","label":{"FR":"Botswana","EN":"Botswana"}},{"code":"CAF","label":{"FR":"République Centrafricaine","EN":"Central African Republic"}},{"code":"CIV","label":{"FR":"Côte d'Ivoire","EN":"Cote d'Ivoire"}},{"code":"CMR","label":{"FR":"Cameroun","EN":"Cameroon"}},{"code":"COD","label":{"FR":"République Démocratique du Congo","EN":"Democratic Republic of the Congo"}},{"code":"COG","label":{"FR":"Congo","EN":"Congo"}},{"code":"COM","label":{"FR":"Comores","EN":"Comoros"}},{"code":"CPV","label":{"FR":"Cap-Vert","EN":"Cabo Verde"}},{"code":"DJI","label":{"FR":"Djibouti","EN":"Djibouti"}},{"code":"DZA","label":{"FR":"Algérie","EN":"Algeria"}},{"code":"EGY","label":{"FR":"Egypte","EN":"Egypt"}},{"code":"ERI","label":{"FR":"Erythrée","EN":"Eritrea"}},{"code":"ETH","label":{"FR":"Ethiopie","EN":"Ethiopia"}},{"code":"GAB","label":{"FR":"Gabon","EN":"Gabon"}},{"code":"GHA","label":{"FR":"Ghana","EN":"Ghana"}},{"code":"GIN","label":{"FR":"Guinée","EN":"Guinea"}},{"code":"GMB","label":{"FR":"Gambie","EN":"Gambia"}},{"code":"GNB","label":{"FR":"Guinée-Bissau","EN":"Guinea-Bissau"}},{"code":"GNQ","label":{"FR":"Guinée équatoriale","EN":"Equatorial Guinea"}},{"code":"KEN","label":{"FR":"Kenya","EN":"Kenya"}},{"code":"LBR","label":{"FR":"Libéria","EN":"Liberia"}},{"code":"LBY","label":{"FR":"Libye","EN":"Libya"}},{"code":"LSO","label":{"FR":"Lesotho","EN":"Lesotho"}},{"code":"MAR","label":{"FR":"Maroc","EN":"Morocco"}},{"code":"MDG","label":{"FR":"Madagascar","EN":"Madagascar"}},{"code":"MLI","label":{"FR":"Mali","EN":"Mali"}},{"code":"MOZ","label":{"FR":"Mozambique","EN":"Mozambique"}},{"code":"MRT","label":{"FR":"Mauritanie","EN":"Mauritania"}},{"code":"MUS","label":{"FR":"Maurice","EN":"Mauritius"}},{"code":"MWI","label":{"FR":"Malawi","EN":"Malawi"}},{"code":"NAM","label":{"FR":"Namibie","EN":"Namibia"}},{"code":"NER","label":{"FR":"Niger","EN":"Niger"}},{"code":"NGA","label":{"FR":"Nigéria","EN":"Nigeria"}},{"code":"RWA","label":{"FR":"Rwanda","EN":"Rwanda"}},{"code":"SDN","label":{"FR":"Soudan","EN":"Sudan"}},{"code":"SEN","label":{"FR":"Sénégal","EN":"Senegal"}},{"code":"SLE","label":{"FR":"Sierra Leone","EN":"Sierra Leone"}},{"code":"SOM","label":{"FR":"Somalie","EN":"Somalia"}},{"code":"SSD","label":{"FR":"Soudan du Sud","EN":"South Sudan"}},{"code":"STP","label":{"FR":"Sao Tomé-et-Principe","EN":"Sao Tome and Principe"}},{"code":"SWZ","label":{"FR":"Swaziland","EN":"Swaziland"}},{"code":"SYC","label":{"FR":"Seychelles","EN":"Seychelles"}},{"code":"TCD","label":{"FR":"Tchad","EN":"Chad"}},{"code":"TGO","label":{"FR":"Togo","EN":"Togo"}},{"code":"TUN","label":{"FR":"Tunisie","EN":"Tunisia"}},{"code":"TZA","label":{"FR":"Tanzanie, République Unie de","EN":"United Republic of Tanzania"}},{"code":"UGA","label":{"FR":"Ouganda","EN":"Uganda"}},{"code":"ZAF","label":{"FR":"Afrique du Sud","EN":"South Africa"}},{"code":"ZMB","label":{"FR":"Zambie","EN":"Zambia"}},{"code":"ZWE","label":{"FR":"Zimbabwe","EN":"Zimbabwe"}}],"extendedName":{"EN":"UNECA Country Codes"}}]},"domain":{"codes":[{"idCodeList":"UNECA_ISO3","extendedName":{"EN":"UNECA Country Codes"}}]},"subject":"geo","key":true,"id":"CountryCode"},{"dataType":"year","title":{"EN":"Year"},"values":{"timeList":[2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013]},"subject":"time","key":true,"id":"Year"},{"dataType":"number","title":{"EN":"Value"},"subject":"value","key":false,"id":"Value"},{"dataType":"code","title":{"EN":"Unit of measurement"},"values":{"codes":[{"idCodeList":"UNECA_UnitMeasure","codes":[{"code":"NA","label":{"EN":"NA"}},{"code":"perc"}],"extendedName":{"EN":"UNECA - Unit of measure"}}]},"domain":{"codes":[{"idCodeList":"UNECA_UnitMeasure","extendedName":{"EN":"UNECA - Unit of measure"}}]},"subject":"um","key":false,"id":"Unit"},{"dataType":"text","title":{"EN":"Topic"},"virtual":false,"transposed":false,"key":false,"id":"TopicCode_EN"},{"dataType":"text","title":{"EN":"Indicator"},"virtual":false,"transposed":false,"key":false,"id":"IndicatorCode_EN"},{"dataType":"text","title":{"EN":"Country"},"virtual":false,"transposed":false,"key":false,"id":"CountryCode_EN"},{"dataType":"text","title":{"EN":"Unit of measurement"},"virtual":false,"transposed":false,"key":false,"id":"Unit_EN"}];
        //DataEditor.setData([["01063", "2000", 5, "test"]]);
/*
        var testData = [
            ["0105", 2000, '201502', '20150205', 777, "testString1", true],
            ["0201", 2000, '201503', '20150206', 777, "testString2", true]
        ];
*/
        DataEditor.isEditable(false);
        DataEditor.setColumns(testDSD, Codelist, callB);
        //DataEditor.setData(testData);


        $('#btnGetData').click(function () {
            var data = DataEditor.getData();
            var cols = DataEditor.getColumnsWithDistincts();

            $('#DataOutput').html("<h3>Data</h3><code>"+data+"</code><h3>Columns</h3><code>"+JSON.stringify(cols)+"</code>")
        });

        $('#btnToggleEdit').click(function() {
            var value = DataEditor.isEditable();
            DataEditor.isEditable(!value);
        });



    }
);
