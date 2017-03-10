define([
'jquery',
'loglevel',
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
function ($, log, mlRes, DataEditor, ValidationResultsViewer, Data_Validator, CSV_To_Dataset, Validator_CSV, Columns_Match, MultiLang, DataEditHTML, amplify) {

    var widgetName = "DataEdit";
    var defConfig = {  lang : 'EN' };
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


    var p = {
        DataMatchColumn : "#DataMatchColumn",
        btnCsvMatcherOk : "#btnCsvMatcherOk",
        btnCsvMatcherCancel : "#btnCsvMatcherCancel",
        DataDuplicateFound : "#DataDuplicateFound",
        btnDataMergeKeepNew : "#btnDataMergeKeepNew",
        btnDataMergeKeepOld : "#btnDataMergeKeepOld",
        btnDataMergeCancel : "#btnDataMergeCancel"
    }

    var DataEdit = function (config) {
        log.info('DataEdit', config);
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

        this.lang = this.config.lang.toLowerCase();
    };

    //Render - creation
    DataEdit.prototype.render = function (container, config, callB) {
        $.extend(true, this.config, config);

        require('../../css/fenix-ui-DataEditor.css');

        log.info('Render - creation', this.config);
        this.$container = container;
        this.$container.html(DataEditHTML({
            btnClear: mlRes[this.lang]['btnClear'],
            btnAdd: mlRes[this.lang]['btnAdd']
        }));

        this.$dataEditor = this.$container.find('#divDataEditor');
        this.dataEditor = new DataEditor(this.config);
        this.dataEditor.render(this.$container.find('#divDataEdit'), this.config);

        this.$valResView = this.$container.find('#divValRes');
        this.valResView = new ValidationResultsViewer(this.config.lang);
        this.valResView.render(this.$valResView);

        this.columnsMatch = new Columns_Match(this.config);

        this.status = 'loading';
        this.doML();

        var me = this;
        var self = this;

        //Merge valueChanged, rowAdded and rowDeleted?
        amplify.subscribe(e.dataEditorValueChanged, this, this.updateValidationOnChange);
        amplify.subscribe(e.dataEditorRowAdded, this, this.updateValidationOnChange);
        amplify.subscribe(e.dataEditorRowDeleted, this, this.updateValidationOnChange);

        this.$dataEditor.find('#btnAddRow').on('click', function (args) { me.dataEditor.newRow(); });

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
    DataEdit.prototype.updateValidationOnChange = function (evt) {
        this.updateValidation(evt);
    };
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
        log.warn('StatusSet', status);
        this.status = status;
        this._updateStatus();
    };

    DataEdit.prototype.getStatus = function() {
        return this.status;
    };

    DataEdit.prototype._updateStatus = function() {
        $.each(this.$container.find("[data-status]"), function(index,object){ $(object).hide(); });
        this.$container.find('[data-status='+this.status+']').show();
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
        if (!this.cols || this.cols.length == 0) {
            this._trigger("error:showerrormsg", mlRes[this.lang]['columnError']);
            throw new Error(mlRes[this.lang]['columnError']);
        }

        this.uiEnabled(false);
        this.checkCodeColumnsAndCodelists(this.cols, this.codelists);
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

    DataEdit.prototype.checkCodeColumnsAndCodelists = function (cols, cLists) {
        log.info("cLists", cLists);

        var self = this;

        if (!cols) return;
        for (var i = 0; i < cols.length; i++)
            if (cols[i].dataType == 'code') {
                if (!cLists) {
                    var err = mlRes[self.lang]['missingCodelist'];
                    self._trigger("error:showerrormsg", err + cols[i].id);
                    throw new Error(err + cols[i].id);
                }
                //TODO: extend to multiple codelists
                var cListId = cols[i].domain.codes[0].idCodeList;
                if (cols[i].domain.codes[0].version) cListId = cListId + "|" + cols[i].domain.codes[0].version;
                if (!(cListId in cLists)){
                    var err1 = mlRes[self.lang]['missingCodelistSpecificStart'];
                    var err2 = mlRes[self.lang]['missingCodelistSpecificEnd'];
                    self._trigger("error:showerrormsg", err1 + cListId + err2 + cols[i].id );
                    throw new Error(err1 + cListId + err2 + cols[i].id );
                }
            }
    };

    DataEdit.prototype.getData = function () {
        var data = this.dataEditor.getData();
        this.updateValidation(data);
        var valRes = this.getValidationResults();

        if (valRes == null || valRes.length == 0)
            return data;
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
        log.info(this.$dataEditor);
        this.$container.find('#btnAddRow').html(mlRes[this.lang]['add']);
        this.$container.find(p.DataMatchColumn).html(mlRes[this.lang]['DataMatchColumn']);
        this.$container.find(p.btnCsvMatcherOk).html(mlRes[this.lang]['ok']);
        this.$container.find(p.btnCsvMatcherCancel).html(mlRes[this.lang]['cancel']);

        this.$container.find(p.DataDuplicateFound).html(mlRes[this.lang]['DataDuplicateFound']);
        this.$container.find(p.btnDataMergeKeepNew).html(mlRes[this.lang]['btnDataMergeKeepNew']);
        this.$container.find(p.btnDataMergeKeepOld).html(mlRes[this.lang]['btnDataMergeKeepOld']);
        this.$container.find(p.btnDataMergeCancel).html(mlRes[this.lang]['cancel']);

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
        var valCSV = validator.validate(this.getColumns(), this.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

        if (valCSV && valCSV.length > 0) {
            //log.info("valRes got errors");
            for (var n = 0; n < valCSV.length; n++) {
                log.info("valRes: " + [valCSV[n].type] + " - codelist: " + valCSV[n].codelistId + " - codes: " + valCSV[n].codes.join(','));
                //this._trigger("error:showerrormsg", [valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
            }
            this._trigger("error:showerrormsg", mlRes[this.lang][valCSV[0].type]);
            log.info(mlRes[this.lang][valCSV[0].type]);
            //console.log(mlRes[this.lang][valCSV[0].type]);
            this._trigger("data:restoreupload");
        }
        this.updateValRes(valCSV);

        //log.info("uhm, variables", dv, data, validator, valRes);

        if (valRes && valRes.length > 0) {
            //log.info("valRes got errors");
            for (var n = 0; n < valRes.length; n++) {
                log.info("valRes: " + [valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
                //this._trigger("error:showerrormsg", [valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
            }
            this._trigger("error:showerrormsg", mlRes[this.lang][valRes[0].type]);
            log.info(mlRes[this.lang][valRes[0].type]);
            this._trigger("data:restoreupload");
        }
        this.updateValRes(valRes);

        //Validates the CSV contents
        var wrongDatatypes = dv.checkWrongDataTypes(this.getColumns(), this.codelists, this.tmpCsvData);
        this.updateValRes(wrongDatatypes);
        //log.info("wrongDatatypes", wrongDatatypes);
        if (wrongDatatypes && wrongDatatypes.length > 0) {
            //log.info("wrongDatatypes got errors");
            for (n = 0; n < wrongDatatypes.length; n++) {
                log.info("wrongDatatypes: " + [wrongDatatypes[n].type] + " - Row: " + wrongDatatypes[n].dataIndex);
                //this._trigger("error:showerrormsg", [wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
            }
            this._trigger("error:showerrormsg", mlRes[this.lang][wrongDatatypes[0].type]);
            log.info(mlRes[this.lang][wrongDatatypes[0].type]);
            //Don't merge, return.
            //log.info("Don't merge, return.");
            this._switchPanelVisibility($((s.dataEditorContainer)));
            this._trigger("data:restoreupload");
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
        this.setStatus('loaded');
        //this.tmpCsvData = csvData;
        if (keyDuplicates && keyDuplicates.length > 0) {
            this._switchPanelVisibility($((s.dataUploadContainer)));
        } else {
            this._CSVLoadedMergeData('keepNew');
        }

    };

    DataEdit.prototype.csvLoaded = function (data, conf, separator) {
        log.info('csvLoaded', data);

        var self = this;
        var conv = new CSV_To_Dataset(conf, separator);

        this.setStatus('loaded');
        conv.convert(data);

        this.tmpCsvCols = conv.getColumns();
        this.tmpCsvData = conv.getData();

        var validator = Validator_CSV;

        this.$csvMatcherOkButton = $('#btnCsvMatcherOk');
        this.$csvMatcherCancelButton = $('#btnCsvMatcherCancel');

        this.$csvMatcherOkButton.off();
        this.$csvMatcherCancelButton.off();

        //log.info(this.$csvMatcherOkButton, this.$csvMatcherCancelButton);

        this.columnsMatch.render($('div#divCsvMatcher'));

        this.$csvMatcherOkButton.on("click", function () {
            self.tmpCsvCols = self.columnsMatch.getCsvCols();
            self.tmpCsvData = self.columnsMatch.getCsvData();
            self.setStatus('loading');
            self._CSVLoadedCheckDuplicates();

        });

        this.$csvMatcherCancelButton.on("click", function () {
            $('div#btnCsvMatcherCancel').off("click");
            $('div#btnCsvMatcherOk').off("click");
            self.$valResView.hide();
            self.tmpCsvData = null;
            self.tmpCsvCols = null;
            self._switchPanelVisibility($((s.dataEditorContainer)));
            self._trigger("data:restoreupload");
        });


        //Validates the CSV structure (null columns, less columns than the DSD...)
        var valRes = validator.validate(this.getColumns(), this.getCodelists(), this.tmpCsvCols, this.tmpCsvData);
        this.updateValRes(valRes);
        if (valRes && valRes.length > 0) {
            for (var n = 0; n < valRes.length; n++) {
                log.info(valRes[n].type);
                //this._trigger("error:showerrormsg", valRes[n]);
            }
            this._trigger("error:showerrormsg", mlRes[this.lang][valRes[0].type]);
            log.info(mlRes[this.lang][valRes[0].type]);
            this._trigger("data:restoreupload");
            return;
        }

        log.info(this);

        this._switchPanelVisibility($((s.dataUploadColsMatch)));

        this.columnsMatch.setData(this.cols, this.tmpCsvCols, this.tmpCsvData);

        //Validates the CSV contents
        var dv = new Data_Validator();
        var wrongDatatypes = dv.checkWrongDataTypes(this.getColumns(), this.codelists, this.tmpCsvData);

        if (wrongDatatypes && wrongDatatypes.length > 0) {
            for (n = 0; n < wrongDatatypes.length; n++) {
                //this.updateValRes(wrongDatatypes);
                var title = wrongDatatypes[n].colId[this.lang.toLowerCase()] || wrongDatatypes[n].colId[Object.keys(wrongDatatypes[n].colId)[0]]
                log.info("wrongDatatypes>" + [wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex, wrongDatatypes[n].cListUID, title);
                //this._trigger("error:showerrormsg", [wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
            }
            if (this.tmpCsvData.length == wrongDatatypes.length) this._trigger("error:showerrormsg", mlRes[this.lang]['CodeListError']);
            log.info(mlRes[this.lang][wrongDatatypes[0].error]);
            this._trigger("error:showerrormsg", mlRes[this.lang][wrongDatatypes[0].error]);
            //this._trigger("data:restoreupload");
            return;
        }

    };

    return DataEdit;
});