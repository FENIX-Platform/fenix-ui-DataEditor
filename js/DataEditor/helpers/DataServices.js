define(['jquery'],
function ($) {

    var DataServices = function () {
        this.WS_GetCodelist = "http://hqlprfenixapp2.hq.un.fao.org:7777/msd/cl/system/";
    };

    DataServices.prototype.getCodelist = function (system, version, callB) {
        $.getJSON(this.WS_GetCodelist + system + '/' + version, function (data) { callB(data); });
    }
    DataServices.prototype.getCodeListWebServiceAddress = function (system, version) {
        return this.WS_GetCodelist + system + '/' + version;
    }

    return DataServices;
});