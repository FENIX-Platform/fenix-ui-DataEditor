define([
        'jquery',
        'jqxall',
        'fx-DataEditor/js/DataEditor/helpers/MLUtils',
        'fx-DataEditor/js/DataEditor/simpleEditors/rE/RowEditorFactory'
],
function ($, jqx, MLUtils, reFactory) {
    var widgetName = "DataEditorPopup";
    var yMax = 3000;
    var yMin = 0;
    //var EVT_VALUE_CHANGED = 'valueChanged.' + widgetName + '.fenix';

    var defConfig = { YMin: 0, YMax: 3000, decimalDigits: 5 };
    var reFactory = new reFactory();

    var RowEditorPopupJQX = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);

        this.$window;
        this.cols;
        this.codelists;

        this.lang = 'EN';
        if (localStorage.getItem('locale'))
            this.lang = localStorage.getItem('locale');

        this.editors = [];
        this.uidInEdit = -1;
    };

    RowEditorPopupJQX.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$window = container;
    }
    RowEditorPopupJQX.prototype.setColumns = function (cols, codelists) {
        this.cols = cols;
        this.codelists = codelists;
        if (!cols) {
            return;
        }
        this.createStrucure();
    }

    RowEditorPopupJQX.prototype.createStrucure = function () {
        this.editors = [];

        var $tbl = this.$window.find('#tblRowEditor');
        var tBody = $tbl.find('tbody');
        var toAppend;
        for (var i = 0; i < this.cols.length; i++) {
            toAppend = '<tr>';
            toAppend += '<td>' + MLUtils_getAvailableString(this.cols[i].title, this.lang) + '</td>';
            toAppend += '<td><div id="' + generateEditFiledId(this.cols[i].id) + '"></div></td>';
            toAppend += '</tr>';
            tBody.append(toAppend);
        }
        for (var i = 0; i < this.cols.length; i++) {
            var col = this.cols[i];
            var cnt = tBody.find('#' + generateEditFiledId(col.id));
            var cfg = null;
            this.editors[i] = reFactory.create(col.dataType, cfg);

            switch (col.dataType) {
                case 'code':
                    var codelistUid = col.domain.codes[0].idCodeList;
                    if (col.domain.codes[0].version)
                        codelistUid += "|" + col.domain.codes[0].version;
                    this.editors[i].render(cnt, null, [this.codelists[codelistUid]]);
                    break;
                case 'customCode':
                    //ADD custom code edit
                    break;
                case 'year':
                    var yMin = this.config.YMin;
                    var yMax = this.config.YMax;
                    if (col.domain && col.domain.period) {
                        yMin = col.domain.period.from;
                        yMax = col.domain.period.to;
                    }
                    this.editors[i].render(cnt, { yMin: yMin, yMax: yMax });
                    break;
                case 'number':
                case 'percentage':
                    this.editors[i].render(cnt, { decimalDigits: this.config.decimalDigits });
                    break;
                case 'month':
                case 'date':
                case 'string':
                case 'boolean':
                    this.editors[i].render(cnt, null);
                    break;
            }
        }
    }

    function generateEditFiledId(id) {
        return 'trRowEdit_' + id;
    }
    RowEditorPopupJQX.prototype.reset = function (row) {
        this.uidInEdit = -1;
        if (!this.cols)
            return;
        for (var i = 0; i < this.cols.length; i++) {
            this.editors[i].reset();
        }
    }

    RowEditorPopupJQX.prototype.isValid = function () {
        for (var i = 0; i < this.cols.length; i++)
            if (!this.editors[i].isValid())
                return false;
        return true;
    }

    RowEditorPopupJQX.prototype.setRow = function (row) {
        this.reset();
        if (!this.cols)
            throw new Error('cannot set row when columns are null');
        if (row.uid != 'undefined')
            this.uidInEdit = row.uid;
        else
            this.uidInEdit = -1;
        for (var i = 0; i < this.cols.length; i++)
            if (this.editors[i]) {
                this.editors[i].setValue(row[this.cols[i].id]);
                if (this.cols[i].key)
                    this.editors[i].isMandatory(true);
            }
            else
                throw new Error('Editor cannot be null for dataType ' + this.cols[i].dataType);
    }
    RowEditorPopupJQX.prototype.getRow = function (row) {
        if (!this.cols)
            throw new Error('cannot get row when columns are null');
        var toRet = { uid: this.uidInEdit };
        for (var i = 0; i < this.cols.length; i++)
            toRet[this.cols[i].id] = this.editors[i].getValue();
        return toRet;
    }

    return RowEditorPopupJQX;
});