define(['jquery'],
    function ($) {
        var Connector = function () {
        };

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
                    if (callB) callB();
                }
            });
        }

        Connector.prototype.ajaxMultiget = function (urls, callB) {
            if (!urls)
                if (callB) callB();
            var toRet = {};
            ajaxMultiGetRec(toRet, urls, 0, callB)
        }

        var ajaxMultiGetRec = function (toRet, urls, index, callB) {
            $.ajax({
                url: urls[index],
                crossDomain: true,
                dataType: 'json',
                success: function (data) {
                    toRet[urls[index]] = data;
                    if ((index == urls.length - 1) && callB)
                        callB(toRet);
                    else
                        ajaxMultiGetRec(toRet, urls, index + 1, callB)
                }
            });
        }

        return Connector;
    });