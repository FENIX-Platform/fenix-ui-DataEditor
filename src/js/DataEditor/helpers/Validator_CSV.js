define(['jquery',
    './Validator_CSV_Errors',
    './CodelistUtils'
],
    function ($, Err, clUtils) {

        function Validator_CSV() { };

        Validator_CSV.prototype.validate = function (dsdCols, codelists, csvCols, csvData) {

            var toRet = [];

            if (!existHeader(dsdCols, codelists, csvCols)){
                toRet.push({ type: Err.MISSING_DSD_HEADER });
                return toRet;
            }

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

            /*
            for (var i = 0; i < dsdCols.length; i++) {
                if (dsdCols[i].id != csvCols[i]) {
                    toRet.push({ type: Err.WRONG_COLUMN_ID, index: i });
                }
            }

            for (var i = 0; i < dsdCols.length; i++) {
                if (dsdCols[i].dataType == 'code') {
                    var clId = dsdCols[i].domain.codes[0].idCodeList;
                    if (dsdCols[i].domain.codes[0].version) clId += "|" + dsdCols[i].domain.codes[0].version;
                    var unkCodes = this.checkCodes(dsdCols[i], codelists[clId], csvData, i);
                    if (unkCodes.length > 0) {
                        toRet.push({ type: Err.UNKNOWN_CODES, columnId: csvCols[i], codes: unkCodes, codelistId: clId });
                    }
                }
            }
            */

            // CSV Duplicate

            var keys = [];
            var _getConcatenatedKey = function(row, cols) {
                var keys = "";

                $.each(cols, function(index, column){
                    //  log.info(column);
                    if (column.key === true) {
                        //log.info(index,column,row);
                        keys += "-"+(String(row[index]));
                        //log.info(row[index], keys);
                    }
                });
                return keys;
            };

            var findDuplicates = function (arr) {
                var sorted_arr = arr.slice().sort();
                var results = [];
                for (var i = 0; i < arr.length - 1; i++) {
                    if (sorted_arr[i + 1] == sorted_arr[i]) results.push(sorted_arr[i]);
                }
                return results;
            };

            var getAllIndexes = function(arr, val) {
                var indexes = [], i = -1;
                while ((i = arr.indexOf(val, i+1)) != -1){
                    indexes.push(i+1);
                }
                return indexes;
            };

            $.each(csvData, function(index, row){
                keys.push(_getConcatenatedKey(row,dsdCols));
            });

            var duplicates = findDuplicates(keys);

            duplicates = duplicates.filter(function(item, pos) {
                return duplicates.indexOf(item) == pos;
            });

            $.each(duplicates, function(index,object){
                toRet.push({ type: Err.CSV_DUPLICATE, dataIndex: getAllIndexes(keys, object) });
            });

            var row = 0;
            for (var i = 0; i < dsdCols.length; i++) {
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

        Validator_CSV.prototype.validateCodes = function (dsdCols, codelists, csvCols, csvData) {
            var toRet = [];
            if (csvData == null || csvData.length == 0)
                return toRet;
            if (csvCols == null || csvCols.length == 0)
                return toRet;

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
            return toRet;
        };

        function existHeader(dsdCols, codelists, csvCols) {
            var value = true;
            $.each(csvCols, function(index,object){
                if ((object.length > 0)&&(typeof (object) === 'string')) {
                    if (dsdCols.length > index)
                        switch(dsdCols[index].dataType) {
                        case 'code':
                            $.each(codelists, function(i,o){
                                $.each(o.data, function (idx, obj){
                                    if (object == obj.code) value = false;
                                });
                            });
                            break;
                    }
                } else {
                    value = false;
                }
            });
            return value;
        }

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
            //console.log('isInCodelist', cl, code);
            var clU = new clUtils();
            var found = clU.findCodeInCodelist(code, cl);
            if (found == null) return false;
            return true;
            /*var isIn = isInNode(cl.data, code);
            return isIn;*/
        };
        
        /*function isInNode(arr, code) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].code == code) {
                    return true;
                }
            }

            var res = false;
            for (i = 0; i < arr.length; i++)
                if (arr[i].children)
                    res = res || isInNode(arr[i].children, code);

            return res;
        };*/


        return new Validator_CSV();
    })