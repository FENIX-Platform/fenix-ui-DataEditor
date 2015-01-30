define([
        'jquery',
        'jqxall',
        'fx-DataEditor/js/DataEditor/simpleEditors/RowEditorPopupJQX',
        'text!fx-DataEditor/templates/DataEditor/simpleEditors/DataEditorJQX.htm',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/helpers/MLUtils',
        'bootstrap'
],
    function ($, jqx, RowEditorPopupJQX, DataEditorJQXHTML, mlRes, MLUtils) {
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

            this.rowEditor = new RowEditorPopupJQX();

            this.$container;
            this.$editWindow;
            this.$dataGrid;
            this.cols;
            this.codelists;
            this.data = [];
            this.editEnabled = true;

            this.labelDataPostfix = "_lbl";
            this.lang = 'EN';
        };

        //Render - creation
        DataEditorJQX.prototype.render = function (container, config) {
            $.extend(true, this.config, config);

            this.$container = container;
            this.$container.html(DataEditorJQXHTML);
            this.$dataGrid = this.$container.find('#divDataGrid');
            this.initGrid();

            this.$editWindow = this.$container.find('#divRowEditorPopup');
            this.rowEditor.render(this.$editWindow);

            if (localStorage.getItem('locale'))
                this.lang = localStorage.getItem('locale');

            var me = this;
            this.$container.find('#btnEditRowCanc').click(function () { me.$editWindow.modal('hide'); });
            this.$container.find('#btnEditRowOk').click(function () { me.rowEditOk(); });
            this.$editWindow.on('hidden.bs.modal', function (e) { me.rowEditor.reset(); });
        }

        DataEditorJQX.prototype.initGrid = function () {
            this.$dataGrid.jqxGrid({ width: "100%" });
        }

        DataEditorJQX.prototype.setColumns = function (cols, codelists) {
            this.cols = cols;
            this.codelists = convertCodelists(codelists, this.lang);
            if (!cols) {
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
                editable: false,
                source: valsDataAdapter,
                columns: this.createTableColumns(),
                columnsresize: true,
                rendered: function () {
                    me.$dataGrid.trigger(EVT_GRID_RENDERED);
                }
            });
            this.rowEditor.setColumns(cols, this.codelists);

            this.isEditable(this.editEnabled);
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

        DataEditorJQX.prototype.createTableColumns = function () {
            var toRet = [];
            for (var i = 0; i < this.cols.length; i++) {
                var toAdd = {
                    text: MLUtils_getAvailableString(this.cols[i].title, this.config.dataLang),
                    datafield: this.cols[i].id,
                };
                switch (this.cols[i].dataType) {
                    case 'code':
                        toAdd.displayfield = this.cols[i].id + this.labelDataPostfix;
                        break;
                    case 'boolean':
                        toAdd.columntype = 'checkbox';
                        break;
                    case 'date':
                        toAdd.cellsrenderer = function (row, colField, val, defaultHtml, colProperties) {
                            if (!val)
                                return '';
                            val = "" + val;
                            return val.substring(0, 2) + "-" + val.substring(2, 4) + "-" + val.substring(4, 10);
                        }
                        break;
                    case 'month':
                        toAdd.cellsrenderer = function (row, colField, val, defaultHtml, colProperties) {
                            if (!val)
                                return '';
                            val = "" + val;
                            return val.substring(0, 2) + "-" + val.substring(2, 6);
                        }
                        break;
                    case 'number':
                    case 'percentage':
                        toAdd.columntype = 'number';
                        break;
                }
                toRet.push(toAdd);
            }

            //edit btn
            var me = this;
            var editCol = {
                text: '', datafield: 'edit', columntype: 'button',
                cellsrenderer: function () { return mlRes.edit; },
                buttonclick: function (row) {
                    var dataRow = me.$dataGrid.jqxGrid('getrowdata', row);
                    me.rowEditor.setRow(dataRow);
                    me.$editWindow.modal('show');
                }
            }
            var delCol = {
                text: '', datafield: 'delete', columntype: 'button',
                cellsrenderer: function () { return mlRes.delete; },
                buttonclick: function (row) {
                    var dataRow = me.$dataGrid.jqxGrid('getrowdata', row);
                    var res = confirm(mlRes.confirmDelete);
                    if (res) {
                        var id = me.$dataGrid.jqxGrid('getrowid', row);
                        me.$dataGrid.jqxGrid('deleterow', id);
                        var evtArgs = {};
                        evtArgs.allData = me.tableRowsToD3SData();
                        me.$dataGrid.trigger(EVT_ROW_DELETED, evtArgs);
                    }
                }
            }
            toRet.push(editCol);
            toRet.push(delCol);

            var colW = 100 / toRet.length + "%";
            for (i = 0; i < toRet.length; i++)
                toRet[i].width = colW;

            return toRet;
        }

        DataEditorJQX.prototype.rowEditOk = function () {
            if (!this.rowEditor.isValid()) {
                this.rowEditor.updateValidationHelp()
                return;
            }
            var row = this.rowEditor.getRow();
            //Add label to codes
            addLabelsToData(this.cols, this.codelists, [row], this.labelDataPostfix, this.config.dataLang);
            if (row.uid != -1) {
                this.$dataGrid.jqxGrid('updaterow', row.uid, row);

                var evtArgs = {};
                evtArgs.changed = {};
                evtArgs.newData = this.tableRowToD3SData(row);
                evtArgs.allData = this.tableRowsToD3SData();
                this.$dataGrid.trigger(EVT_VALUE_CHANGED, evtArgs)
            }
            else {
                this.$dataGrid.jqxGrid('addrow', null, row);
                var evtArgs = {};
                evtArgs.allData = this.tableRowsToD3SData();
                this.$dataGrid.trigger(EVT_ROW_ADDED, evtArgs);
            }

            this.$editWindow.modal('hide');
        }

        DataEditorJQX.prototype.newRow = function () {
            this.rowEditor.reset();
            this.$editWindow.modal('show');
        }

        DataEditorJQX.prototype.isEditable = function (editable) {
            this.editEnabled = editable;
            if (!this.cols)
                return;
            if (typeof (editable) != 'undefined') {
                var colsW;
                if (editable) {
                    colsW = (100 / (this.cols.length + 2)) + '%';
                    this.$dataGrid.jqxGrid('showcolumn', 'edit');
                    this.$dataGrid.jqxGrid('showcolumn', 'delete');

                    this.$dataGrid.jqxGrid('setcolumnproperty', 'edit', 'width', colsW);
                    this.$dataGrid.jqxGrid('setcolumnproperty', 'delete', 'width', colsW);
                }
                else {
                    colsW = (100 / this.cols.length) + '%';
                    this.$dataGrid.jqxGrid('hidecolumn', 'edit');
                    this.$dataGrid.jqxGrid('hidecolumn', 'delete');
                }
                for (var i = 0; i < this.cols.length; i++) {
                    this.$dataGrid.jqxGrid('setcolumnproperty', this.cols[i].id, 'width', colsW);
                }
            }
            else
                return this.editEnabled;
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


        var getCodelistUid = function (domain) {
            //Make it handle multiple codelsits
            var cListUid = domain.codes[0].idCodeList;
            if (domain.codes[0].version)
                cListUid += "|" + domain.codes[0].version;
            return cListUid;
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
                var cListUid = getCodelistUid(cols[i].domain);
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