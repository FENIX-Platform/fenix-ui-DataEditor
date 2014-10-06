define([
'jquery',
 'jqxall',
 'js/DataEditor/simpleEditors/DataEditor_ColumnCreatorJQX',
 'js/DataEditor/helpers/MLUtils'
  ],
function ($, jqx, DataEditor_ColumnCreatorJQX, MLUtils) {
    var DataEditorJQX = function () {
        this.widgetName = "DataEditor";

        this.$dataGrid;
        this.cols;
        this.data = [];

        this.dataLang = 'EN';

        this.labelDataPostfix = "_lbl";
        this.validationErrorColor = "red";
    };

    //Render - creation
    DataEditorJQX.prototype.render = function (container, lang) {
        if (lang)
            this.dataLang = lang;

        this.$dataGrid = container;
        this.initGrid();

        //this.setDataLang(localStorage.getItem('locale'));
    }

    DataEditorJQX.prototype.initGrid = function () {

        this.$dataGrid.jqxGrid({ source: createEmptyDataAdapter(), width: "100%" });

        var me = this;
        this.$dataGrid.on('cellvaluechanged', function (evt) {
            var col = args.datafield;
            var rowIdx = args.rowindex;
            var newVal = args.newvalue;
            var oldVal = args.oldvalue;

            //var rows = me.$dataGrid.jqxGrid('getrows');
            var rowData = me.$dataGrid.jqxGrid('getrowdata', rowIdx);

            var evtArgs = {};
            evtArgs.changed = {};
            evtArgs.changed[col] = oldVal;
            evtArgs.newData = me.tableRowToD3SData(rowData);
            evtArgs.allData = me.tableRowsToD3SData();

            //Update the source array (used to refresh the labels when the language is changed)
            me.data[rowIdx] = evtArgs.newData;
            me.$dataGrid.trigger('valueChanged.' + me.widgetName + '.fenix', evtArgs)
        });
    }

    var createEmptyDataAdapter = function () {
        var valsDataSource = { localdata: this.data, datatype: "array" };
        var valsDataAdapter = new $.jqx.dataAdapter(valsDataSource);
        return valsDataAdapter;
    }

    DataEditorJQX.prototype.setColumns = function (cols) {
        this.cols = cols;
        if (!cols) {
            this.$dataGrid.jqxGrid({ source: createEmptyDataAdapter(), width: "100%" });
            return;
        }

        this.addMLToCodeColumns(this.dataLang);

        var me = this;
        var valsDataSource = {
            localdata: this.data,
            datatype: "array",
            datafields: createDatafields(this.cols, this.dataLang, this.labelDataPostfix)
            //,
            //addrow: function (rowid, rowdata, position, commit) { commit(true); },
            //updaterow: function (rowid, rowdata, commit) { commit(true); }
        };
        var valsDataAdapter = new $.jqx.dataAdapter(valsDataSource);
        this.$dataGrid.jqxGrid({ source: valsDataAdapter, columns: createTableColumns(this.cols, this.dataLang, this.labelDataPostfix), columnsresize: true, editable: true, rendered: function () { me.$dataGrid.trigger('gridRendered.' + me.widgetName + '.fenix'); } });
    }

    var isColToSkip = function (col) {
        if (col.virtualColumn && col.virtualColumn == 'INTERNAL')
            return true;
        return false;
    }

    var createDatafields = function (cols, lang, lblPostfix) {
        var toRet = [];
        for (var i = 0; i < cols.length; i++) {
            if (isColToSkip(cols[i]))
                continue;
            toRet.push({ name: cols[i].id, type: 'string' });
            if (cols[i].dataType == 'code')
                toRet.push({ name: cols[i].id + lblPostfix, type: 'string' });
        }
        return toRet;
    }

    var createTableColumns = function (cols, lang, lblPostfix) {
        var toRet = [];
        var colCreator = new DataEditor_ColumnCreatorJQX();

        //The col's number
        //toRet.push({ pinned: true, exportable: false, text: "", columntype: 'number', cellsrenderer: function (row, col, val) { return '<div style="text-align: center; margin-top: 5px">' + (1 + val) + '</div>'; } });

        //Add the multilanguage to the column codes

        //First the key cols
        for (var i = 0; i < cols.length; i++) {
            if (isColToSkip(cols[i]))
                continue;
            if (cols[i].key)
                toRet.push(colCreator.create(cols[i], lang, lblPostfix));
        }
        //Then the non key cols
        for (i = 0; i < cols.length; i++) {
            if (isColToSkip(cols[i]))
                continue;
            if (!cols[i].key)
                toRet.push(colCreator.create(cols[i], lang, lblPostfix));
        }

        return toRet;
    }

    DataEditorJQX.prototype.newRow = function () {
        this.$dataGrid.jqxGrid('addrow', null, {});

        var evtArgs = {};
        evtArgs.allData = this.tableRowsToD3SData();
        this.$dataGrid.trigger('rowAdded.' + this.widgetName + '.fenix', evtArgs)
    }

    DataEditorJQX.prototype.deleteSelectedRow = function () {
        var selRowIdx = this.$dataGrid.jqxGrid('getselectedrowindex');
        if (selRowIdx == -1)
            return;
        var res = confirm("Delete ?");
        if (res) {
            var id = this.$dataGrid.jqxGrid('getrowid', selRowIdx);
            this.$dataGrid.jqxGrid('deleterow', id);
            var evtArgs = {};
            evtArgs.allData = this.tableRowsToD3SData();
            this.$dataGrid.trigger('rowDeleted.' + this.widgetName + '.fenix', evtArgs)
        }
    }


    //DATA
    DataEditorJQX.prototype.setData = function (data) {
        this.data.length = 0;
        if (!data)
            return;

        for (var i = 0; i < data.length; i++)
            this.data[i] = data[i];

        addLabelsToData(this.cols, this.data, this.labelDataPostfix, this.dataLang);

        this.$dataGrid.jqxGrid('updatebounddata');
    }
    var addLabelsToData = function (cols, data, labelPostfix, lang) {
        if (!cols)
            return;
        if (!data)
            return;
        //each coded column
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].dataType != 'code')
                continue;
            for (var d = 0; d < data.length; d++) {
                //data has an entry for the column (ex. ITEM=57) -> look for the label
                if (data[d][cols[i].id]) {
                    var lbl = getCodeLabel(cols[i].codes, data[d][cols[i].id], lang);
                    if (lbl) data[d][cols[i].id + labelPostfix] = lbl;
                }
            }
        }
    }
    var getCodeLabel = function (codes, code, lang) {
        if (!codes)
            return null;
        for (var i = 0; i < codes.length; i++)
            if (codes[i].code == code) {
                var toRet = MLUtils_getAvailableString(codes[i].title, lang);
                toRet += " [" + code + "]";
                return toRet;
            }
        return null;
    }

    DataEditorJQX.prototype.tableRowToD3SData = function (row) {
        var toRet = {};
        //calc once to speed it up, speed can be increased if necessary
        var postLen = this.labelDataPostfix.length;
        for (var p in row) {
            if (p.indexOf(this.labelDataPostfix, p.length - postLen) == -1)
                toRet[p] = row[p];
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
                this.setCellColor(valRes[i].dataIndex, valRes[i].colId, this.validationErrorColor);
            else
                this.setRowColor(valRes[i].dataIndex, this.validationErrorColor);
        }
    }

    DataEditorJQX.prototype.resetValidationResults = function () {
        var rowCount = this.$dataGrid.jqxGrid('getrows').length;
        for (var i = 0; i < rowCount; i++)
            this.setRowColor(i, '');
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
        $(htmlCell).css("background-color", color);
    }

    //END Validation results


    //Lang
    DataEditorJQX.prototype.setDataLang = function (dataLang) {
        this.dataLang = dataLang;
        this.updateML(dataLang);
    }

    DataEditorJQX.prototype.updateML = function (langCode) {
        var rows = this.$dataGrid.jqxGrid('getrows');

        if (this.cols) {
            for (var i = 0; i < this.cols.length; i++)
                if (!isColToSkip(this.cols[i])) {
                    this.$dataGrid.jqxGrid('setcolumnproperty', this.cols[i].id, 'text', MLUtils_getAvailableString(this.cols[i].title, langCode));
                }
        }

        this.addMLToCodeColumns(langCode);

        addLabelsToData(this.cols, this.data, this.labelDataPostfix, this.dataLang);
        this.$dataGrid.jqxGrid('updatebounddata');
    }

    DataEditorJQX.prototype.addMLToCodeColumns = function (langCode) {
        if (!this.cols)
            return;
        for (var i = 0; i < this.cols.length; i++) {
            if (isColToSkip(this.cols[i]))
                continue;
            if (this.cols[i].dataType == 'code')
                addMLToColCodes(this.cols[i].codes, langCode);
        }
    }

    var addMLToColCodes = function (codes, lang) {
        if (!codes) return;
        for (var i = 0; i < codes.length; i++)
            codes[i].MLTitle = MLUtils_getAvailableString(codes[i].title, lang) + " [" + codes[i].code + "]";
    }
    //END Lang

    return DataEditorJQX;
});