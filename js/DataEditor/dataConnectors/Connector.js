define(['jquery'],
    function ($) {
        var Connector = function () {
        };

        /*Connector.prototype.getMetadata = function (url, uid, version, callB) {
            var addr = url;
            if (!version)
                addr += "/uid/" + uid
            else
                addr += "/" + uid + "/" + version;
            var queryParam = { dsd: true };
            ajaxGET(addr, queryParam, callB, "Cannot find Metadata at " + url);
        }*/

       /* Connector.prototype.putDSD = function (url, newDSD, callB) {
            if (!newDSD)
                throw new Error("DSD cannot be null");
            if (!newDSD.contextSystem)
                throw new Error("DSD. contextSystem cannot be null");
            if (!newDSD.datasource)
                throw new Error("DSD. datasource cannot be null");
            ajaxPUT(url, newDSD, "Error updating the DSD(PUT) with rid " + newDSD.rid,callB);

        }
        Connector.prototype.patchDSD = function (url, toPatch, callB) {
            if (!toPatch)
                throw new Error("Object to be sent cannot be null");
            if (!toPatch.dsd.contextSystem)
                throw new Error("DSD. contextSystem cannot be null");
            if (!toPatch.dsd.datasource)
                throw new Error("DSD. datasource cannot be null");
            ajaxPATCH(url, toPatch, "Error updating the DSD(PATCH) with rid " + toPatch.rid);
        }*/

        //DATA
/*        Connector.prototype.putData = function (url, existingMeta, data, callB) {
            var toPut = { metadata: { uid: existingMeta.uid } };
            if (existingMeta.version)
                toPut.metadata.version = existingMeta.version;
            toPut.data = data;
            ajaxPUT(url, toPut, "Error executing data update", callB);
        }*/


        //AJAX Methods
        Connector.prototype.ajaxGET = function (url, queryParam, callB) {
            $.ajax({
                url: url,
                crossDomain: true,
                dataType: 'json',
                data: queryParam,
                success: function (data) {
                    if (callB) callB(data);
                }
                /*error: function (jqXHR, textStatus, errorThrown) {
                    //throw new Error("Cannot find DSD at " + url);
                    
                }*/
            });
        }
        Connector.prototype.ajaxPUT = function (url, JSONToPut, callB) {
            this.ajaxPUT_PATCH(url, JSONToPut, 'PUT', callB);
        }
        Connector.prototype.ajaxPATCH = function (url, JSONToPatch, callB) {
            this.ajaxPUT_PATCH(url, JSONToPatch, 'PATCH', callB);
        }

        Connector.prototype.ajaxPUT_PATCH = function (url, JSONtoSend, method, callB) {
            console.log(JSONtoSend);
            $.ajax({
                contentType: "application/json",
                url: url,
                dataType: 'json',
                type: method,
                data: JSON.stringify(JSONtoSend),
                crossDomain: true,
                success: function (data, textStatus, jqXHR) {
                    if (callB)
                        callB();
                }
                /*error: function (jqXHR, textStatus, errorThrown) {
                    throw new Error(errorMessage);
                }*/
            });
        }

        return Connector;
    });