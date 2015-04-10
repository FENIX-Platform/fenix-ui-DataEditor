define([
    'jquery',
    'fx-DataEditor/js/DataEditor/dataConnectors/Connector'
],
    function ($, Connector) {
        /*var defConfig = {
             //metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
             //dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
             //dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources"
            metadataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata",
            dsdUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/dsd",
            dataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources",
            getDataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/data",
            //getMetaAndDataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/uid/dan3?dsd=true",
            getMetaAndDataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources",
            codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources/data",
            codelistMetaUrl: "http://faostat3.fao.org:7799/v2/msd/resources/metadata",
            contextSystem: "CountrySTAT",
            datasource: "D3S"
        };*/

        var defConfig = {
            baseAddress: "http://fenix.fao.org/d3s_dev/msd",

            metadataUrl: "resources/metadata",
            dsdUrl: "resources/dsd",
            dataUrl: "resources",
            getDataUrl: "resources/data",
            getMetaAndDataUrl: "resources",
            //Codelists
            /*codelistUrl: "http://fenix.fao.org/d3s_dev/msd/resources/data",
            codelistMetaUrl: "http://fenix.fao.org/d3s_dev/msd/resources/metadata",
            codelistFilteredUrl: "http://fenix.fao.org/d3s_dev/msd/codes/filter",*/

            
                        codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources",
            codelistMetaUrl: "http://faostat3.fao.org:7799/v2/msd/resources/metadata",
            codelistFilteredUrl: "http://faostat3.fao.org:7799/v2/msd/codes/filter",
            

            contextSystem: "CountrySTAT",
            datasource: "D3S"
        }

        var Connector_D3S = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

            this.connector = new Connector();
        };

        //UTILS
        var getUIDVersionAddressPart = function (uid, version) {
            if (!version)
                return "/uid/" + uid;
            else
                return "/" + uid + "/" + version;
        }

        var pathConcatenate = function (path1, path2) {
            if (path2.indexOf("http://") == 0)
                return path2;
            if (!path1)
                return path2;
            if (path1.charAt(path1.length - 1) == '/')
                return path1 + path2;
            return path1 + "/" + path2;
        }

        Connector_D3S.prototype.getCompletePath = function (path) {
            return pathConcatenate(this.config.baseAddress, path)
        }
        //END UTILS

        Connector_D3S.prototype.getMetadata = function (uid, version, callB) {
            var addr = this.getCompletePath(this.config.metadataUrl);
            addr += getUIDVersionAddressPart(uid, version);
            var queryParam = { dsd: true };
            try {
                this.connector.ajaxGET(addr, queryParam, callB);
            }
            catch (ex) {
                throw new Error("Cannot find Metadata at " + addr);
            }
        }

        Connector_D3S.prototype.updateDSD = function (uid, version, newDSD, callB) {
            if (!newDSD)
                throw new Error("DSD to update cannot be null");
            if (!this.config.datasource)
                throw new Error("Datasource cannot be null");
            if (!this.config.contextSystem)
                throw new Error("ContextSystem cannot be null");

            newDSD.datasource = this.config.datasource;
            newDSD.contextSystem = this.config.contextSystem;

            var me = this;
            this.getMetadata(uid, version, function (meta) {
                if (meta.dsd && meta.dsd.rid) {
                    newDSD.rid = meta.dsd.rid;
                    try {
                        me.connector.ajaxPUT(me.config.dsdUrl, newDSD, callB);
                    }
                    catch (ex) {
                        throw new Error("Cannot PUT dsd");
                    }
                }
                else {
                    var toPatch = { uid: meta.uid };
                    if (meta.version)
                        toPatch.version = meta.version;
                    toPatch.dsd = newDSD;
                    try {
                        me.connector.ajaxPATCH(me.config.metadataUrl, toPatch, callB);
                    }
                    catch (ex) {
                        throw new Error("Cannot PATCH dsd");
                    }
                }
            });
        }

        //Meta and Data
        Connector_D3S.prototype.getMetaAndData = function (uid, version, callB) {
            var addr = this.getCompletePath(this.config.getMetaAndDataUrl);
            addr += getUIDVersionAddressPart(uid, version);

            var queryParam = { dsd: true };
            try {
                this.connector.ajaxGET(addr, queryParam, callB);
            }
            catch (ex) {
                throw new Error("Cannot find data at " + addr);
            }
        }

        //Data
        Connector_D3S.prototype.putData = function (uid, version, data, callB) {
            var me = this;
            this.getMetadata(uid, version, function (meta) {
                var toPut = { metadata: { uid: meta.uid } };
                if (meta.version)
                    toPut.metadata.version = meta.version;
                toPut.data = data;
                try {
                    me.connector.ajaxPUT(me.getCompletePath(me.config.dataUrl), toPut, callB);
                }
                catch (ex) {
                    throw new Error("Cannot put data");
                }
            });
        }

        Connector_D3S.prototype.getData = function (uid, version, callB) {
            var addr = this.getCompletePath(this.config.getDataUrl);
            addr += getUIDVersionAddressPart(uid, version);
            try {
                this.connector.ajaxGET(addr, null, callB);
            }
            catch (ex) {
                throw new Error("Cannot find data at " + addr);
            }
        }

        //CODELISTS
        Connector_D3S.prototype.getCodelistMetadata = function (uid, version, callB) {
            var addr = this.getCompletePath(this.config.codelistMetaUrl);
            addr += getUIDVersionAddressPart(uid, version);
            try {
                this.connector.ajaxGET(addr, null, callB);
            }
            catch (ex) {
                throw new Error("Cannot find Metadata at " + addr);
            }
        }

        Connector_D3S.prototype.getCodelist = function (uid, version, callB) {
            var addr = this.getCompletePath(this.config.codelistUrl);
            addr += getUIDVersionAddressPart(uid, version);
            //var addr = composeCodelistAddress(this.config.codelistUrl, uid, version);
            try {
                this.connector.ajaxGET(addr, null, callB);
            }
            catch (ex) {
                throw new Error("Cannot find Codelist at " + addr);
            }
        }
        Connector_D3S.prototype.getCodelistWithFilter = function (uid, version, filter, callB) {
            var addr = this.getCompletePath(this.config.codelistFilteredUrl);
            filter.uid = uid;
            if (version)
                filter.version = version;
            try {
                this.connector.ajaxPOST(addr, filter, callB);
            }
            catch (ex) {
                throw new Error("Cannot find Codelist at " + addr);
            }
        }

        Connector_D3S.prototype.getCodelists = function (uids, callB) {
            if (!uids)
                if (callB) callB();
            var toGet = [];
            for (var i = 0; i < uids.length; i++) {

                var addr = this.getCompletePath(this.config.codelistUrl);
                addr += getUIDVersionAddressPart(uids[i].uid, uids[i].version);

                //toGet.push(composeCodelistAddress(this.config.codelistUrl, uids[i].uid, uids[i].version));
                toGet.push(addr);
            }
            this.connector.ajaxMultiget(toGet, function (data) {
                var uidData = {};
                for (var i = 0; i < uids.length; i++) {
                    if (uids[i].version)
                        uidData[uids[i].uid + "|" + uids[i].version] = data[toGet[i]];
                    else
                        uidData[uids[i].uid] = data[toGet[i]];
                }
                if (callB) callB(uidData);
            })
        }
        return Connector_D3S;
    });