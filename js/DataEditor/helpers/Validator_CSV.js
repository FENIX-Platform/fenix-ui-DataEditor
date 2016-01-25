define(['jquery',
    'fx-DataEditor/js/DataEditor/helpers/Validator_CSV_Errors',
],
    function ($, Err) {

        function Validator_CSV() { };

        Validator_CSV.prototype.validate = function (dsdCols, codelists, csvCols, csvData) {
            var toRet = [];

            if (!dsdCols) {
                toRet.push({ type: Err.DSD_COLUMNS_NULL });
                return toRet;
            }
            if (!csvCols) {
                toRet.push({ type: Err.CSV_COLUMNS_NULL });
                return toRet;
            }
            if (dsdCols.length != csvCols.length) {
                toRet.push({ type: Err.WRONG_COLUMN_COUNT });
                return toRet;
            }
            for (var i = 0; i < dsdCols.length; i++) {
                if (dsdCols[i].id != csvCols[i]) {
                    toRet.push({ type: Err.WRONG_COLUMN_ID, index: i });
                }
            }

            for (i = 0; i < dsdCols.length; i++) {
                if (dsdCols[i].dataType == 'code') {
                    var clId = dsdCols[i].domain.codes[0].idCodeList;
                    if (dsdCols[i].domain.codes[0].version)
                        clId += "|" + dsdCols[i].domain.codes[0].version;
                    var unkCodes = this.checkCodes(dsdCols[i], codelists[clId], csvData, i);
                    if (unkCodes.length > 0) {
                        toRet.push({ type: Err.UNKNOWN_CODES, columnId: csvCols[i], codes: unkCodes, codelistId: clId });
                    }
                }
            }

            var row = 0;
            for (i = 0; i < dsdCols.length; i++) {
                if (nullOnEmpty(dsdCols[i].dataType)) {
                    for (row = 0; row < csvData.length; row++) {
                        if (csvData[row][i] == "") {
                            csvData[row][i] = null;
                        }
                    }
                }
            }
            return toRet;
        };

        function nullOnEmpty(dataType) {
            if (dataType == 'code')
                return true;
            if (dataType == 'number')
                return true;
            if (dataType == 'pecentage')
                return true;
            return false;
        }

        Validator_CSV.prototype.checkCodes = function (dsdCol, cl, csvData, index) {
            var unkCodes = [];
            for (var i = 0; i < csvData.length; i++) {
                if (csvData[i][index]) {
                    var isIn = isInCodelist(cl, csvData[i][index]);
                    if (!isIn) {
                        var uCode = csvData[i][index];
                        if ($.inArray(uCode, unkCodes) == -1)
                            unkCodes.push(uCode);
                    }
                }
            }
            return unkCodes;
        };

        function isInCodelist(cl, code) {
            return isInNode(cl.data, code);
        };
        function isInNode(arr, code) {
            for (var i = 0; i < arr.length; i++)
                if (arr[i].code == code)
                    return true;

            var res = false;
            for (i = 0; i < arr.length; i++)
                if (arr[i].children)
                    res = res || isInNode(arr[i].children, code);
            return res;
        };


        return new Validator_CSV();
    })