define([
        'jquery',
        'fx-DataEditor/js/DataEditor/DataEdit',
        'fx-DataEditor/js/DataEditor/helpers/ResourcesDownloader'
//,
//'resources/DataServices',
    ],
//function ($, DataEdit, ResourcesDownloader, DataServices) {
    function ($, DataEdit, ResourcesDownloader) {
        var DataEditWr = function () {
            this.dataEdit = new DataEdit();
            this.meta;
            this.cols;
            this.data;

            this.metaConnector;
            this.dataConnector;
            this.codelistUrlFinder;
        };

        //Render - creation
        DataEditWr.prototype.render = function (container) {
            this.dataEdit.render(container);
        }

        DataEditWr.prototype.setColsAndData = function (columns, data, callB) {
            var toDL = [];
            this.cols = columns;
            this.data = data;

            var toDL = getCodelistsToDL(this.cols);

            //Download all needed codelists
            if (toDL.length > 0) {
                //var DS = new DataServices();
                if (!this.codelistUrlFinder)
                    throw new Error('A codelists URL must be set, use the setCodelistUrlFinder method');
                var urls = [];
                for (var i = 0; i < toDL.length; i++) {
                    if (toDL[i].version)
                        urls.push(this.getCodelistUrl(toDL[i].idCodeList, toDL[i].version));
                    else
                        urls.push(this.getCodelistUrl(toDL[i].idCodeList));
                }

                var resDown = new ResourcesDownloader();
                var me = this;
                resDown.downloadResources(urls, function (data) {
                    me.codelistsDownloaded(data);
                });
            }
            else {
                this.dataEdit.setData(columns, data);
            }
        }
        //Codelists
        DataEditWr.prototype.setCodelistUrlFinder = function (urlFinder) {
            this.codelistUrlFinder = urlFinder;
        }
        DataEditWr.prototype.getCodelistUrl = function (system, version) {
            if (version)
                return this.codelistUrlFinder.get(system, version);
            else
                return this.codelistUrlFinder.get(system);
        }

        //Meta and data load
        DataEditWr.prototype.setMetaAdapter = function (metaAdapter) {
            this.loadMeta(metaAdapter.source);
        }
        DataEditWr.prototype.loadMeta = function (source) {
            var me = this;
            $.ajax({
                url: source.url,
                data: source.data,
                crossDomain: true,
                dataType: "json",
                success: function (data) {
                    me.metaLoaded(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error(jqXHR, textStatus, errorThrown);
                }
            });
        }
        DataEditWr.prototype.metaLoaded = function (data, callB) {
            this.meta = data;
            this.cols = data.dsd.columns;
            this.updateGrid();
        }
        DataEditWr.prototype.loadData = function (source) {
            var me = this;
            $.ajax({
                url: source.url,
                data: source.data,
                crossDomain: true,
                dataType: "json",
                success: function (data) {
                    me.dataLoaded(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error(jqXHR, textStatus, errorThrown);
                }
            });
        }
        DataEditWr.prototype.dataLoaded = function (data) {
            this.data = data;
            this.updateGrid();
        }

        DataEditWr.prototype.setMeta = function (meta) {
            this.metaLoaded(meta);
        }
        DataEditWr.prototype.setData = function (data) {
            this.dataLoaded(data);
        }
        DataEditWr.prototype.getData = function () {
            return this.dataEdit.getData();
        }
        DataEditWr.prototype.getMeta = function () {
            return this.meta;
        }

        DataEditWr.prototype.getColumnsDistinct = function () {
            return this.dataEdit.getColumnsDistinct();
        }

        //DataEditWr.prototype.saveData = function (){ }
        DataEditWr.prototype.updateGrid = function () {
            if (!this.cols)
                return;
            /*if (!this.data)
             return;*/

            this.setColsAndData(this.cols, this.data);
        }

        //END Meta and data load

        //Codelists search/download
        var getCodelistsToDL = function (cols) {
            var toRet = [];
            if (!cols)
                return toRet;

            for (var i = 0; i < cols.length; i++) {
                if (cols[i].virtualColumn && cols[i].virtualColumn == 'INTERNAL')
                    continue;
                var tmpToDl = getCLToDL(cols[i]);
                if (tmpToDl)
                //Make sure it is not already in the list
                    if (!codesystemInArray(tmpToDl, toRet))
                        toRet.push(tmpToDl);
            }
            return toRet;
        }
        var getCLToDL = function (col) {
            if (col.dataType != 'code') return null;
            if (!col.domain.codes)
                throw new Error("Code column must have a codes field");
            //TODO: Extend to multiple codes elements
            if (!col.domain.codes[0].idCodeList)
                throw new Error("Code column must have a idCodeList field");
            return col.domain.codes[0];
        }
        var codesystemInArray = function (codeSystem, arr) {
            if (!arr)
                return false;
            for (var i = 0; i < arr.length; i++)
                //if (arr.idCodeList == codeSystem.idCodeList && arr.version == codeSystem.version)
                if (arr.idCodeList == codeSystem.idCodeList)
                    return true;
            return false;
        }

        //Codelists downloaded, attach them to the col's codes property
        DataEditWr.prototype.codelistsDownloaded = function (resDown) {
            for (var i = 0; i < this.cols.length; i++) {
                if (this.cols[i].dataType == 'code') {
                    var tmpCodes = getCodes(this.cols[i].domain.codes, resDown);
                    if (tmpCodes)
                        this.cols[i].codes = tmpCodes;
                }
            }
            this.dataEdit.setData(this.cols, this.data);
        }
        //Include the level param
        var getCodes = function (codeSystems, codelists) {
            if (!codelists)
                return null;
            if (!codeSystems)
                return null;
            for (var i = 0; i < codelists.length; i++) {
                //if (codelists[i].system == codeSystem.system && codelists[i].version == codeSystem.version) {
                //TODO make codesystems multielement
                if (sameCodeSys(codelists[i], codeSystems[0])) {
                    if (codelists[i].rootCodes)
                        return codelists[i].rootCodes;
                    else {
                        var flatCodes = [];
                        recursiveCodeGet(codelists[i].data, flatCodes);
                        return flatCodes;
                    }
                }
            }

            return null;
        }

        var sameCodeSys = function (codelist, codeSys) {
            if (!codelist)
                return false;
            if (!codeSys)
                return false;

            if (codelist.metadata.uid == codeSys.idCodeList && codelist.metadata.version == codeSys.version)
                return true;
            return false;
        }

        var recursiveCodeGet = function (node, flatCodes) {
            if (!node)
                return;
            for (var i = 0; i < node.length; i++) {
                flatCodes.push({ code: node[i].code, title: node[i].title });
                if (node[i].children)
                    recursiveCodeGet(node[i].children, flatCodes);
            }
        }
        //END Codelists search/download

        //Multilang
        DataEditWr.prototype.setDataLang = function (langCode) {
            if (langCode)
                this.dataEdit.setDataLang(langCode.toUpperCase());
        }
        //END Multilang

        return DataEditWr;
    });