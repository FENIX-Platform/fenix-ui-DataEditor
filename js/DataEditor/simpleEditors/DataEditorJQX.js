﻿define([
        'jquery',
        'fx-DataEditor/js/DataEditor/simpleEditors/RowEditorPopup',
        'text!fx-DataEditor/templates/DataEditor/simpleEditors/DataEditor.htm',
        'i18n!fx-DataEditor/multiLang/DataEditor/nls/ML_DataEdit',
        'fx-DataEditor/js/DataEditor/helpers/MLUtils',
        'bootstrap',
        'amplify'
],
    function ($, RowEditorPopup, DataEditorHTML, mlRes, MLUtils) {
        var widgetName = "DataEditor";


        var defConfig = {
            thButtons: "<th>E</th><th>D</th>"
        };
        var e = {
            EVT_VALUE_CHANGED: 'valueChanged.' + widgetName + '.fenix',
            EVT_GRID_RENDERED: 'gridRendered.' + widgetName + '.fenix',
            EVT_ROW_ADDED: 'rowAdded.' + widgetName + '.fenix',
            EVT_ROW_DELETED: 'rowDeleted.' + widgetName + '.fenix'
        };
        var h = {
            divDataGrid: '#divDataGrid',
            divRowEditorPopup: '#divRowEditorPopup',
            btnEditRowCanc: '#btnEditRowCanc',
            btnEditRowOk: '#btnEditRowOk',
            tblDataBody: '#tblDataBody',
            tblDataHead: '#tblDataHead',
            editButtonsClass: 'bE',
            delButtonsClass: 'bD'
        };
        var html = {
            btnEdit: '<button type="button" class="btn btn-default bE" data-rid=%idx%><span class="glyphicon glyphicon-pencil"></span></button>',
            btnDel: '<button type="button" class="btn btn-default bD"data-rid=%idx%><span class="glyphicon glyphicon-trash"></span></button>'
        };

        var COLOR_ERROR = "error";
        var COLOR_DEFAULT = "default";

        var DataEditorJQX = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

            this.rowEditor = new RowEditorPopup();

            this.$cnt;
            this.$editWindow;
            this.$dataGrid;
            this.cols;
            this.codelists;
            this.data = [];
            this.$tBody;
            this.editEnabled = true;

            this.lang = 'EN';
        };

        //Render - creation
        DataEditorJQX.prototype.render = function (container, config, callB) {
            $.extend(true, this.config, config);

            this.$cnt = container;
            this.$cnt.html(DataEditorHTML);
            this.$dataGrid = this.$cnt.find(h.divDataGrid);

            this.$editWindow = this.$cnt.find(h.divRowEditorPopup);
            this.rowEditor.render(this.$editWindow);

            if (localStorage.getItem('locale'))
                this.lang = localStorage.getItem('locale');

            var me = this;
            this.$cnt.find(h.btnEditRowCanc).on('click', function () {
                me.$editWindow.modal('hide');
            });
            this.$cnt.find(h.btnEditRowOk).on('click', function () { me.rowEditOk(); });
            this.$editWindow.on('hidden.bs.modal', function (e) {
                me.rowEditor.reset();
                me.$editWindow.off("keyup");
            });
            this.$tBody = this.$cnt.find(h.tblDataBody);

            this._doML();
            if (callB) callB();
        }

        DataEditorJQX.prototype.setColumns = function (cols, codelists, callB) {
            this.cols = cols;
            this.codelists = convertCodelists(codelists, this.lang);
            if (!cols) {
                return;
            }
            //The table
            this.updateTableHeader();

            //The row editor
            this.rowEditor.setColumns(this.cols, this.codelists);
            if (callB) callB();
        };
        var createTH = function (label) {
            return '<th>' + label + '</th>';
        };

        DataEditorJQX.prototype._showEditWindow = function (row) {
            this.$editWindow.modal('show');
            this.rowEditor.reset();
            if (row)
                this.rowEditor.setRow(row);

            var me = this;
            this.$editWindow.on("keyup", function (evt) {
                if (evt.keyCode == 13) {
                    me.rowEditOk();
                }
            });
        }

        DataEditorJQX.prototype.destroy = function () {
            this.$cnt.find(h.btnEditRowCanc).off('click');
            this.$cnt.find(h.btnEditRowOk).off('click');
            this.$editWindow.off('hidden.bs.modal');

            this.rowEditor.destroy();

            this.$tBody.find('.' + h.editButtonsClass).off('click');
            this.$tBody.find('.' + h.delButtonsClass).off('click');
            this.$tBody.html('');
        }

        DataEditorJQX.prototype.rowEditOk = function () {
            if (!this.rowEditor.isValid()) {
                this.rowEditor.updateValidationHelp();
                return;
            }
            var row = this.rowEditor.getRow();
            if (row.uid != -1) {//Edit
                this.data[row.uid] = row.data;
                var evtArgs = {};
                evtArgs.newData = row.data;
                evtArgs.allData = this.data;
                amplify.publish(e.EVT_VALUE_CHANGED, evtArgs);
            }
            else {//New
                this.data.push(row.data);

                var evtArgs = {};
                evtArgs.allData = this.data;
                amplify.publish(e.EVT_ROW_ADDED, evtArgs);
            }
            //DO NOT UPDATE ALL THE TABLE!!!
            this.updateTable();
            this.$editWindow.modal('hide');
        }

        DataEditorJQX.prototype.newRow = function () {
            this._showEditWindow(null);
        }

        DataEditorJQX.prototype.isEditable = function (editable) {
            this.editEnabled = editable;
            if (!this.cols)
                return;
            if (typeof (editable) == 'undefined')
                return this.editEnabled;
            this.updateTableHeader();
            this.updateTable();
        }

        //DATA
        DataEditorJQX.prototype.setData = function (data) {
            if (!this.cols)
                throw new Error("Cannot set data without table structure, use setColumns before setData");
            this.data.length = 0;
            if (!data)
                return;
            this.data = data;
            this.updateTable();
        };
        DataEditorJQX.prototype.updateTableHeader = function () {
            var tHead = this.$cnt.find(h.tblDataHead);
            tHead.html('');
            for (var i = 0; i < this.cols.length; i++) {
                //MLUtils get multilanguage string
                tHead.append(createTH(this.cols[i].title[this.lang]));
            }
            if (this.editEnabled) {
                tHead.append(this.config.thButtons);
            }
        };
        DataEditorJQX.prototype.updateTable = function () {
            this.$tBody.html('');
            if (!this.data)
                return;
            for (var i = 0; i < this.data.length; i++) {
                this.$tBody.append(createTblRow(i, this.cols, this.codelists, this.data[i], this.editEnabled));
            }
            //Attach all the events
            if (this.editEnabled) {
                var me = this;
                this.$tBody.find('.' + h.editButtonsClass).on('click', function () {
                    var rowId = $(this).data('rid');
                    me._showEditWindow({ uid: rowId, data: me.data[rowId] });
                });
                this.$tBody.find('.' + h.delButtonsClass).on('click', function () {
                    var res = confirm(mlRes.confirmDelete);
                    if (!res)
                        return;
                    me.deleteRow($(this).data('rid'));
                });
            }
        };
        DataEditorJQX.prototype.deleteRow = function (index) {
            this.data.splice(index, 1);
            this.updateTable();
            amplify.publish(e.EVT_ROW_DELETED, this.data);
        };

        function createTblRow(idx, cols, codelists, row, editControls) {
            var toRet = '<tr>';
            for (var i = 0; i < row.length; i++) {
                toRet += '<td>';
                if (cols[i].dataType == 'code')
                    toRet += addLabelToData(cols[i], codelists, row[i], this.lang);
                else
                    toRet += row[i];
                toRet += '</td>';
            }
            if (editControls) {
                toRet += '<td>' + html.btnEdit.replace('%idx%', idx) + '</td>';
                toRet += '<td>' + html.btnDel.replace('%idx%', idx) + '</td>';
            }
            toRet += '</tr>';
            return toRet;
        };
        var getCodelistUid = function (domain) {
            //Make it handle multiple codelsits
            var cListUid = domain.codes[0].idCodeList;
            if (domain.codes[0].version)
                cListUid += "|" + domain.codes[0].version;
            return cListUid;
        };
        function addLabelToData(col, codelists, data, lang) {
            //TODO Make it handle multiple Codelists
            var cListUID = getCodelistUid(col.domain);
            var lbl = getCodeLabel(codelists[cListUID].data, data);
            return lbl;
        };
        var getCodeLabel = function (codes, code) {
            if (!codes)
                return null;
            for (var i = 0; i < codes.length; i++)
                if (codes[i].code == code)
                    //return codes[i].title + " [" + code + "]";
                    return codes[i].title;
            return null;
        };

        DataEditorJQX.prototype.getData = function () {
            return this.data;
        }
        //END Data


        //Validation results
        DataEditorJQX.prototype.showValidationResults = function (valRes) {
            /* this.resetValidationResults();
        
             if (!valRes)
                 return;
             for (var i = 0; i < valRes.length; i++) {
                 if (valRes[i].colId)
                     this.setCellColor(valRes[i].dataIndex, valRes[i].colId, COLOR_ERROR);
                 else
                     this.setRowColor(valRes[i].dataIndex, COLOR_ERROR);
             }*/
        }

        DataEditorJQX.prototype.resetValidationResults = function () {
            /*var rowCount = this.$dataGrid.jqxGrid('getrows').length;
            for (var i = 0; i < rowCount; i++)
                this.setRowColor(i, COLOR_DEFAULT);*/
        }

        DataEditorJQX.prototype.setRowColor = function (rowIdx, color) {
            /*var cols = this.$dataGrid.jqxGrid('columns');
        
            for (var i = 0; i < cols.records.length; i++)
                this.setCellColor(rowIdx, cols.records[i].datafield, color);*/
        }

        DataEditorJQX.prototype.setCellColor = function (rowIdx, colId, color) {
            /*var htmlRows = this.$dataGrid.find("div[role='row']");
            var htmlRow = htmlRows[rowIdx];
            var colIdx = this.$dataGrid.jqxGrid('getcolumnindex', colId);
            var tds = $(htmlRow).find("div[role='gridcell']");
            this.changeCellBackgroundColor(tds[colIdx], color);*/
        }

        DataEditorJQX.prototype.changeCellBackgroundColor = function (htmlCell, color) {
            /*if (color == COLOR_ERROR)
                $(htmlCell).addClass("fx-red-cell");
            else if (color == COLOR_DEFAULT)
                $(htmlCell).removeClass("fx-red-cell");*/
        }

        //END Validation results

        //Codelists helpers
        function convertCodelists(codelists, lang) {
            var toRet = {};
            for (var cl in codelists) {
                toRet[cl] = { metadata: {} };
                toRet[cl].data = convertCodes(codelists[cl].data, lang);
            }
            return toRet;
        }
        //number of levels for a codelist is not always available.
        //Always call the recursive flatten
        function convertCodes(codes, lang) {
            if (!codes)
                return null;
            var toRet = [];
            recFlatten(codes, toRet, lang)
            return toRet;
        }
        /*function convertCodes(levels, codes, lang) {
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
        }*/
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

        DataEditorJQX.prototype._doML = function () {
            this.$cnt.find('#btnEditRowCanc').html(mlRes.cancel);
            this.$cnt.find('#btnEditRowOk').html(mlRes.ok);
        }

        return DataEditorJQX;
    });