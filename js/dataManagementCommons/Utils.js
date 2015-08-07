define(['jquery'
],
    function ($) {
        var defConfig = { fallbackLang: 'EN' };

        function Utils(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
        };

        Utils.prototype.getAvailableString = function (MLString, lang) {
            if (!MLString)
                return "";
            //If foud return it
            if (MLString[lang])
                return MLString[lang];
            var fBack = "";
            var avail = "";
            for (lCode in MLString) {
                //Checks if the string's case is wrong 
                if (lCode.toUpperCase() == lang.toUpperCase())
                    return MLString[lCode];
                //While looping also check if the fallback lang is available
                if (lCode.toUpperCase() == this.config.fallbackLang)
                    fBack = MLString[lCode];
                //While looping keep the 1st one
                if (avail === "")
                    avail = MLString[lCode];
            }
            //If here then the lang is not available.
            //Return the fallback lang if available
            if (fBack != "")
                return fBack;
            //return whatever is available
            return avail;
        };
        return new Utils();
    })