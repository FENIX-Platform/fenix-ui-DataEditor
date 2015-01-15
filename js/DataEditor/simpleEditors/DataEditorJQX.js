﻿define([
        'jquery',
        'jqxall',
        'fx-DataEditor/js/DataEditor/simpleEditors/DataEditor_ColumnCreatorJQX',
        'fx-DataEditor/js/DataEditor/helpers/MLUtils',
        'fx-DataEditor/js/DataEditor/helpers/NewRowHelper'
],
    function ($, jqx, DataEditor_ColumnCreatorJQX, MLUtils, NewRowHelper) {
        var widgetName = "DataEditor";
        var EVT_VALUE_CHANGED = 'valueChanged.' + widgetName + '.fenix';
        var EVT_GRID_RENDERED = 'gridRendered.' + widgetName + '.fenix';
        var EVT_ROW_ADDED = 'rowAdded.' + widgetName + '.fenix';
        var EVT_ROW_DELETED = 'rowDeleted.' + widgetName + '.fenix';

        var defConfig = {};

        var COLOR_ERROR = "error";
        var COLOR_DEFAULT = "default";

        var DataEditorJQX = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

            this.$dataGrid;
            this.cols;
            this.codelists;
            this.data = [];

            this.labelDataPostfix = "_lbl";

            this.lang = 'EN';
        };

        //Render - creation
        DataEditorJQX.prototype.render = function (container, config) {
            $.extend(true, this.config, config);

            this.$dataGrid = container;
            this.initGrid();

            if (localStorage.getItem('locale'))
                this.lang = localStorage.getItem('locale');
        }

        DataEditorJQX.prototype.initGrid = function () {
            this.$dataGrid.jqxGrid({ source: createEmptyDataAdapter(), width: "100%" });

            var me = this;
            this.$dataGrid.on('cellvaluechanged', function (evt) {
                var col = args.datafield;
                var rowIdx = args.rowindex;
                var newVal = args.newvalue;
                var oldVal = args.oldvalue;

                var rowData = me.$dataGrid.jqxGrid('getrowdata', rowIdx);

                var evtArgs = {};
                evtArgs.changed = {};
                evtArgs.changed[col] = oldVal;
                evtArgs.newData = me.tableRowToD3SData(rowData);
                evtArgs.allData = me.tableRowsToD3SData();

                //Update the source array (used to refresh the labels when the language is changed)
                me.data[rowIdx] = evtArgs.newData;
                me.$dataGrid.trigger(EVT_VALUE_CHANGED, evtArgs)
            });
        }

        var createEmptyDataAdapter = function () {
            var valsDataSource = { localdata: this.data, datatype: "array" };
            var valsDataAdapter = new $.jqx.dataAdapter(valsDataSource);
            return valsDataAdapter;
        }

        DataEditorJQX.prototype.setColumns = function (cols, codelists) {
            this.cols = cols;
            this.codelists = convertCodelists(codelists, this.lang);
            if (!cols) {
                this.$dataGrid.jqxGrid({ source: createEmptyDataAdapter(), width: "100%" });
                return;
            }

            var me = this;
            var valsDataSource = {
                localdata: this.data,
                datatype: "array",
                datafields: createDatafields(this.cols, this.config.dataLang, this.labelDataPostfix)
            };
            var valsDataAdapter = new $.jqx.dataAdapter(valsDataSource);
            this.$dataGrid.jqxGrid({
                source: valsDataAdapter, columns: createTableColumns(this.cols, this.codelists, this.labelDataPostfix), columnsresize: true, editable: true, rendered: function () {
                    me.$dataGrid.trigger(EVT_GRID_RENDERED);
                }
            });
        }

        var createDatafields = function (cols, lang, lblPostfix) {
            var toRet = [];
            for (var i = 0; i < cols.length; i++) {
                toRet.push({ name: cols[i].id, type: 'string' });
                if (cols[i].dataType == 'code')
                    toRet.push({ name: cols[i].id + lblPostfix, type: 'string' });
            }
            return toRet;
        }

        var createTableColumns = function (cols, codelists, lblPostfix) {
            var toRet = [];
            var colCreator = new DataEditor_ColumnCreatorJQX();

            for (var i = 0; i < cols.length; i++) {
                toRet.push(colCreator.create(cols[i], codelists, lblPostfix));
            }

            var colW = 100 / toRet.length + "%";
            for (i = 0; i < toRet.length; i++)
                toRet[i].width = colW;

            return toRet;
        }

        DataEditorJQX.prototype.newRow = function () {
            var rowToAdd = guessNewRow(this.cols, this.codelists, this.getData());
            this.$dataGrid.jqxGrid('addrow', null, rowToAdd);

            var evtArgs = {};
            evtArgs.allData = this.tableRowsToD3SData();
            this.$dataGrid.trigger(EVT_ROW_ADDED, evtArgs)
        }

        var guessNewRow = function (cols, cLists, data) {
            //var nRH = new NewRowHelper
            //return nRH.guessNewRow(cols, cLists, data);
            return {};
        }

        DataEditorJQX.prototype.deleteSelectedRow = function () {
            var selRowIdx = this.$dataGrid.jqxGrid('getselectedrowindex');
            if (selRowIdx == -1)
                return;
            var res = confirm(mlRes.confirmDelete);
            if (res) {
                var id = this.$dataGrid.jqxGrid('getrowid', selRowIdx);
                this.$dataGrid.jqxGrid('deleterow', id);
                var evtArgs = {};
                evtArgs.allData = this.tableRowsToD3SData();
                this.$dataGrid.trigger(EVT_ROW_DELETED, evtArgs);
            }
        }

        DataEditorJQX.prototype.isEditable = function (editable) {
            if (typeof (editable) != 'undefined')
                this.$dataGrid.jqxGrid({ editable: editable });
            else
                return this.$dataGrid.jqxGrid('editable');
        }


        //DATA
        DataEditorJQX.prototype.setData = function (data) {
            if (!this.cols)
                throw new Error("Cannot set data without table structure, use setColumns befor setData");
            this.data.length = 0;
            if (!data)
                return;

            for (var i = 0; i < data.length; i++)
                this.data[i] = this.D3SDataToTableRow(data[i]);
            addLabelsToData(this.cols, this.codelists, this.data, this.labelDataPostfix, this.config.dataLang);
            this.$dataGrid.jqxGrid('updatebounddata');
        }

        DataEditorJQX.prototype.D3SDataToTableRow = function (row) {
            var toRet = {};
            for (var i = 0; i < this.cols.length; i++) {
                toRet[this.cols[i].id] = row[i];
            }
            return toRet;
        }

        var addLabelsToData = function (cols, codelists, data, labelPostfix, lang) {
            if (!cols)
                return;
            if (!data)
                return;
            //each coded column
            for (var i = 0; i < cols.length; i++) {
                if (cols[i].dataType != 'code')
                    continue;
                //TODO Make it handle multiple Codelists
                var cListUid = cols[i].domain.codes[0].idCodeList;
                if (cols[i].domain.codes[0].version)
                    cListUid += "|" + cols[i].domain.codes[0].version;
                for (var d = 0; d < data.length; d++) {
                    //data has an entry for the column (ex. ITEM=57) -> look for the label
                    if (data[d][cols[i].id]) {
                        var lbl = getCodeLabel(codelists[cListUid].data, data[d][cols[i].id]);
                        if (lbl) data[d][cols[i].id + labelPostfix] = lbl;
                    }
                }
            }
        }
        var getCodeLabel = function (codes, code) {
            if (!codes)
                return null;
            for (var i = 0; i < codes.length; i++)
                if (codes[i].code == code)
                    //return codes[i].title + " [" + code + "]";
                    return codes[i].title;
            return null;
        }


        DataEditorJQX.prototype.tableRowToD3SData = function (row) {
            var toRet = [];
            for (var c = 0; c < this.cols.length; c++) {
                if (!row[this.cols[c].id]) {
                    toRet.push(null);
                }
                else {
                    switch (this.cols[c].dataType) {
                        case "year":
                        case "month":
                        case "date":
                            toRet.push(parseInt(row[this.cols[c].id]));
                            break;
                        case "number":
                            toRet.push(parseFloat(row[this.cols[c].id]));
                            break;
                        default:
                            toRet.push(row[this.cols[c].id]);
                            break;
                    }
                }
            }
            return toRet;
        }

        DataEditorJQX.prototype.tableRowsToD3SData = function () {
            var rows = this.$dataGrid.jqxGrid('getrows');
            var toRet = [];
            for (var i = 0; i < rows.length; i++)
                toRet.push(this.tableRowToD3SData(rows[i]));
            return toRet;
        }

        DataEditorJQX.prototype.getData = function () {
            return this.tableRowsToD3SData();
        }
        //END Data


        //Validation results
        DataEditorJQX.prototype.showValidationResults = function (valRes) {
            this.resetValidationResults();

            if (!valRes)
                return;
            for (var i = 0; i < valRes.length; i++) {
                if (valRes[i].colId)
                    this.setCellColor(valRes[i].dataIndex, valRes[i].colId, COLOR_ERROR);
                else
                    this.setRowColor(valRes[i].dataIndex, COLOR_ERROR);
            }
        }

        DataEditorJQX.prototype.resetValidationResults = function () {
            var rowCount = this.$dataGrid.jqxGrid('getrows').length;
            for (var i = 0; i < rowCount; i++)
                this.setRowColor(i, COLOR_DEFAULT);
        }

        DataEditorJQX.prototype.setRowColor = function (rowIdx, color) {
            var cols = this.$dataGrid.jqxGrid('columns');

            for (var i = 0; i < cols.records.length; i++)
                this.setCellColor(rowIdx, cols.records[i].datafield, color);
        }

        DataEditorJQX.prototype.setCellColor = function (rowIdx, colId, color) {
            var htmlRows = this.$dataGrid.find("div[role='row']");
            var htmlRow = htmlRows[rowIdx];
            var colIdx = this.$dataGrid.jqxGrid('getcolumnindex', colId);
            var tds = $(htmlRow).find("div[role='gridcell']");
            this.changeCellBackgroundColor(tds[colIdx], color);
        }

        DataEditorJQX.prototype.changeCellBackgroundColor = function (htmlCell, color) {
            if (color == COLOR_ERROR)
                $(htmlCell).addClass("fx-red-cell");
            else if (color == COLOR_DEFAULT)
                $(htmlCell).removeClass("fx-red-cell");
        }

        //END Validation results

        //Codelists helpers
        function convertCodelists(codelists, lang) {
            var toRet = {};
            for (var cl in codelists) {
                toRet[cl] = { metadata: { levels: codelists[cl].metadata.meContent.seCodeList.numberOfLevels } };
                toRet[cl].data = convertCodes(toRet[cl].metadata.levels, codelists[cl].data, lang);
            }
            return toRet;
        }
        function convertCodes(levels, codes, lang) {
            if (!codes)
                return null;
            var toRet = [];
            if (levels == 1) {
                for (var i = 0; i < codes.length; i++)
                    toRet.push(convertCode(codes[i], lang));
            }
            else {
                recFlatten(codes, toRet, lang)
            }
            return toRet;
        }
        function recFlatten(node, list, lang) {
            if (!node)
                return;
            for (var i = 0; i < node.length; i++) {
                list.push(convertCode(node[i], lang));
                if (node[i].children)
                    recFlatten(node[i].children, list);
            }
        }
        function convertCode(code, lang) {
            return {
                level: code.level,
                title: MLUtils_getAvailableString(code.title, lang) + " [" + code.code + "]",
                code: code.code
            };
        }
        //End Codelists helpers

        return DataEditorJQX;
    });