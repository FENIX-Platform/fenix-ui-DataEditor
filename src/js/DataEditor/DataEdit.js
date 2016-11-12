define([
'jquery',
'../../nls/labels',
'./simpleEditors/DataEditor',
'./simpleEditors/ValidationResultsViewer',
'./helpers/Data_Validator',
'./helpers/CSV_To_Dataset',
'./helpers/Validator_CSV',
'./ColumnsMatch/ColumnsMatch',
'../../nls/labels',
'../../html/DataEditor/DataEdit.hbs',
'amplify-pubsub'

],
function ($, mlRes, DataEditor, ValidationResultsViewer, Data_Validator, CSV_To_Dataset, Validator_CSV, Columns_Match, MultiLang, DataEditHTML, amplify) {

    var widgetName = "DataEdit";
    var defConfig = {};
    var e = {
        dataEditorValueChanged: 'valueChanged.DataEditor.fenix',
        dataEditorRowAdded: 'rowAdded.DataEditor.fenix',
        dataEditorRowDeleted: 'rowDeleted.DataEditor.fenix'
    };

    var s = {
        dataUploadColsMatch: "#DataUploadColsMatch",
        dataEditorContainer: "#divDataEditor",
        dataUploadContainer: "#DataUploadContainer",
        divCsvMatcher: "#divCsvMatcher",
        btnCsvMatcherOk: "#btnCsvMatcherOk",
        btnCsvMatcherCancel: "#btnCsvMatcherCancel",
        btnDataMergeKeepNew: "#btnDataMergeKeepNew",
        btnDataMergeKeepOld: "#btnDataMergeKeepOld",
        btnDataMergeCancel: "#btnDataMergeCancel"
    }

    var DataEdit = function (config) {
        //console.log('DataEdit');
        this.config = {};
        $.extend(true, this.config, defConfig, config);

        this.$container;

        this.dataEditor;
        this.$dataEditor;

        this.valResView;
        this.$valResView;

        this.cols;
        this.codelists;

        this.channels = {};

        this.editEnabled = true;
        this.changed = false;
    };

    //Render - creation
    DataEdit.prototype.render = function (container, config, callB) {
        //console.log('Render - creation');
        $.extend(true, this.config, config);

        require('../../css/fenix-ui-DataEditor.css');

        this.$container = container;
        this.$container.html(DataEditHTML);

        this.$dataEditor = this.$container.find('#divDataEditor');
        this.dataEditor = new DataEditor();
        this.dataEditor.render(this.$container.find('#divDataEdit'), this.config);

        this.$valResView = this.$container.find('#divValRes');
        this.valResView = new ValidationResultsViewer(this.config.lang);
        this.valResView.render(this.$valResView);

        this.columnsMatch = new Columns_Match();

        this.status = 'loading';

        this.doML();

        var me = this;
        var self = this;

        //Merge valueChanged, rowAdded and rowDeleted?
        amplify.subscribe(e.dataEditorValueChanged, this, this.updateValidationOnChange);
        amplify.subscribe(e.dataEditorRowAdded, this, this.updateValidationOnChange);
        amplify.subscribe(e.dataEditorRowDeleted, this, this.updateValidationOnChange);

        //  this.$dataEditor.find('#btnAddRow').on('click', function (args) { me.dataEditor.newRow(); });

        this.$dataEditor.find('#DataDeleteAll').on('click', function () {
            var res = confirm(MultiLang[me.config.lang.toLowerCase()]['confirmDelete']);
            if (!res) return;
            me.dataEditor.removeAllData();
        });

        //Data Merge

        $('#btnDataMergeKeepNew').on('click', function () {
            self._CSVLoadedMergeData('keepNew');
        });

        $('#btnDataMergeKeepOld').on('click', function () {
            self._CSVLoadedMergeData('keepOld');
        });

        $('#btnDataMergeCancel').on('click', function () {
            self.tmpCsvData = null;
            self.tmpCsvCols = null;
            self._switchPanelVisibility($((s.dataEditorContainer)));
        });


        if (callB) callB();
    }

    DataEdit.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    DataEdit.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    //Validation
    DataEdit.prototype.updateValidation = function (data) {
        this.changed = true;
        var val = new Data_Validator();
        var valRes = val.validate(this.cols, this.codelists, data);
        this.updateValRes(valRes);
        this.dataEditor.showValidationResults(valRes);
    };
    DataEdit.prototype.updateValidationOnChange = function (evt) { this.updateValidation(evt.allData); };
    DataEdit.prototype.updateValRes = function (valRes) {
        if (!valRes)
            this.$valResView.hide();
        else if (valRes.length == 0)
            this.$valResView.hide();
        else {
            this.$valResView.show();
            this.valResView.setValidationResults(valRes);
        }
    };

    DataEdit.prototype.setStatus = function(status) {
        this.status = status;
    };

    DataEdit.prototype.getStatus = function() {
        return this.status;
    };

    DataEdit.prototype.getValidationResults = function () {
        var val = new Data_Validator();
        return val.validate(this.cols, this.codelists, this.dataEditor.getData());
    };
    //END Validation

    //Set columns and codelists
    DataEdit.prototype.setColumns = function (columns, codelists, callB) {
        this.cols = columns;
        this.codelists = codelists;
        if (!this.cols || this.cols.length == 0)
            throw new Error("At least one column must be defined");

        this.uiEnabled(false);
        checkCodeColumnsAndCodelists(this.cols, this.codelists);
        this.dataEditor.setColumns(this.cols, this.codelists, callB);
        this.uiEnabled(true);
    };
    DataEdit.prototype.getColumns = function () { return this.cols; };
    DataEdit.prototype.getCodelists = function () { return this.codelists; };

    DataEdit.prototype.uiEnabled = function (enabled) {
        if (enabled) {
            this.$dataEditor.find('#btnAddRow').removeAttr('disabled');
            this.$dataEditor.removeAttr('disabled');
        }
        else {
            this.$dataEditor.find('#btnAddRow').attr('disabled', 'disabled');
            this.$dataEditor.attr('disabled', 'disabled');
        }
    };

    var checkCodeColumnsAndCodelists = function (cols, cLists) {
        //console.log("cLists",cLists);
        if (!cols) return;
        for (var i = 0; i < cols.length; i++)
            if (cols[i].dataType == 'code') {
                if (!cLists)
                    throw new Error("Codelist for the column " + cols[i].id + " missing");
                //TODO: extend to multiple codelists
                var cListId = cols[i].domain.codes[0].idCodeList;

                if (cols[i].domain.codes[0].version)
                    cListId = cListId + "|" + cols[i].domain.codes[0].version;

                if (!(cListId in cLists))
                    throw new Error("Codelist '"+cListId+"' for the column '"+cols[i].id+"' missing");
            }
    };

    DataEdit.prototype.getData = function () {
        var valRes = this.getValidationResults();

        if (valRes == null || valRes.length == 0)
            return this.dataEditor.getData();
        else
            return false;
    };
    DataEdit.prototype.getDataWithoutValidation = function () {
        return this.dataEditor.getData();
    };
    DataEdit.prototype.setData = function (data, rows) {
        if (this.cols)
            this.dataEditor.setData(data, rows);
        this.updateValidation(data);
        this.changed = false;
    };
    /*DataEdit.prototype.appendData = function (data) {
        if (this.cols)
            this.dataEditor.appendData(data);
        this.changed = true;
        this.updateValidation(this.dataEditor.getData());
    };*/
    DataEdit.prototype.removeAllData = function () {
        this.dataEditor.removeAllData();
    };
    DataEdit.prototype.hasChanged = function () {
        return this.changed;
    };

    //Column Distincts
    DataEdit.prototype.getColumnsWithDistincts = function () {
        var data = this.dataEditor.getData();
        for (var i = 0; i < this.cols.length; i++) {
            var col = this.cols[i];
            switch (col.dataType) {
                case 'code':
                case 'customCode':
                    var dist = getColumnDistinct(data, i);
                    if (dist) {
                        //TODO: Allow multiple codelists
                        col.values = { codes: [] };
                        col.values.codes[0] = { idCodeList: col.domain.codes[0].idCodeList };
                        if (col.domain.codes[0].version)
                            col.values.codes[0].version = col.domain.codes[0].version;
                        col.values.codes[0].codes = [];
                        for (var d = 0; d < dist.length; d++) {
                            col.values.codes[0].codes.push({ code: dist[d] });
                        }
                    }
                    else col.values = null;
                    break;
                case 'date':
                case 'month':
                case 'year':
                    var dist = getColumnDistinct(data, i);
                    if (dist)
                        col.values = { timeList: dist };
                    else
                        col.values = null;
                    break;
            }
        }
        return this.cols;
    };

    var getColumnDistinct = function (data, idx) {
        var toRet = [];
        if (!data)
            return null;
        for (var i = 0; i < data.length; i++)
            if ($.inArray(data[i][idx], toRet) == -1)
                toRet.push(data[i][idx]);
        return toRet;
    };
    //End column Distincts

    DataEdit.prototype.isEditable = function (editable) {
        if (typeof (editable) != 'undefined') {
            if (editable)
                this.$dataEditor.find('#btnAddRow').show();
            else
                this.$dataEditor.find('#btnAddRow').hide();
            this.editEnabled = editable;
            this.dataEditor.isEditable(editable);
        }
        else
            return this.editEnabled;
    };
    DataEdit.prototype.destroy = function () {
        amplify.unsubscribe(e.dataEditorValueChanged, this.updateValidation);
        amplify.unsubscribe(e.dataEditorRowAdded, this.updateValidation);
        amplify.unsubscribe(e.dataEditorRowDeleted, this.updateValidation);
        this.$dataEditor.find('#btnAddRow').off('click');
        this.dataEditor.destroy();
    };

    //MultiLang
    DataEdit.prototype.doML = function () {
        this.$dataEditor.find('#btnAddRow').html(mlRes['add']);
    };
    //END Multilang

    DataEdit.prototype._switchPanelVisibility = function (toShow) {
        $((s.dataUploadColsMatch)).hide();
        $((s.dataEditorContainer)).hide();
        $((s.dataUploadContainer)).hide();
        toShow.show();
    };

    DataEdit.prototype._CSVLoadedMergeData = function (keepOldOrNew){
        var dv = new Data_Validator();
        var data = this.getDataWithoutValidation();

        var validator = Validator_CSV;

        var valRes = validator.validateCodes(this.getColumns(), this.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

        //console.log("uhm, variables", dv, data, validator, valRes);

        if (valRes && valRes.length > 0) {
            log.info("valRes got errors");
            for (var n = 0; n < valRes.length; n++) {
                console.log([valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
                this._trigger("error:showerrormsg", [valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
            }
        }
        //Validates the CSV contents
        var wrongDatatypes = dv.checkWrongDataTypes(this.getColumns(), this.codelists, this.tmpCsvData);
        //log.info("wrongDatatypes", wrongDatatypes);

        if (wrongDatatypes && wrongDatatypes.length > 0) {
            //log.info("wrongDatatypes got errors");
            for (n = 0; n < wrongDatatypes.length; n++) {
                console.log([wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
                this._trigger("error:showerrormsg", [wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
            }
            //Don't merge, return.
            //log.info("Don't merge, return.");
            this._switchPanelVisibility($((s.dataEditorContainer)));
            this.tmpCsvCols = null;
            this.tmpCsvf = null;
            return;
        }
        dv.dataMerge(this.getColumns(), data, this.tmpCsvData, keepOldOrNew);
        this.setData(data);
//            DataEditor.isEditable(false);
        this._switchPanelVisibility($((s.dataEditorContainer)));
        this._trigger("data:loaded");

        this.tmpCsvCols = null;
        this.tmpCsvData = null;

    };


    DataEdit.prototype._CSVLoadedCheckDuplicates = function() {
        var data = this.getDataWithoutValidation();
        var dv = new Data_Validator();
        var keyDuplicates = dv.dataAppendCheck(this.getColumns(), data, this.tmpCsvData);

        //this.tmpCsvData = csvData;
        if (keyDuplicates && keyDuplicates.length > 0) {
            this._switchPanelVisibility($((s.dataUploadContainer)));
        } else {
            this._CSVLoadedMergeData('keepNew');
        }

    };

    DataEdit.prototype.csvLoaded = function (data, conf, separator) {
        //console.log(' csvLoaded', data, conf, separator);

        //console.log(data, conf, separator);


        var self = this;
        var conv = new CSV_To_Dataset(conf, separator);
        conv.convert(data);

        this.tmpCsvCols = conv.getColumns();
        this.tmpCsvData = conv.getData();

        var validator = Validator_CSV;

        this.$csvMatcherOkButton = $('#btnCsvMatcherOk');
        this.$csvMatcherCancelButton = $('#btnCsvMatcherCancel');

        //console.log(this.$csvMatcherOkButton, this.$csvMatcherCancelButton);

        this.columnsMatch.render($('div#divCsvMatcher'));

        this.$csvMatcherOkButton.on("click", function () {
            //console.log(' click ');
            self.tmpCsvCols = self.columnsMatch.getCsvCols();
            self.tmpCsvData = self.columnsMatch.getCsvData();
            self._CSVLoadedCheckDuplicates();

        });

        this.$csvMatcherCancelButton.on("click", function () {
            //console.log(' click 2')
            $('div#btnCsvMatcherCancel').off("click");
            $('div#btnCsvMatcherOk').off("click");
            self.tmpCsvData = null;
            self.tmpCsvCols = null;
            self._switchPanelVisibility($((s.dataEditorContainer)));
            //$(s.utility).show();
        });


        //Validates the CSV structure (null columns, less columns than the DSD...)
        var valRes = validator.validate(this.getColumns(), this.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

        if (valRes && valRes.length > 0) {
            for (var n = 0; n < valRes.length; n++) {
                console.log(valRes[n].type);
                this._trigger("error:showerrormsg", valRes[n].type);
            }
            return;
        }

        console.log(this);

        this._switchPanelVisibility($((s.dataUploadColsMatch)));

        this.columnsMatch.setData(this.cols, this.tmpCsvCols, this.tmpCsvData);

        //Validates the CSV contents
        var dv = new Data_Validator();
        var wrongDatatypes = dv.checkWrongDataTypes(this.getColumns(), this.codelists, this.tmpCsvData);

        if (wrongDatatypes && wrongDatatypes.length > 0) {
            for (n = 0; n < wrongDatatypes.length; n++) {
                console.log([wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
                this._trigger("error:showerrormsg", [wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
            }
            return;
        }

    };

    return DataEdit;
});