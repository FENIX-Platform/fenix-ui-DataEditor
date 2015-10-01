define([
'jquery',
'jqxall',
'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
'fx-DataEditor/js/DataEditor/simpleEditors/DataEditorJQX',
'fx-DataEditor/js/DataEditor/simpleEditors/ValidationResultsViewer',
'fx-DataEditor/js/DataEditor/helpers/Data_Validator',
'text!fx-DataEditor/html/DataEditor/DataEdit.htm',
'amplify'
],
function ($, jqx, mlRes, DataEditor, ValidationResultsViewer, Data_Validator, DataEditHTML) {

    var widgetName = "DataEdit";
    var defConfig = {};
    var e = {
        dataEditorValueChanged: 'valueChanged.DataEditor.fenix',
        dataEditorRowAdded: 'rowAdded.DataEditor.fenix',
        dataEditorRowDeleted: 'rowDeleted.DataEditor.fenix'
    };

    var DataEdit = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);

        this.$container;

        this.dataEditor;
        this.$dataEditor;

        this.valResView;
        this.$valResView;

        this.cols;
        //this.data;
        this.codelists;

        this.editEnabled = true;
        this.changed = false;
    };

    //Render - creation
    DataEdit.prototype.render = function (container, config, callB) {
        $.extend(true, this.config, config);

        this.$container = container;
        this.$container.html(DataEditHTML);

        this.$dataEditor = this.$container.find('#divDataEditor');
        this.dataEditor = new DataEditor();
        this.dataEditor.render(this.$container.find('#divDataEdit'), this.config);

        this.$valResView = this.$container.find('#divValRes');
        this.valResView = new ValidationResultsViewer();
        this.valResView.render(this.$valResView);

        this.doML();

        var me = this;

        //Merge valueChanged, rowAdded and rowDeleted?
        amplify.subscribe(e.dataEditorValueChanged, this, this.updateValidationOnChange);
        amplify.subscribe(e.dataEditorRowAdded, this, this.updateValidationOnChange);
        amplify.subscribe(e.dataEditorRowDeleted, this, this.updateValidationOnChange);

        this.$dataEditor.find('#btnAddRow').on('click', function (args) { me.dataEditor.newRow(); });

        if (callB)
            callB();
    }
    //Validation
    DataEdit.prototype.updateValidation = function (data) {
        this.changed = true;
        var val = new Data_Validator();
        var valRes = val.validate(this.cols, data);
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
    //END Validation

    DataEdit.prototype.getValidationResults = function () {
        var val = new Data_Validator();
        return val.validate(this.cols, this.dataEditor.getData());
    };

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
        if (!cols)
            return;
        for (var i = 0; i < cols.length; i++)
            if (cols[i].dataType == 'code') {
                if (!cLists)
                    throw new Error("Codelist for the column " + cols[i].id + " missing");
                //TODO: extend to multiple codelists
                var cListId = cols[i].domain.codes[0].idCodeList;
                if (cols[i].domain.codes[0].version)
                    cListId = cListId + "|" + cols[i].domain.codes[0].version;

                if (!(cListId in cLists))
                    throw new Error("Codelist for the column " + cols[i].id + " missing");
            }
    };

    DataEdit.prototype.getData = function () {
        var valRes = this.getValidationResults();
        if (valRes == null || valRes.length == 0)
            return this.dataEditor.getData();
        else
            return false;
    };
    DataEdit.prototype.setData = function (data) {
        //this.data = data;
        if (this.cols)
            this.dataEditor.setData(data);
        this.changed = false;
    };
    DataEdit.prototype.appendData = function (data) {
        //this.data = data;
        if (this.cols)
            this.dataEditor.appendData(data);
        this.changed = true;
        this.updateValidation(this.dataEditor.getData());
    };
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
        /*
        this.$dataEditor.off('valueChanged.DataEditor.fenix');
        */
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

    return DataEdit;
});