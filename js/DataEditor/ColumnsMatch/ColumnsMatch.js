define([
        'jquery',
        'text!fx-DataEditor/html/DataEditor/ColumnsMatch/ColumnsMatch.htm',
        'fx-DataEditor/js/DataEditor/helpers/MLUtils'
],
    function ($, colsMatchHTML, MLUtils) {
        var widgetName = "ColumnsMatch";

        var defConfig = {
            maxRows: 5
        };
        var e = {
            /*EVT_VALUE_CHANGED: 'valueChanged.' + widgetName + '.fenix',
            EVT_ROW_ADDED: 'rowAdded.' + widgetName + '.fenix',
            EVT_ROW_DELETED: 'rowDeleted.' + widgetName + '.fenix'*/
        };
        var h = {
            trDSD: "#trDSD",
            trCSV: "#trCSV",
            tblColMatch: "#tblColMatch"
        };
        var html = {
            rowDSD: '<td>%title%<br/>type: %type%</td>',
            //rowCSV: '<td id="csvHead" ondrop="this.drop(event)" ondragover="this.allowDrop(event)"><span id="%colId%" draggable="true" ondragstart="this.drag(event)">%colId%</span></td>'
            rowCSV: '<td class="csvHead" draggable="true"><div id="%colId%" draggable="true">%colId%</div></td>'
        };

        var ColumnsMatch = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            this.$cnt;

            this.$tblColMatch;
            this.$trDsd;
            this.$trCsv;

            this.dsd;
            this.csvCols;
            this.csvData;

            this.lang = 'EN';
        };

        //Render - creation
        ColumnsMatch.prototype.render = function (container, config, callB) {
            $.extend(true, this.config, config);

            this.$cnt = container;
            this.$cnt.html(colsMatchHTML);

            this.$tblColMatch = this.$cnt.find(h.tblColMatch);
            this.$trDsd = this.$cnt.find(h.trDSD);
            this.$trCsv = this.$cnt.find(h.trCSV);

            this._bindEvents();

            this._doML();
            if (callB) callB();
        }

        ColumnsMatch.prototype.setData = function (dsd, csvCols, csvData) {
            this.dsd = dsd;
            this.csvCols = csvCols;
            this.csvData = csvData;
            var cols = dsd.columns;
            this.$trDsd.html('');
            this.$trCsv.html('');
            if (!cols) return;
            for (var i = 0; i < cols.length; i++) {
                var title = MLUtils_getAvailableString(cols[i].title, this.lang);
                var toSet = html.rowDSD.replace('%title%', title);
                toSet = toSet.replace('%type%', cols[i].dataType);

                this.$trDsd.append(toSet);
            }

            for (i = 0; i < csvCols.length; i++) {
                toSet = html.rowCSV.replace('%colId%', csvCols[i]);
                toSet = toSet.replace('%colId%', csvCols[i]);
                this.$trCsv.append(toSet);
                this.bindCsvHeadEvents();
            }
            this._updateView(this.csvCols, this.csvData);
        }
        ColumnsMatch.prototype.getCsvCols = function () {
            var newOrder = this._getColIndexes(this.csvCols);
            var toRet = [];
            for (var i = 0; i < this.dsd.columns.length; i++) {
                toRet[i] = this.csvCols[newOrder[i]];
            }
            return toRet;
        }
        ColumnsMatch.prototype.getCsvData = function () {
            var newOrder = this._getColIndexes(this.csvCols);
            var toRet = [];
            for (var i = 0; i < this.csvData.length; i++) {
                var row = [];
                for (var j = 0; j < this.dsd.columns.length; j++) {
                    row[j] = this.csvData[i][newOrder[j]];
                }
                toRet[i] = row;
            }
            return toRet;
        }

        ColumnsMatch.prototype._updateView = function (csvCols, csvData) {
            var maxRCount = this.config.maxRows;
            if (csvData.length < maxRCount) {
                maxRCount = csvData.length
            }
            this._removeDataRows();
            var idx = this._getColIndexes(csvCols);
            var toAdd = "";
            for (i = 0; i < maxRCount; i++) {
                toAdd += "<tr>" + csvRowToRow(csvData[i], idx) + "</tr>";
            }
            toAdd += "<tr>";
            for (i = 0; i < idx.length; i++) {
                toAdd += "<td>...</td>";
            }
            toAdd += "</tr>";
            this.$tblColMatch.append(toAdd);
        }
        ColumnsMatch.prototype._getColIndexes = function (csvCols) {
            var $tdCsv = this.$trCsv.find('td');
            var toRet = [];
            for (var i = 0; i < $tdCsv.length; i++) {
                var colId = $($tdCsv[i]).find('div')[0].id;
                toRet[i] = findIndex(colId, csvCols);
            }
            return toRet;
        }
        ColumnsMatch.prototype._removeDataRows = function () {
            var rows = this.$tblColMatch.find("tr");
            if (rows.length > 2) {
                for (var i = 2; i < rows.length; i++) {
                    rows[i].remove();
                }
            }
        }
        function findIndex(colId, cols) {
            for (var i = 0; i < cols.length; i++) {
                if (cols[i] == colId)
                    return i;
            }
            return -1;
        }
        function csvRowToRow(csvRow, csvOrder) {
            var toRet = "";
            for (var i = 0; i < csvOrder.length; i++) {
                toRet += "<td>";
                toRet += csvRow[csvOrder[i]];
                toRet += "</td>";
            }
            return toRet;
        }

        ColumnsMatch.prototype._bindEvents = function () { }

        ColumnsMatch.prototype.bindCsvHeadEvents = function () {
            var tds = this.$trCsv.find('.csvHead');
            var me = this;
            for (var i = 0; i < tds.length; i++) {
                $(tds[i]).on('drop', function (event) { me.drop(event); });
                $(tds[i]).on('dragover', me.allowDrop);
                $(tds[i]).find('div').on('dragover', me.allowDrop);
                $(tds[i]).find('div').on('dragstart', me.drag);
            }
        }
        ColumnsMatch.prototype._doML = function () { }

        ColumnsMatch.prototype.drag = function (ev) {
            ev.originalEvent.dataTransfer.setData("text", ev.target.id);
        }
        ColumnsMatch.prototype.allowDrop = function (ev) {
            ev.preventDefault();
        }
        ColumnsMatch.prototype.drop = function (ev) {
            ev.preventDefault();
            var data = ev.originalEvent.dataTransfer.getData("text");
            console.log($('#' + data));
            console.log($(data));
            console.log(data);
            var $toMoveSrc = $('div#' + data);
            var $cntSrc = $toMoveSrc.parent();

            var $toMoveDest;
            var $cntDest;
            if ($(ev.target).is('div')) {
                $toMoveDest = $(ev.target);
                $cntDest = $toMoveDest.parent();
            }
            else {
                $cntDest = $(ev.target);
                $toMoveDest = $cntDest.find('div');
            }

            $toMoveDest.remove();
            $toMoveSrc.remove();
            $cntDest.append($toMoveSrc);
            $cntSrc.append($toMoveDest);

            this._updateView(this.csvCols, this.csvData);
            this.bindCsvHeadEvents();
        }

        return ColumnsMatch;
    });