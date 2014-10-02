define(['jquery'],
function ($) {

    var ResourcesDownloader = function () {
        this.retured = [];
        this.toDown;
        this.callB;
        this.callIndex = 0;
    };

    ResourcesDownloader.prototype.downloadResources = function (URLs, callB) {
        //reset
        this.callB = callB;
        this.toDown = URLs;
        this.returned = [];
        this.callIndex = 0;
        for (var i = 0; i < URLs.length; i++)
            this.returned[i] = null;
        this.doCall();
    }
    //Serialized, make it parallel
    ResourcesDownloader.prototype.doCall = function () {
        //$.getJSON(this.toDown[this.callIndex], function (data) { callReturned(data) });
        var me = this;
        $.getJSON(this.toDown[this.callIndex]).done(function (json) { me.callReturned(json) }).fail(function (jqxhr, textStatus, error) { });
    }

    ResourcesDownloader.prototype.callReturned = function (data) {
        this.returned[this.callIndex] = data;
        this.callIndex++;
        if (this.callIndex == this.toDown.length) {
            if (this.callB)
                this.callB(this.returned);
        }
        else {
            this.doCall();
        }
    }

    return ResourcesDownloader;
});