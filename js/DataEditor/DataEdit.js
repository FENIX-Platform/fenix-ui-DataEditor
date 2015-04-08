define([
'jquery',
'jqxall',
'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
'fx-DataEditor/js/DataEditor/simpleEditors/DataEditorJQX',
'fx-DataEditor/js/DataEditor/simpleEditors/ValidationResultsViewer',
'fx-DataEditor/js/DataEditor/helpers/Data_Validator',
'fx-DataEditor/js/DataEditor/dataConnectors/Connector_D3S',
'text!fx-DataEditor/templates/DataEditor/DataEdit.htm'
],
function ($, jqx, mlRes, DataEditor, ValidationResultsViewer, Data_Validator, Connector, DataEditHTML) {

    var widgetName = "DataEdit";
    var defConfig = {};

    var DataEdit = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);

        this.$container;

        this.dataEditor;
        this.$dataEditor;

        this.valResView;
        this.$valResView;

        this.cols;
        this.data;
        this.codelists;

        this.editEnabled = true;
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
        this.$dataEditor.on('valueChanged.DataEditor.fenix', function (evt, param) { me.updateValidation(param.allData); });
        this.$dataEditor.on('rowAdded.DataEditor.fenix', function (evt, param) { me.updateValidation(param.allData); });
        this.$dataEditor.on('rowDeleted.DataEditor.fenix', function (evt, param) { me.updateValidation(param.allData); });
        this.$dataEditor.on('gridRendered.DataEditor.fenix', function (evt, param) { me.updateValidation(me.data); });

        this.$dataEditor.find('#btnAddRow').on('click', function (args) { me.dataEditor.newRow(); });
        //this.$dataEditor.find('#btnDelRow').click(function (args) { me.dataEditor.deleteSelectedRow(); });

        if (callB)
            callB();
    }

    DataEdit.prototype.updateValidation = function (dataToValidate) {
        var val = new Data_Validator();
        var valRes = val.validate(this.cols, dataToValidate);
        this.updateValRes(valRes);
        this.dataEditor.showValidationResults(valRes);
    }

    //DataEdit.prototype.setColumns = function (columns, codelists) {
    DataEdit.prototype.setColumns = function (columns) {
        //function getCodelists(cols, cfg, callB) {
        this.cols = columns;
        if (!this.cols || this.cols.length == 0)
            throw new Error("At least one column must be defined");

        this.uiEnabled(false);
        var me = this;
        getCodelists(this.cols, this.config, function (d) {
            me.codelists = d;
            //Check if codelist and code columns are matching
            checkCodeColumnsAndCodelists(me.cols, me.codelists);
            me.dataEditor.setColumns(me.cols, me.codelists);

            if (me.data)
                me.dataEditor.setData(me.data);
            me.uiEnabled(true);
        })
    }

    DataEdit.prototype.uiEnabled = function (enabled) {
        if (enabled) {
            this.$dataEditor.find('#btnAddRow').removeAttr('disabled');
            this.$dataEditor.removeAttr('disabled');
        }
        else {
            this.$dataEditor.find('#btnAddRow').attr('disabled', 'disabled');
            this.$dataEditor.attr('disabled', 'disabled');
        }
    }

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
    }

    DataEdit.prototype.getData = function () { return this.dataEditor.getData(); }
    DataEdit.prototype.setData = function (data) {
        this.data = data;
        if (this.cols)
            this.dataEditor.setData(this.data);
    }

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
    }

    var getColumnDistinct = function (data, idx) {
        var toRet = [];
        if (!data)
            return null;
        for (var i = 0; i < data.length; i++)
            if ($.inArray(data[i][idx], toRet) == -1)
                toRet.push(data[i][idx]);
        return toRet;
    }
    //End column Distincts


    DataEdit.prototype.updateValRes = function (valRes) {
        if (!valRes)
            this.$valResView.hide();
        else if (valRes.length == 0)
            this.$valResView.hide();
        else {
            this.$valResView.show();
            this.valResView.setValidationResults(valRes);
        }
    }

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
    }
    DataEdit.prototype.destroy = function () {
        this.$dataEditor.off('valueChanged.DataEditor.fenix');
        this.$dataEditor.off('rowAdded.DataEditor.fenix');
        this.$dataEditor.off('rowDeleted.DataEditor.fenix');
        this.$dataEditor.off('gridRendered.DataEditor.fenix');
        this.$dataEditor.find('#btnAddRow').off('click');
        this.dataEditor.destroy();
    }

    //Connections
    function getCodelists(cols, cfg, callB) {
        if (!cols)
            return null;
        //if (cfg.D3SConnector)
        var conn = new Connector(cfg.D3SConnector);

        var codelistsToGet = [];
        var toRet = {};
        for (var i = 0; i < cols.length; i++)
            if (cols[i].dataType == 'code') {
                codelistsToGet.push({ uid: cols[i].domain.codes[0].idCodeList, version: cols[i].domain.codes[0].version });
            }
        //var conn = new Connector();
        conn.getCodelists(codelistsToGet, function (cLists) {
            if (callB)
                callB(cLists);
        })
    }
    //END Connections

    //MultiLang
    DataEdit.prototype.doML = function () {
        this.$dataEditor.find('#btnAddRow').html(mlRes['add']);
    }
    //END Multilang

    return DataEdit;
});