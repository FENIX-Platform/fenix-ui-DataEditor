if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['jquery'],
    function ($) {

        function CodelistUtils() {
        };

        CodelistUtils.prototype.findCodeInCodelist = function (code, codelist) {
            var found = isInNode(codelist.data, code);
            return found;
        }

        function isInNode(arr, code) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].code == code) {
                    return arr[i];
                }
            }

            var res = null;
            for (i = 0; i < arr.length; i++) {
                if (res != null)
                    break;
                if (arr[i].children) {
                    res = isInNode(arr[i].children, code);
                }
            }

            return res;
        };

        return CodelistUtils;
    });