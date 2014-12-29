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
            'jquery': '../lib/jquery',
            'jqxall' : '../lib/jqxall'
        },
        shim: {
            "jqrangeslider": {
                deps: ["jquery", "jqueryui"]
            },
            "bootstrap": {
                deps: ["jquery"]
            }
        }
    };

    return config;
});