define([
        'jquery',
        'jqxall',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/helpers/MLUtils'
],
    function ($, jqx, mlRes, MLUtils) {
        var defConfig = { YMin: 0, YMax: 3000, dataLang: 'EN' };
        var DataEditor_ColumnCreatorJQX = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
        };

        //Render - creation
        DataEditor_ColumnCreatorJQX.prototype.create = function (col, codelists, labelPostfix) {
            var colTitle = MLUtils_getAvailableString(col.title, this.config.dataLang);
            switch (col.dataType) {
                case 'code':
                    return this.createCodeCol(col, colTitle, codelists, labelPostfix);
                    break;
                case 'customCode':
                    return this.createCustomCodeCol(col, colTitle);
                    break;
                case 'year':
                    return this.createYearCol(col, colTitle);
                    break;
                case 'month':
                    return this.createMonthCol(col, colTitle);
                    break;
                case 'date':
                    return this.createDateCol(col, colTitle);
                    break;
                case 'number':
                case 'percentage':
                    return this.createNumberCol(col, colTitle);
                    break;
                case 'string':
                    return this.createStringCol(col, colTitle);
                    break;
                case 'boolean':
                    return this.createBoolCol(col, colTitle);
                    break;
            }
        }

        DataEditor_ColumnCreatorJQX.prototype.createCodeCol = function (col, colTitle, codelists, labelPostfix) {
            if (!labelPostfix)
                throw new Error("A label postfix must be selected for code columns, param is nul");

            //TODO make it handle multiple codelists
            var codelistUid = col.domain.codes[0].idCodeList;
            if (col.domain.codes[0].version)
                codelistUid += "|" + col.domain.codes[0].version;

            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'combobox',
                displayfield: col.id + labelPostfix,
                createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheigth) {
                    var codesTextSrc = {
                        localdata: codelists[codelistUid], datatype: 'array', datafields: [
                            { name: 'code', type: 'string' },
                            { name: 'MLTitle', type: 'string' }
                        ]
                    };
                    var codesTextDataAdapter = new $.jqx.dataAdapter(codesTextSrc);
                    editor.jqxComboBox({ source: codesTextDataAdapter, displayMember: 'MLTitle', valueMember: 'code', promptText: '', autoComplete: true, searchMode: 'containsignorecase' });
                }
            };
            return toRet;
        }

        DataEditor_ColumnCreatorJQX.prototype.createCustomCodeCol = function (col, colTitle) {
            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'textbox',
                displayfield: col.id
                /*createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheigth) {
                 var codesTextSrc = { localdata: col.codes, datatype: 'array', datafields: [{ name: 'code', type: 'string' }, { name: 'MLTitle', type: 'string'}] };
                 var codesTextDataAdapter = new $.jqx.dataAdapter(codesTextSrc);
                 editor.jqxComboBox({ source: codesTextDataAdapter, displayMember: 'MLTitle', valueMember: 'code', promptText: '', autoComplete: true, searchMode: 'containsignorecase' });
                 }*/
            };
            return toRet;
        }

        DataEditor_ColumnCreatorJQX.prototype.createYearCol = function (col, colTitle) {
            var yMin = this.config.YMin;
            var yMax = this.config.YMax;

            if (col.domain && col.domain.period) {
                yMin = col.domain.period.from;
                yMax = col.domain.period.to;
            }

            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'numberinput',
                validation: function (cell, val) {
                    if (val < yMin || val > yMax) {
                        return { result: false, message: mlRes.yearInterval + "(" + this.config.YMin + ".." + this.config.YMax + ")" };
                    }
                    return true;
                }
            };
            return toRet;
        }

        DataEditor_ColumnCreatorJQX.prototype.createMonthCol = function (col, colTitle) {
            var yMin = this.defYMin;
            var yMax = this.defYMax;

            if (col.domain && col.domain.period) {
                yMin = col.domain.period.from.substring(0, 4);
                yMax = col.domain.period.to.substring(0, 4)
            }

            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'TextBox',
                createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    editor.jqxMaskedInput({ mask: '##-####', value: cellvalue.substring(0, 2) + cellvalue.substring(3, 7) });
                },
                validation: function (cell, val) {
                    var m = val.substring(0, 2);
                    var y = val.substring(3, 7);
                    if (isNaN(m))
                        return { result: false, message: mlRes.monthInterval };
                    if (isNaN(y)) {
                        return { result: false, message: mlRes.yearInterval + "(" + this.config.YMin + ".." + this.config.YMax + ")" };
                    }
                    if (m < 1 || m > 12)
                        return { result: false, message: mlRes.monthInterval };
                    if (y < yMin || y > yMax)
                        return { result: false, message: mlRes.yearInterval + "(" + this.config.YMin + ".." + this.config.YMax + ")" };
                    return true;
                }
            };
            return toRet;
        }

        DataEditor_ColumnCreatorJQX.prototype.createDateCol = function (col, colTitle) {

            //TODO:Multilang validation error message

            var yMin = this.defYMin;
            var yMax = this.defYMax;

            if (col.domain && col.domain.period) {
                yMin = col.domain.period.from;
                yMax = col.domain.period.to;
            }

            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'datetimeinput',
                cellsformat: 'dd-MM-yyyy'
            };
            return toRet;
        }

        DataEditor_ColumnCreatorJQX.prototype.createNumberCol = function (col, colTitle) {
            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'TextBox',
                validation: function (cell, val) {
                    if (val == null)
                        return true;
                    if (val.trim() == "")
                        return true;
                    if ($.isNumeric(val))
                        return true;

                    return { result: false, message: mlRes.invalidNumber };
                }
            };
            return toRet;
        }

        DataEditor_ColumnCreatorJQX.prototype.createStringCol = function (col, colTitle) {
            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'TextBox'
            };
            return toRet;
        }
        DataEditor_ColumnCreatorJQX.prototype.createBoolCol = function (col, colTitle) {
            var toRet = {
                text: colTitle,
                datafield: col.id,
                columntype: 'checkbox'
            };
            return toRet;
        }

        return DataEditor_ColumnCreatorJQX;
    });