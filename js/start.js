define([
    'jquery',
    'fx-DataEditor/js/DataEditor/DataEditWr',
    'fx-DataEditor/js/DataEditor/dataConnectors/Connector_D3S',
    'domReady!'
], function ($, DataEditWr, Connector) {

    var dataEditWr;
    this.config = {};

    function init(containerID, config, callB) {
        this.config = config;


        dataEditWr = new DataEditWr(config);
        dataEditWr.render($(containerID));

        $("#btnGetData").click(function () {
            dataEditDone(dataEditWr.getData());
        });

        dataEditWr.setCodelistUrlFinder({ get: function (system, version) {
            if (version)
                return "http://faostat3.fao.org/d3s2/v2/msd/resources/" + system + "/" + version;
            else
                return "http://faostat3.fao.org/d3s2/v2/msd/resources/uid/" + system;
        } });

        dataEditWr.setDataLang(localStorage.getItem('locale'));
    }

    function dataEditDone(data) {
        console.log(data);
    }

    function updateDSD(uid, version, dsd, datasource, contextSys, callback) {
        var conn;
        if (this.config.servicesUrls)
            conn = new Connector(this.config.servicesUrls);
        else
            conn = new Connector();
        conn.updateDSD(uid, version, dsd, datasource, contextSys, callB);


        /*var conn = new Connector();
        conn.getMetadata(uid, version, function (meta) {
            if (!meta)
                throw new Error("Cannot find metadata with UID " + uid + " and version " + version);
            conn.updateDSD(meta, dsd ,datasource, contextSys,callback);
        });*/
    }

    function updateData(uid, version, data, callback) {
        var conn;
        if (this.config.servicesUrls)
            conn = new Connector(this.config.servicesUrls);
        else
            conn = new Connector();
        conn.putData(uid, version, data, callback);

        /*var conn = new Connector();
        conn.getMetadata(uid, version, function (meta) {
            if (!meta)
                throw new Error("Cannot find metadata with UID " + uid + " and version " + version);
            conn.putData(meta, data, callback);
        });*/
    }

    return {
        init: init,
        set: function (meta) {
            dataEditWr.setMeta(meta)
        },
        getData: function () {
            return dataEditWr.getData();
        },
        setData:function(data){dataEditWr.setData(data);},
        getDistincts: function () {
            return dataEditWr.getColumnsDistinct();
        },
        updateDSD: updateDSD,
        updateData: updateData,
        getMeta:function()
        {
         return dataEditWr.getMeta();
        }


    }

    /*END Multilang test*/
});