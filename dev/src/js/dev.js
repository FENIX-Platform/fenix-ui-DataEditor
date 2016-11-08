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

        /* Testing CSV Upload
        var ksad = new DataEditor.Columns_Match();
        ksad.render($('#divCsvMatcher'));
        var one = [{"dataType":"date","title":{"EN":"Nano"},"values":{},"subject":"time","key":true,"id":"DIMENSION0"},{"dataType":"number","title":{"EN":"value"},"subject":"value","key":false,"id":"VALUE0"}];
        var two = ["20161025","1"];
        var thr = [["20161025","2"],["20161025","3"],["20161025","4"],["20161025","1000"]];
        ksad.setData(one, two, thr);
        */

        $('#btnGetData').click(function () {
            var data = DataEditor.getData();
            var cols = DataEditor.getColumnsWithDistincts();

            $('#DataOutput').html("<h3>Data</h3><code>"+data+"</code><h3>Columns</h3><code>"+JSON.stringify(cols)+"</code>")
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
