define(['jquery'
    ],
    function ($) {

        //Columns/headers validation
        function Data_Validator() {
        };

        Data_Validator.prototype.validate = function (cols, data) {
            var toRet = [];

            var emptyKeyVals = this.checkEmptyKeyVals(cols, data);
            var duplicateKeyVals = this.checkDuplicateKeyVals(cols, data);
            var wrongDataTypes = this.checkWrongDataTypes(cols, data);
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

                            toRet.push({ error: 'nullKey', colId: cols[c].id, dataIndex: i });
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
                        toRet.push({ error: 'sameKeyVals', dataIndex: r1 });
                        toRet.push({ error: 'sameKeyVals', dataIndex: r2 });
                    }

            return toRet;
        }

        var sameDimVals = function (row1, row2, cols) {
            for (var d = 0; d < cols.length; d++) {
                if (cols[d].key)
                    if (row1[d] != row2[d])
                        return false;
            }
            return true;
        }

        Data_Validator.prototype.checkWrongDataTypes = function (cols, data) {
            if (!cols || !data)
                return null;

            var colInfo = {};
            for (var c = 0; c < cols.length; c++) {
                if (cols[c].dataType)
                    colInfo[cols[c].id] = { dataType: cols[c].dataType, domain: cols[c].domain, codes: cols[c].codes };
            }
            var toRet = [];
            for (var i = 0; i < data.length; i++) {
                arrConcat(toRet, checkRowDataTypes(colInfo, data[i], i));
            }
            return toRet;
        }

        var checkRowDataTypes = function (colInfo, data, rowIdx) {
            var toRet = [];
            for (var d in data) {
                if (!colInfo[d])
                    continue;

                switch (colInfo[d].dataType) {
                    case 'code':
                        if (!checkCode(data[d], colInfo[d].codes))
                            toRet.push({ error: 'unknownCode', dataIndex: rowIdx, colId: d });
                        break;
                    case 'year':
                        if (!checkYear(data[d]))
                            toRet.push({ error: 'invalidYear', dataIndex: rowIdx, colId: d });
                        else {
                            if (colInfo[d].domain && colInfo[d].domain.period) {
                                if (colInfo[d].domain.period.from)//Check from
                                    if (data[d] < colInfo[d].domain.period.from)
                                        toRet.push({ error: 'invalidYear', dataIndex: rowIdx, colId: d, yearLimitFrom: colInfo[d].domain.period.from, yearValue: data[d] });
                                if (colInfo[d].domain.period.to) //Check to
                                    if (data[d] > colInfo[d].domain.period.to)
                                        toRet.push({ error: 'invalidYear', dataIndex: rowIdx, colId: d, yearLimitTo: colInfo[d].domain.period.to, yearValue: data[d] });
                            }
                        }
                        break;
                    case 'month':
                        if (!checkMonth(data[d]))
                            toRet.push({ error: 'invalidMonth', dataIndex: rowIdx, colId: d });
                        break;
                    case 'date':
                        if (!checkDate(data[d]))
                            toRet.push({ error: 'invalidDate', dataIndex: rowIdx, colId: d });
                        break;
                    case 'customCode':
                        //TODO: Check custom code
                        break;
                    case 'number':
                    case 'percentage':
                        if (!checkNumber(data[d]))
                            toRet.push({ error: 'invalidNumber', dataIndex: rowIdx, colId: d });
                        break;
                    case 'boolean':
                        if (!checkBool(data[d]))
                            toRet.push({ error: 'invalidBoolean', dataIndex: rowIdx, colId: d });
                        break;
                }
            }
            return toRet;
        }

        var checkCode = function (code, codes) {
            if (!code)
                return true;
            if (!codes)
                return true;
            for (var i = 0; i < codes.length; i++)
                if (code == codes[i].code)
                    return true;
            return false;
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
            if (!month)
                return true;
            if (!$.isNumeric(month))
                return false;
            if (month.toString().length != 8)
                return false;
            if (month.substring(4, 6) > 12 || month.substring(4, 6) < 1)
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

        /*var getKeyIds = function (cols) {
            if (!cols)
                return null;
            var toRet = [];
            for (var i = 0; i < cols.length; i++)
                if (cols[i].key)
                    toRet.push(cols[i].id);

            return toRet;
        }*/

        var arrConcat = function (dest, toAdd) {
            if (!dest)
                dest = [];
            if (toAdd)
                for (var i = 0; i < toAdd.length; i++)
                    dest.push(toAdd[i]);
        }

        return Data_Validator;
    });