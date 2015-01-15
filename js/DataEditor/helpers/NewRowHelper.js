define(['jquery'],
    function ($) {
        //code: 'code',
        //month: 'month',
        //date: 'date',
        function NewRowHelper() {
        };

        NewRowHelper.prototype.demoRow = function (cols, cLists) {
            var toRet = {};
            if (!cols)
                return toRet;
            for (var c = 0; c < cols.length; c++) {
                switch (cols[c].dataType) {
                    case "year":
                        if (cols[c].domain && cols[c].domain.period)
                            toRet[cols[c].id] = cols[c].domain.period.from;
                        else
                            toRet[cols[c].id] = new Date().getFullYear();
                        break;
                    case "string":
                        toRet[cols[c].id] = "...";
                        break;
                    case "code":
                        if (cols[c].domain.codes[0].idCodeList.codes) {
                            toRet[cols[c].id] = getCode(cLists, cols[c].domain.codes[0].idCodeList, cols[c].domain.codes[0].idCodeList.codes[0]);
                        }
                        else {
                            if (cLists[idCodeList])
                                toRet[cols[c].id] = cLists[idCodeList][0];
                        }
                        break;
                    default: break;
                }
            }
        }

        function getCode(cLists, idCodeList, code) {
            if (!cLists)
                return null;
            if (!cLists[idCodeList])
                return null;
            for (var i = 0; i < cLists[idCodeList].length; i++)
                if (cLists[idCodeList][i].code == code)
                    return cLists[idCodeList][i].code
            return null;
        }

        NewRowHelper.prototype.guessNewRow = function (cols, cLists, data) {
            var toRet = {};
            if (!cols)
                return toRet;
            for (var c = 0; c < cols.length; c++) {
                switch (cols[c].dataType) {
                    case "year":
                        toRet[cols[c].id] = guessYear(c, cols, cLists, data);
                        break;
                    default: break;
                }
            }
            return toRet;
        }

        var guessYear = function (colIdx, cols, cLists, data) {
            return new Date().getFullYear();
        }
        return NewRowHelper;
    });