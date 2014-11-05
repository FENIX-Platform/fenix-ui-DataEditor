define([
'jquery',
'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
'jqxall',
'fx-DataEditor/js/DataEditor/simpleEditors/DataEditorJQX',
'fx-DataEditor/js/DataEditor/simpleEditors/ValidationResultsViewer',
'fx-DataEditor/js/DataEditor/helpers/ResourcesDownloader',
'fx-DataEditor/js/DataEditor/helpers/DataServices',
'fx-DataEditor/js/DataEditor/helpers/Data_Validator',
'text!fx-DataEditor/templates/DataEditor/DataEdit.htm'
],
function ($, mlRes, jqx, DataEditor, ValidationResultsViewer, ResourcesDownloader, DataServices, Data_Validator, DataEditHTML) {
    var DataEdit = function () {
        this.widgetName = "DataEdit";
        this.$container;

        this.dataEditor;
        this.$dataEditor;

        this.valResView;
        this.$valResView;

        this.cols;
        this.data;

        this.dataLang = 'EN';
    };

    //Render - creation
    DataEdit.prototype.render = function (container) {
        this.$container = container;
        this.$container.html(DataEditHTML);

        this.$dataEditor = this.$container.find('#divDataEditor');
        this.dataEditor = new DataEditor();
        this.dataEditor.render(this.$container.find('#divDataGrid'), this.dataLang);

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

    DataEdit.prototype.setData = function (columns, data) {
        this.cols = columns;
        this.data = data;
        this.dataToGrid();
    }

    DataEdit.prototype.getData = function ()
    { return this.dataEditor.getData(); }

    DataEdit.prototype.dataToGrid = function () {
        this.dataEditor.setColumns(this.cols);
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
    DataEdit.prototype.setDataLang = function (langCode) {
        this.dataEditor.setDataLang(langCode);
    }
    //END Multilang

    return DataEdit;
});
