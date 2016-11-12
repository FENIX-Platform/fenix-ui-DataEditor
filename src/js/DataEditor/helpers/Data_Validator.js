define(['jquery',
    'loglevel',
    './CodelistUtils'
],
    function ($, log, clUtils) {

        var MSG_NULL_KEY = 'nullKey';
        var MSG_SAME_KEY_VALS = 'sameKeyVals';
        var MSG_UNKNOWN_CODE = 'unknownCode';
        var MSG_INVALID_YEAR = 'invalidYear';
        var MSG_INVALID_MONTH = 'invalidMonth';
        var MSG_INVALID_DATE = 'invalidDate';
        var MSG_INVALID_NUMBER = 'invalidNumber';
        var MSG_INVALID_BOOL = 'invalidBool';

        //Columns/headers validation
        function Data_Validator() { };

        Data_Validator.prototype.validate = function (cols, codelists, data) {
            var toRet = [];

            var emptyKeyVals = this.checkEmptyKeyVals(cols, data);
            var duplicateKeyVals = this.checkDuplicateKeyVals(cols, data);
            var wrongDataTypes = this.checkWrongDataTypes(cols, codelists, data);
            var valueFlags = this.checkValueFlags();

            if (emptyKeyVals && emptyKeyVals.length > 0)
                arrConcat(toRet, emptyKeyVals);
            if (duplicateKeyVals && duplicateKeyVals.length > 0)
                arrConcat(toRet, duplicateKeyVals);
            if (wrongDataTypes && wrongDataTypes.length > 0)
                arrConcat(toRet, wrongDataTypes);
            if (valueFlags && valueFlags.length > 0)
                arrConcat(toRet, valueFlags);

            return toRet;
        }

        Data_Validator.prototype.checkEmptyKeyVals = function (cols, data) {
            if (!cols || !data)
                return null;
            var toRet = [];
            for (var i = 0; i < data.length; i++)
                for (var c = 0; c < cols.length; c++) {
                    if (cols[c].key) {
                        if (!data[i][c])
                            toRet.push({ error: MSG_NULL_KEY, colId: cols[c].id, dataIndex: i });
                    }
                }

            return toRet;
        }

        Data_Validator.prototype.checkDuplicateKeyVals = function (cols, data) {
            if (!cols || !data)
                return null;

            var toRet = [];

            for (var r1 = 0; r1 < data.length - 1; r1++)
                for (var r2 = r1 + 1; r2 < data.length; r2++)
                    if (sameDimVals(data[r1], data[r2], cols)) {
                        toRet.push({ error: MSG_SAME_KEY_VALS, dataIndex: r1 });
                        toRet.push({ error: MSG_SAME_KEY_VALS, dataIndex: r2 });
                    }

            return toRet;
        }

        var sameDimVals = function (row1, row2, cols) {
            for (var d = 0; d < cols.length; d++) {
                if (cols[d].key)
                    if (row1[d] != row2[d]) {
                        return false;
                    }
            }
            return true;
        }

        Data_Validator.prototype.checkWrongDataTypes = function (cols, codelists, data) {
//            log.info('checkWrongDataTypes',cols, codelists, data);
            if (!cols || !data) return null;

            var toRet = [];
            for (var i = 0; i < data.length; i++) {
                arrConcat(toRet, checkRowDataTypes(cols, codelists, data[i], i));
            }
            return toRet;

            /*var colInfo = {};
            for (var c = 0; c < cols.length; c++) 

                if (cols[c].dataType)
                    colInfo[cols[c].id] = { dataType: cols[c].dataType, domain: cols[c].domain, codes: cols[c].codes };
            }
            var toRet = [];
            for (var i = 0; i < data.length; i++) {
                arrConcat(toRet, checkRowDataTypes(colInfo, data[i], i));
            }
            return toRet;*/
        }

        var checkRowDataTypes = function (cols, codelists, dataRow, rowIdx) {
//            log.info('checkRowDataTypes', cols, codelists, dataRow, rowIdx);
            var toRet = [];
            for (var d = 0; d < cols.length; d++) {
                //log.info('checkRowDataTypes [for]', d, cols[d], dataRow[d], rowIdx);
                switch (cols[d].dataType) {
                    case 'code':
                        var cListUID = cols[d].domain.codes[0].idCodeList;
                        //log.info('code >',cListUID);
                        if (cols[d].domain.codes[0].version)
                            cListUID = cListUID + "|" + cols[d].domain.codes[0].version;
                        if (!checkCode(dataRow[d], codelists[cListUID], cols[d]))
                            toRet.push({ error: MSG_UNKNOWN_CODE, dataIndex: rowIdx, colId: cols[d].id });
                        break;
                    case 'year':
                        if (!checkYear(dataRow[d]))
                            toRet.push({ error: MSG_INVALID_YEAR, dataIndex: rowIdx, colId: cols[d].id });
                        else {
                            if (cols[d].domain && cols[d].domain.period) {
                                if (cols[d].domain.period.from)//Check from
                                    if (dataRow[d] < cols[d].domain.period.from)
                                        toRet.push({ error: MSG_INVALID_YEAR, dataIndex: rowIdx, colId: cols[d].id, yearLimitFrom: cols[d].domain.period.from, yearValue: dataRow[d] });
                                if (cols[d].domain.period.to) //Check to
                                    if (dataRow[d] > cols[d].domain.period.to)
                                        toRet.push({ error: MSG_INVALID_YEAR, dataIndex: rowIdx, colId: cols[d].id, yearLimitTo: cols[d].domain.period.to, yearValue: dataRow[d] });
                            }
                        }
                        break;
                    case 'month':
                        if (!checkMonth(dataRow[d]))
                            toRet.push({ error: MSG_INVALID_MONTH, dataIndex: rowIdx, colId: cols[d].id });
                        break;
                    case 'date':
                        if (!checkDate(dataRow[d]))
                            toRet.push({ error: MSG_INVALID_DATE, dataIndex: rowIdx, colId: cols[d].id });
                        break;
                    case 'customCode':
                        //TODO: Check custom code
                        break;
                    case 'number':
                    case 'percentage':
                        if (!checkNumber(dataRow[d]))
                            toRet.push({ error: MSG_INVALID_NUMBER, dataIndex: rowIdx, colId: d });
                        break;
                    case 'bool':
                        if (!checkBool(dataRow[d]))
                            toRet.push({ error: MSG_INVALID_BOOL, dataIndex: rowIdx, colId: d });
                        break;
                }
            }
            return toRet;
        }

        /*var checkRowDataTypes = function (colInfo, dataRow, rowIdx) {
            var toRet = [];
            //for (var d in data) {
            for (var d = 0; d < dataRow.length; d++) {
                if (!colInfo[d])
                    continue;

                switch (colInfo[d].dataType) {
                    case 'code':
                        if (!checkCode(data[d], colInfo[d].codes))
                            toRet.push({ error: MSG_UNKNOWN_CODE, dataIndex: rowIdx, colId: d });
                        break;
                    case 'year':
                        if (!checkYear(data[d]))
                            toRet.push({ error: MSG_INVALID_YEAR, dataIndex: rowIdx, colId: d });
                        else {
                            if (colInfo[d].domain && colInfo[d].domain.period) {
                                if (colInfo[d].domain.period.from)//Check from
                                    if (data[d] < colInfo[d].domain.period.from)
                                        toRet.push({ error: MSG_INVALID_YEAR, dataIndex: rowIdx, colId: d, yearLimitFrom: colInfo[d].domain.period.from, yearValue: data[d] });
                                if (colInfo[d].domain.period.to) //Check to
                                    if (data[d] > colInfo[d].domain.period.to)
                                        toRet.push({ error: MSG_INVALID_YEAR, dataIndex: rowIdx, colId: d, yearLimitTo: colInfo[d].domain.period.to, yearValue: data[d] });
                            }
                        }
                        break;
                    case 'month':
                        if (!checkMonth(data[d]))
                            toRet.push({ error: MSG_INVALID_MONTH, dataIndex: rowIdx, colId: d });
                        break;
                    case 'date':
                        if (!checkDate(data[d]))
                            toRet.push({ error: MSG_INVALID_DATE, dataIndex: rowIdx, colId: d });
                        break;
                    case 'customCode':
                        //TODO: Check custom code
                        break;
                    case 'number':
                    case 'percentage':
                        if (!checkNumber(data[d]))
                            toRet.push({ error: MSG_INVALID_NUMBER, dataIndex: rowIdx, colId: d });
                        break;
                    case 'bool':
                        if (!checkBool(data[d]))
                            toRet.push({ error: MSG_INVALID_BOOL, dataIndex: rowIdx, colId: d });
                        break;
                }
            }
            return toRet;
        }*/

        var checkCode = function (code, codelist, object) {
            log.info('checkCode', code, codelist, object);
            var clU = new clUtils();
            var codex = clU.findCodeInCodelist(code, codelist, object);
            if (codex == null && object.subject != 'flag') return false;
            return true;

            /*
            if (!code)
                return true;
            if (!codelist)
                return true;
            if (isInCodelist(codelist, code))
            {
                return true;
            }
            for (var i = 0; i < codelist.data.length; i++)
                if (code == codelist.data[i].code)
                    return true;
            return false;*/
        }

        var checkYear = function (year) {
            if (!year)
                return true;
            if (!$.isNumeric(year))
                return false;
            if (year.toString().length != 4)
                return false;
            return true;
        }

        var checkMonth = function (month) {
            if (!month)
                return true;
            if (!$.isNumeric(month))
                return false;
            if (month.toString().length != 6)
                return false;
            if (month.substring(4, 6) > 12 || month.substring(4, 6) < 1)
                return false;
            return true;
        }

        var checkDate = function (date) {
            //ADD a true date format:
            //could be done by creating a date object and then check if it matches the orginal date
            if (!date)
                return true;
            if (!$.isNumeric(date))
                return false;
            if (date.toString().length != 8)
                return false;
            if (date.substring(4, 6) > 12 || date.substring(4, 6) < 1)
                return false;

            return true;
        }


        Data_Validator.prototype.checkValueFlags = function (cols, data) {
            //TODO: Add configuration rulees for value - flags

            /*var flagColId = "";
             var valueColId = "";
             for (var i = 0; i < cols.length; i++) {
             if (cols[i].subject && cols[i].subject == 'flag')
             flagColId = cols[i].id;
             if (cols[i].subject && cols[i].subject == 'value')
             valueColId = cols[i].id;
             }

             CONTINUE...
             */
        }

        var checkNumber = function (num) {
            if (!num)
                return true;
            if (num == "")
                return true;
            if ($.isNumeric(num))
                return true;
            return false;
        }
        var checkBool = function (toCheck) {
            if (typeof (toCheck) == 'boolean')
                return true;
            if (typeof (toCheck) == 'string')
                if (toCheck == 'true' || toCheck == 'false')
                    return true;
            if (typeof (toCheck) == 'number')
                if (toCheck == 1 || toCheck == 0)
                    return true;
            return false;
        }

        var arrConcat = function (dest, toAdd) {
            if (!dest)
                dest = [];
            if (toAdd)
                for (var i = 0; i < toAdd.length; i++)
                    dest.push(toAdd[i]);
        }


        /*Data append validation*/
        Data_Validator.prototype.dataAppendCheck = function (cols, dataOld, dataNew) {
            if (!cols || !dataOld || !dataNew)
                return null;

            var toRet = [];
            for (var o = 0; o < dataOld.length; o++) {
                for (n = 0; n < dataNew.length; n++) {
                    var dimValsCollision = sameDimVals(dataOld[o], dataNew[n], cols);
                    if (dimValsCollision) {
                        //if (!sameData) {//If the rows have the same data ignore
                        toRet.push({ dataOldIndex: o, dataNewIndex: n });
                        //}
                    }
                }
            }
            return toRet;
        }
        //checks if two rows have the same data fields (ignores the key columns)
        //Enable that after removing the duplicated lines from the newData set
        /*var sameData = function (cols, oldRow, newRow) {
            for (var d = 0; d < cols.length; d++) {
                if (!cols[d].key) {
                    if (oldRow[d] != newRow[d])
                        return false;
                }
            }
            return true;
        }*/

        Data_Validator.prototype.dataMerge = function (cols, dataOld, dataNew, mode) {

            var oldLen = dataOld.length; //To avoid the count to increase on push
            for (var n = 0; n < dataNew.length; n++) {
                var found = false;
                for (var o = 0; o < oldLen; o++) {
                    if (sameDimVals(dataOld[o], dataNew[n], cols)) {
                        found = true;
                        if (mode == 'keepOld') {
                            //do nothing, skip the line
                        }
                        else if (mode == 'keepNew') {
                            copyRow(dataNew[n], dataOld[o]);
                        }
                        //break;
                    }
                }
                if (!found) {//Not found, add it.
                    dataOld.push(dataNew[n]);
                }
            }

            return dataOld;
        }

        var copyRow = function (src, dst) {
            for (var i = 0; i < src.length; i++)
                dst[i] = src[i];
        }

        return Data_Validator;
    });