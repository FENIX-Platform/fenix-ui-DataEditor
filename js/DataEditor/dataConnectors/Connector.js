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

        return Connector;
    });