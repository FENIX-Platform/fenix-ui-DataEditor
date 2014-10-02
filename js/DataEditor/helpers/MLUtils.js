//Render - creation
var MLUtils_getAvailableString = function (ml, lang) {
    var lCode = MLUtils_getAvailableLang(ml, lang);
    if (lCode == "")
        return "";
    return ml[lCode];
}

var MLUtils_getAvailableLang = function (ml, lang) {
    if (!ml)
        return "";
    if (!lang)
        lang = 'EN';
    lang = lang.toUpperCase();
    if (lang in ml)
        return lang;
    if ('EN' in ml)
        return 'EN';
    for (var langs in ml)
        return langs;
}

var MLUtils_getAllMultilanguageString = function (ml, divChar) {
    if (!ml)
        return "";
    var toRet = "";
    if (divChar == undefined)
        divChar = ",";
    for (var k in ml)
        if (toRet == "")
            toRet = '[' + k + '] ' + ml[k];
        else
            toRet = toRet + divChar + '[' + k + '] ' + ml[k];
    return toRet;
}
