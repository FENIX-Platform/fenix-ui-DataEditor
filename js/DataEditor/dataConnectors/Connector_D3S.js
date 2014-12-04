define([
    'jquery',
    'fx-DataEditor/js/DataEditor/dataConnectors/Connector'
],
    function ($, Connector) {
        var defConfig = {
            /* metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
             dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
             dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources"*/
            metadataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata",
            dsdUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/dsd",
            dataUrl: "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources",
            codelistUrl: "http://faostat3.fao.org:7799/v2/msd/resources/data"
        };

        var Connector_D3S = function (config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);

            this.connector = new Connector();
        };

        Connector_D3S.prototype.getMetadata = function (uid, version, callB) {
            var addr = this.config.metadataUrl;
            if (!version)
                addr += "/uid/" + uid
            else
                addr += "/" + uid + "/" + version;
            var queryParam = { dsd: true };
            try {
                this.connector.ajaxGET(addr, queryParam, callB);
            }
            catch (ex) {
                throw new Error("Cannot find Metadata at " + addr);
            }
        }

        Connector_D3S.prototype.updateDSD = function (uid, version, newDSD, datasource, contextSys, callB) {
            if (!newDSD)
                throw new Error("DSD to update cannot be null");
            if (!datasource)
                throw new Error("Datasource cannot be null");
            if (!contextSys)
                throw new Error("ContextSystem cannot be null");

            newDSD.datasource = datasource;
            newDSD.contextSystem = contextSys;

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

        Connector_D3S.prototype.putData = function (uid, version, data, callB) {
            var me = this;
            this.getMetadata(uid, version, function (meta) {
                var toPut = { metadata: { uid: meta.uid } };
                if (meta.version)
                    toPut.metadata.version = meta.version;
                toPut.data = data;
                try {
                    me.connector.ajaxPUT(me.config.dataUrl, toPut, callB);
                }
                catch (ex) {
                    throw new Error("Cannot put data");
                }
            });
        }


        //CODELISTS
        Connector_D3S.prototype.getCodelist = function (uid, version, callB) {
            var addr = composeCodelistAddress(this.config.codelistUrl, uid, version);
            try {
                this.connector.ajaxGET(addr, null, callB);
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
                toGet.push(composeCodelistAddress(this.config.codelistUrl, uids[i].uid, uids[i].version));
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

        var composeCodelistAddress = function (baseAddr, uid, version) {
            if (!version)
                return baseAddr + "/uid/" + uid
            else
                return baseAddr + "/" + uid + "/" + version;
        }

        return Connector_D3S;
    });