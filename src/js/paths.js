if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    var config = {
        paths: {

            'fx-DataEditor/start' : "../src/js/start",
            "fx-DataEditor/config": "../src/config",
            "fx-DataEditor/js": "../src/js",
            "fx-DataEditor/html": "../src/html",
            "fx-DataEditor/nls": "../src/nls",
            "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'eonasdan-bootstrap-datetimepicker': '{FENIX_CDN}/js/bootstrap-datetimepicker/4.14.30/src/js/bootstrap-datetimepicker',
            'moment': '{FENIX_CDN}/js/moment/2.12.0/min/moment-with-locales.min',

        },
        shim: {
            "bootstrap": {
                deps: ["jquery"]
            },
            'eonasdan-bootstrap-datetimepicker': {
                deps: ['moment', 'bootstrap']
            }

        }
    };

    return config;
});