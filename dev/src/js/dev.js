define([
    'jquery',
    'loglevel',
    '../../../src/js/index',
    '../config/test_cl.json',
    '../config/test_data.json',
    '../config/test_dsd.json'
], function ($, log, DataEditor, TestCL, TestData, TestDSD)
    {
        //var config = {};
        var config = {
            lang: 'EN',
            D3SConnector: { getMetaAndDataUrl: "http://faostat3.fao.org:7799/v2/msd/resources" }
        };

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

        require("../../../node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css");



        var callB = null;
        DataEditor.init("#standard", config, callB);
        DataEditor.isEditable(false);
        DataEditor.setColumns(TestDSD, TestCL, function() {
            DataEditor.setData(TestData, 10);
        });

        DataEditor.on("data:loaded", function(){
            console.log(' data loaded ');
        });

        /* Testing CSV Upload
        var ksad = new DataEditor.Columns_Match();
        ksad.render($('#divCsvMatcher'));
        var one = [{"dataType":"date","title":{"EN":"Nano"},"values":{},"subject":"time","key":true,"id":"DIMENSION0"},{"dataType":"number","title":{"EN":"value"},"subject":"value","key":false,"id":"VALUE0"}];
        var two = ["20161025","1"];
        var thr = [["20161025","2"],["20161025","3"],["20161025","4"],["20161025","1000"]];
        ksad.setData(one, two, thr);
        */

        $('#btnGetData').click(function () {
            /*
            var data = DataEditor.getData();
            var cols = DataEditor.getColumnsWithDistincts();

            $('#DataOutput').html("<h3>Data</h3><code>"+data+"</code><h3>Columns</h3><code>"+JSON.stringify(cols)+"</code>")
            */
            var csv = 'Anne,Indicateur code,Produit (code),Value,UM code,Flag\r\n2011,0101,02954.02,4887.1128,0103,\r\n2011,0101,02953.04,832.098,0103,\r\n2011,0101,02951.05,1470.8328,0103,\r\n2010,0101,02954.02,4427.3372,0103,\r\n2010,0101,02953.04,689.774,0103,\r\n2010,0101,02951.05,1291.9032,0103,\r\n2009,0101,02954.02,4307.2955,0103,\r\n2009,0101,02953.04,660.3515,0103,\r\n2009,0101,02951.05,1239.288,0103,\r\n2008,0101,02954.02,3936.4864,0103,';
        });

        $('#btnToggleEdit').click(function() {
            var value = DataEditor.isEditable();
            DataEditor.isEditable(!value);
        });

        $('#btnStatusLoading').click(function(){
            DataEditor.setStatus('loading');
        });

    }
);
