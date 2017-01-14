define([
    'fwk/opf',
    'fwk/function',
    'fwk/utils',
    'fwk/string',
    'fwk/ajax',
    'fwk/ui',
    'fwk/media',
    'fwk/loader',
    'fwk/polling',
    'fwk/components/toastr',
    'bootbox',
    'bowser'

    // , //
    // ,
], function(Opf, Function, Util, String ,Ajax, UI, Media, Loader, Polling, Toast, Bootbox, Bowser) {

    Opf.Ajax = Ajax;
    Opf.UI = UI;
    Opf.Function = Function;
    Opf.String = String;
    Opf.Util = Util;
    Opf.Media = Media;
    Opf.Bowser = Bowser;
    Opf.Loader = Loader;

    Opf.alert = Bootbox.alert;
    Opf.confirm = Bootbox.confirm;
    Opf.ajax = Ajax.request;
    Opf.Polling = Polling;
    Opf.Toast = Toast;

    Opf.download = function (url) {
        $('<iframe></iframe>').css({
            display: 'none',
            width: 0,
            height: 0
        }).attr('src', url).appendTo(document.body);
    };
    return Opf;
});