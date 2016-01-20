define(['jquery',
    'amplify'
],
function ($) {
    var widgetName = 'FileUploadHelper';
    var evtTextFileUploaded = 'textFileUploaded.' + widgetName + '.fenix';
    var defConfig = {
        accept: [],
        maxFileBytes: 0
    };

    function FileUploadHelper(config) {
        this.config = {};
        $.extend(true, this.config, defConfig, config);
        for (var i = 0; i < this.config.accept.length; i++)
            this.config.accept[i] = this.config.accept[i].toLowerCase();
        this.$uploadInput;
    };

    FileUploadHelper.prototype.render = function (fileInputId) {
        this.initUploadInput(fileInputId);
    }

    FileUploadHelper.prototype.reset = function () {
        this.$uploadInput.val('');
    }

    FileUploadHelper.prototype.initUploadInput = function (inputId) {
        this.$uploadInput = $(inputId);
        var me = this;

        this.$uploadInput.on('change', function (e) {
            if (me.config.accept && me.config.accept.length > 0) {
                var ext = me.$uploadInput.val().split(".").pop().toLowerCase();
                if ($.inArray(ext, me.config.accept) == -1) {
                    //alert(mlRes.wrongFileType);
                    alert("wrong file type");
                    me.reset();
                    return false;
                }
            }
            if (me.config.maxFileBytes != 0) {
                if (e.target.files.item(0).size > me.config.maxFileBytes) {
                    //alert(mlRes.maxFileSizeIs.replace("%max%", (me.config.maxFileBytes / 1048576)));
                    alert('too big');
                    me.reset();
                    return false;
                }
            }
            if (e.target.files != undefined) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var str = e.target.result;
                    amplify.publish(evtTextFileUploaded, str);
                };
                reader.readAsText(e.target.files.item(0));
            }
            return false;
        });
    }

    FileUploadHelper.prototype.enabled = function (isEnabled) {
        if (isEnabled) {
            this.$uploadInput.removeAttr('disabled');
        }
        else {
            this.$uploadInput.attr('disabled', 'disabled');
        }
    }

    FileUploadHelper.prototype.destroy = function () {
        this.$uploadInput.off('change');
    }

    return FileUploadHelper;
});
