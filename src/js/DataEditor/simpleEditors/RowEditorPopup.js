define([
        'jquery',
        'loglevel',
        '../../../nls/labels',
        './rE/RowEditorFactory'
],
function ($, log, MLRes, reFactory) {
    var widgetName = "DataEditorPopup";
    var yMax = 3000;
    var yMin = 0;

    var defConfig = { YMin: 0, YMax: 3000, decimalDigits: 5 };
    var reFactory = new reFactory();

    var RowEditorPopup = function (config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);

        this.$window;
        this.cols;
        this.codelists;

        this.lang = 'EN';
        if (localStorage.getItem('locale'))
            this.lang = localStorage.getItem('locale');

        this.lang = this.lang.toLowerCase();

        this.editors = [];
        this.uidInEdit = -1;

        this.oldVal = null;
    };

    RowEditorPopup.prototype.render = function (container, config) {
        $.extend(true, this.config, config);
        this.$window = container;

    }
    RowEditorPopup.prototype.setColumns = function (cols, codelists) {
        this.cols = cols;
        this.codelists = codelists;
        if (!cols) {
            return;
        }
        this.createStrucure();
    }

    RowEditorPopup.prototype.createStrucure = function () {
        this.editors = [];

        var $tbl = this.$window.find('#tblRowEditor');
        var tBody = $tbl.find('tbody');
        var toAppend;
        for (var i = 0; i < this.cols.length; i++) {
            toAppend = '<tr>';
            toAppend += '<td>' + this.cols[i].title[this.lang.toUpperCase()] + '</td>';
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
                case 'text':
                case 'bool':
                    this.editors[i].render(cnt, null);
                    break;
            }
            if (col.key)
                this.editors[i].isMandatory(true);
        }
    }

    function generateEditFiledId(id) {
        return 'trRowEdit_' + id;
    }
    RowEditorPopup.prototype.reset = function (row) {
        log.info("RowEditorPopup - reset", this.editors, this.cols.length, row)
        this.uidInEdit = -1;
        if (!this.cols) return;
        for (var i = 0; i < this.cols.length; i++) {
            this.editors[i].reset();
        }
        this.oldVal = null;
    }

    RowEditorPopup.prototype.updateValidationHelp = function () {
        if (!this.cols)
            return;
        for (var i = 0; i < this.cols.length; i++) {
            if (this.editors[i].updateValidationHelp)
                this.editors[i].updateValidationHelp();
        }
    }

    RowEditorPopup.prototype.isValid = function () {
        for (var i = 0; i < this.cols.length; i++)
            if (!this.editors[i].isValid())
                return false;
        return true;
    }

    RowEditorPopup.prototype.setRow = function (row) {
        log.info("setRow", row)
        this.reset();
        if (!this.cols)
            throw new Error('cannot set row when columns are null');
        this.oldVal = row;
        if (row.uid != 'undefined')
            this.uidInEdit = row.uid;
        else
            this.uidInEdit = -1;
        for (var i = 0; i < this.cols.length; i++)
            if (this.editors[i]) {
                this.editors[i].setValue(row.data[i]);
            }
            else
                throw new Error('Editor cannot be null for dataType ' + this.cols[i].dataType);
    }
    RowEditorPopup.prototype.getRow = function (row) {
        if (!this.cols)
            throw new Error('cannot get row when columns are null');
        var toRet = { uid: this.uidInEdit, data: [] };
        for (var i = 0; i < this.cols.length; i++) {
            var val = this.editors[i].getValue();
            if (!val)
                toRet.data[i] = null;
            else if (this.cols[i].dataType == 'number' || this.cols[i].dataType == 'percentage')
                toRet.data[i] = parseFloat(val);
            else
                toRet.data[i] = val;
        }
        return toRet;
    };

    RowEditorPopup.prototype.changed = function () {
        var newVal = this.getRow();

        if (this.oldVal == null) {
            for (var i = 0; i < this.cols.length; i++) {
                if (newVal.data[i] != '')
                    return true;
            }
        }
        else {
            for (var i = 0; i < this.cols.length; i++) {
                if (newVal.data[i] != this.oldVal.data[i])
                    return true;
            }
        }
        return false;
    };
    RowEditorPopup.prototype.destroy = function () {
        if (!this.cols)
            return;
        for (var i = 0; i < this.cols.length; i++)
            this.editors[i].destroy();
    }

    return RowEditorPopup;
});