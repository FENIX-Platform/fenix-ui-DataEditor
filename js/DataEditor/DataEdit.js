﻿define([
'jquery',
'jqxall',
'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
'fx-DataEditor/js/DataEditor/simpleEditors/DataEditorJQX',
'fx-DataEditor/js/DataEditor/simpleEditors/ValidationResultsViewer',
'fx-DataEditor/js/DataEditor/helpers/Data_Validator',
'text!fx-DataEditor/templates/DataEditor/DataEdit.htm'
],
function ($, jqx, mlRes, DataEditor, ValidationResultsViewer, Data_Validator, DataEditHTML) {

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
    };

    //Render - creation
    DataEdit.prototype.render = function (container, config, callB) {
        $.extend(true, this.config, config);

        this.$container = container;
        this.$container.html(DataEditHTML);

        this.$dataEditor = this.$container.find('#divDataEditor');
        this.dataEditor = new DataEditor();
        this.dataEditor.render(this.$container.find('#divDataGrid'), this.config);

        this.$valResView = this.$container.find('#divValRes');
        this.valResView = new ValidationResultsViewer();
        this.valResView.render(this.$valResView);

        this.doML();

        var me = this;
        //Merge valueChanged, rowAdded and rowDeleted?
        this.$dataEditor.on('valueChanged.DataEditor.fenix', function (evt, param) {
            var val = new Data_Validator();
            var valRes = val.validate(me.cols, param.allData);
            me.updateValRes(valRes);
            me.dataEditor.showValidationResults(valRes);
        });
        this.$dataEditor.on('rowAdded.DataEditor.fenix', function (evt, param) {
            var val = new Data_Validator();
            var valRes = val.validate(me.cols, param.allData);
            me.updateValRes(valRes);
            me.dataEditor.showValidationResults(valRes);
        });
        this.$dataEditor.on('rowDeleted.DataEditor.fenix', function (evt, param) {
            var val = new Data_Validator();
            var valRes = val.validate(me.cols, param.allData);
            me.updateValRes(valRes);
            me.dataEditor.showValidationResults(valRes);
        });

        this.$dataEditor.on('gridRendered.DataEditor.fenix', function (evt, param) {
            var val = new Data_Validator();
            var valRes = val.validate(me.cols, me.data);

            me.dataEditor.showValidationResults(valRes);
            me.updateValRes(valRes);
        });

        this.$dataEditor.find('#btnAddRow').click(function (args) { me.dataEditor.newRow(); });
        this.$dataEditor.find('#btnDelRow').click(function (args) { me.dataEditor.deleteSelectedRow(); });
    }

    DataEdit.prototype.setColsAndData = function (columns, codelists, data) {
        this.cols = columns;
        this.data = data;
        this.codelists = codelists;

        //Check if codelist and code columns are matching
        if (!columns || columns.length == 0)
            throw new Error("At least one column must be defined");
        checkCodeColumnsAndCodelists(columns, codelists)

        this.dataToGrid();
        }

    var checkCodeColumnsAndCodelists=function(cols, cLists)
    {
        if (!cols)
            return;
        for (var i=0;i<cols.length;i++)
            if (cols[i].dataType=='code')
            {
                if (!cLists)
                    throw new Error("Codelist for the column "+ cols[i].id + " missing");
                //TODO: extend to multiple codelists
                var cListId=cols[i].domain.codes[0].idCodeList;
                if (cols[i].domain.codes[0].version)
                    cListId=cListId + "|" + cols[i].domain.codes[0].version;

                if (!(cListId in cLists))
                    throw new Error("Codelist for the column "+ cols[i].id + " missing");
            }
    }

    DataEdit.prototype.getData = function ()
    { return this.dataEditor.getData(); }

    DataEdit.prototype.dataToGrid = function () {
        this.dataEditor.setColumns(this.cols, this.codelists);
        this.dataEditor.setData(this.data);
    }

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

    //MultiLang
    DataEdit.prototype.doML = function () {
        this.$dataEditor.find('#btnAddRow').html(mlRes['add']);
        this.$dataEditor.find('#btnDelRow').html(mlRes['delete']);
    }
    //END Multilang

    return DataEdit;
});
