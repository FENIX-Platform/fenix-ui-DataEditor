define(['jquery',
    'pnotify'
],
    function ($) {
        var defConfig = {};

        function Notifications(config) {
            this.config = {};
            $.extend(true, this.config, defConfig, config);
        };

        Notifications.prototype.showNotice = function (title, text) {
            this._show(title, text, '');
        };
        Notifications.prototype.showInfo = function (title, text) {
            this._show(title, text, 'info');
        };
        Notifications.prototype.showSuccess = function (title, text) {
            this._show(title, text, 'success');
        };
        Notifications.prototype.showError = function (title, text) {
            this._show(title, text, 'error');
        };

        Notifications.prototype._show = function (title, text, type) {
            new PNotify({
                title: title,
                text: text,
                type: type
            });
        };
        return new Notifications();
    })