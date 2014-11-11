/*global requirejs, define*/

define(function() {

    //Define it as string : string
    //Explicit jquery path!  Don't use a prefix for it
    var paths = {

        'fx-DataEditor/start' : './start',
        "fx-DataEditor/config": "../config",
        "fx-DataEditor/js": "../js",
        "fx-DataEditor/templates": "../templates",
        "fx-DataEditor/multiLang": "../multiLang",
        "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
        'jquery': '../lib/jquery',
        'jqxall': "http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-light"


    };

    var exports = {};

    exports.initialize = function(baseUrl, overridePaths, callback) {

        if(!overridePaths) {
            overridePaths = {};
        }

        if(baseUrl && baseUrl[baseUrl.length - 1] != '/') {
            baseUrl = baseUrl + '/';
        }

        var fullpaths = {};

        for(var path in paths) {
            // Don't add baseUrl to anything that looks like a full URL like 'http://...' or anything that begins with a forward slash
            if(paths[path].match(/^(?:.*:\/\/|\/)/)) {
                fullpaths[path] = paths[path];
            }
            else {
                fullpaths[path] = baseUrl + paths[path];
            }
        }

        var config = {
            paths: fullpaths,
            shim: {
                "jqrangeslider": {
                    deps: ["jquery", "jqueryui"]
                },
                "bootstrap": {
                    deps: ["jquery"]
                }
            }
        };

        for(var pathName in overridePaths) {
            config.paths[pathName] = overridePaths[pathName];
        }

        requirejs.config( config );

        // Do anything else you need to do such as defining more functions for exports
        if(callback) {
            callback();
        }
    };

    return exports;
});