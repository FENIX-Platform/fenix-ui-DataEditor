define(['jquery'],
    function ($) {
        var Connector = function () {
            this.address = {
                serverAddress: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata"
            };
        };

        Connector.prototype.setAddress = function (serviceAddress) {
            this.address = serviceAddress;
        }


        //Get resource: http://faostat3.fao.org:7799/v2/msd/resources/dan2/1.0
        //or
        //Get resource: http://faostat3.fao.org:7799/v2/msd/resources/uid/dan2
        //RESOURCES
        Connector.prototype.getResource = function (uid, version, callB) {
            var addr = "http://faostat3.fao.org/d3s2/v2/msd/resources";
            addr = addr + "/" + uid;
            if (version)
                addr = addr + "/" + version;
            $.get(addr, function (data, textStatus, jqXHR) {
                if (callB)
                    callB(data);
            }, 'json').fail(function (xhr, ajaxOptions, thrownError) {
                return null;
                //throw xhr;
                //throw "eeee";
            });
        }

        //METADATA
        Connector.prototype.getMetadata = function (uid, version, callB) {
            var addr = this.address.serverAddress;
            if (version)
                addr = addr + "/" + uid + "/" + version;
            else
                addr = addr + "/uid/" + uid;
            $.get(addr, {dsd: true, full: true}, function (data, textStatus, jqXHR) {
                if (callB)
                    callB(data);
            }, 'json').fail(function (xhr, ajaxOptions, thrownError) {
                return null;
                //throw xhr;
                //throw "eeee";
            });
        }

        //Use this if the resource does not exist
        /*Connector.prototype.postMetadata = function (toPost, callB) {
         var addr = this.address.serverAddress;
         $.ajax({
         contentType: "application/json; charset=utf-8",
         url: addr,
         dataType: 'json',
         type: 'POST',
         data: JSON.stringify(toPost),
         crossDomain: true,
         success: function (data, textStatus, jqXHR) {
         if (callB)
         callB(data);
         },
         error: function (jqXHR, textStatus, errorThrown) {
         console.log("error on post");
         console.log(textStatus);
         console.log(errorThrown);
         }
         });
         }*/

        //Use this to patch the metadata
        /*Connector.prototype.patchMetadata = function (existingMeta, toPatch, callB) {
         var addr = this.address.serverAddress;

         toPatch.rid = existingMeta.rid;

         $.ajax({
         contentType: "application/json; charset=utf-8",
         url: addr,
         dataType: 'json',
         type: 'PATCH',
         data: JSON.stringify(toPatch),
         crossDomain: true,
         success: function (data, textStatus, jqXHR) {
         if (callB)
         callB(data);
         },
         error: function (jqXHR, textStatus, errorThrown) {
         console.log("error on patch");
         console.log(textStatus);
         console.log(errorThrown);
         }
         });
         }*/

        /*Connector.prototype.deleteMetadata = function (uid, version, callB) {
         var addr = this.address.serverAddress;
         addr = addr + "/" + uid;
         if (version)
         addr = addr + "/" + version;
         $.ajax({
         url: addr,
         type: 'DELETE',
         crossDomain: true,
         success: function (data, textStatus, jqXHR) {
         if (callB)
         callB(data);
         },
         error: function (jqXHR, textStatus, errorThrown) {
         console.log("error on delete");
         console.log(textStatus);
         console.log(errorThrown);
         return null;
         }
         });
         }*/

        Connector.prototype.updateDSD = function (existingMeta, DSD, callB) {
            if (!existingMeta)
                throw "existing meta is null";

            DSD.datasource = "CountrySTAT";
            DSD.contextSystem = "CountrySTAT";

            //console.log(JSON.stringify(DSD));
            //return;

            //DSD exists and has a rid
            if (existingMeta.dsd && existingMeta.dsd.rid) {
                var addr = "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd";
                //Put (overwrite)
                DSD.rid = existingMeta.dsd.rid;

                $.ajax({
                    contentType: "application/json",
                    url: addr,
                    dataType: 'json',
                    type: 'PUT',
                    data: JSON.stringify(DSD),
                    crossDomain: true,
                    success: function (data, textStatus, jqXHR) {
                        console.log("updateDSD success if")
                        console.log(callB)
                        console.log(data)
                        if (callB)
                            callB(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("error on put");
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
            else {
                //Patch (append)
                var addr = this.address.serverAddress;
                var toPatch = {};
                toPatch.uid = existingMeta.uid;
                toPatch.version = existingMeta.version;
                toPatch.dsd = DSD;

                //return;
                $.ajax({
                    contentType: "application/json",
                    url: addr,
                    dataType: 'json',
                    type: 'PATCH',
                    data: JSON.stringify(toPatch),
                    crossDomain: true,
                    success: function (data, textStatus, jqXHR) {
                        console.log("updateDSD success else")
                        console.log(callB)
                        console.log(data)
                        if (callB)
                            callB(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("error on patch");
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
        }


        //DATA
        Connector.prototype.putData = function (existingMeta, data, callB) {
            console.log(callB)
            var addr = "http://faostat3.fao.org/d3s2/v2/msd/resources"
            console.log(existingMeta)

            if (existingMeta.dsd && existingMeta.dsd.rid) {

                var toPut = {
                    "metadata": {"uid": existingMeta.uid, "version": existingMeta.version},
                    "data": data
                };

                $.ajax({
                    contentType: "application/json",
                    url: addr,
                    dataType: 'json',
                    type: 'PUT',
                    data: JSON.stringify(toPut),
                    crossDomain: true,
                    success: function (data, textStatus, jqXHR) {
                        console.log("putData success if")
                        console.log(callB)
                        console.log(data)

                        if (callB)
                            callB(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("error on put");
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
        }

        return Connector;
    });