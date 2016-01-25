﻿define([
        'jquery',
        'fx-DataEditor/js/DataEditor/simpleEditors/RowEditorPopup',
        'text!fx-DataEditor/html/DataEditor/simpleEditors/DataEditor.htm',
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

            /*
            var me = this;
            this.$cnt.find(h.btnEditRowCanc).on('click', function () {
                me.$editWindow.modal('hide');
            });
            this.$cnt.find(h.btnEditRowOk).on('click', function () { me.rowEditOk(); });
            this.$editWindow.on('hidden.bs.modal', function (e) {
                me.rowEditor.reset();
                me.$editWindow.off("keyup");
            });
            */
            this._bindEvents();
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
        };

        DataEditorJQX.prototype._bindEvents = function () {
            var me = this;
            this.$cnt.find(h.btnEditRowCanc).on('click', function () {
                if (me.rowEditor.changed()) {
                    if (!confirm(mlRes.unsavedData))
                        return;
                }
                me.$editWindow.modal('hide');
            });
            this.$cnt.find(h.btnEditRowOk).on('click', function () { me.rowEditOk(); });
            this.$editWindow.on('hidden.bs.modal', function (e) {
                me.rowEditor.reset();
                me.$editWindow.off("keyup");
            });
        };

        DataEditorJQX.prototype._unbindEvents = function () {
            this.$cnt.find(h.btnEditRowCanc).off('click');
            this.$cnt.find(h.btnEditRowOk).off('click');
            this.$editWindow.off('hidden.bs.modal');
            this.$tBody.find('.' + h.editButtonsClass).off('click');
            this.$tBody.find('.' + h.delButtonsClass).off('click');
        };

        DataEditorJQX.prototype.destroy = function () {
            this._unbindEvents();
            this.rowEditor.destroy();
            this.$tBody.html('');
        };

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
        DataEditorJQX.prototype.appendData = function (data) {
            if (!this.cols)
                throw new Error("Cannot append data without table structure, use setColumns before setData");
            if (!data)
                return;
            Array.prototype.push.apply(this.data, data);
            this.updateTable();
        };
        DataEditorJQX.prototype.removeAllData = function () {
            this.data = [];
            this.updateTable();
        };
        DataEditorJQX.prototype.updateTableHeader = function () {
            var tHead = this.$cnt.find(h.tblDataHead);
            tHead.html('');
            //tHead.append('<th style="display:none;"></th>');
            tHead.append('<th>#</th>');
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
        DataEditorJQX.prototype.getRowByRowId = function (rowId) {
            //Test which one is faster
            /*return this.$tBody.find('tr td:first-child').filter(function () {
                console.log($(this).html()==rowId);
                return ($(this).html() == rowId);
            }).closest('tr');*/

            var rows = this.$tBody.find('tr');
            for (var i = 0; i < rows.length; i++) {
                if (rowId == $(rows[i]).find('td:first').html())
                    return $(rows[i]);
            };
            return null;
        };

        function createTblRow(idx, cols, codelists, row, editControls) {
            var toRet = '<tr>';
            //toRet += '<td style="display:none;">' + idx + '</td>'
            toRet += '<td>' + idx + '</td>'
            for (var i = 0; i < row.length; i++) {
                toRet += '<td>';
                if (row[i] === null)
                    toRet += '';
                else if (cols[i].dataType == 'code')
                    toRet += addLabelToData(cols[i], codelists, row[i], this.lang);
                else {
                    toRet += row[i];
                }
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
            if (lbl === null)
                return '';
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
                     this.setCellError(valRes[i].dataIndex, valRes[i].colId);
                 else
                     this.setRowError(valRes[i].dataIndex, valRes[i].colId);
             }*/


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
        DataEditorJQX.prototype.setCellError = function (rowIdx, colId) {
            /*var colIndex = -1;
            for (var i = 0; i < this.cols.length; i++) {
                if (colId == this.cols[i]) {
                    colIndex = i;
                }
            }
            var row = $tBody.find('td:first');
            console.log(row);*/


        };

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
        }

        return DataEditorJQX;
    });