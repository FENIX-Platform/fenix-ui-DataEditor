/*global  define*/

define(function() {

    var config = {
        paths: {

            'fx-DataEditor/start' : './start',
            "fx-DataEditor/config": "../config",
            "fx-DataEditor/js": "../js",
            "fx-DataEditor/templates": "../templates",
            "fx-DataEditor/multiLang": "../multiLang",
            "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'jqxall': "http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all"
        },
        shim: {
            "bootstrap": {
                deps: ["jquery"]
            }
        }
    };

    return config;
});