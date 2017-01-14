/*  
  ss          xs        sm          md          ld
[0, 480]  [481, 767]  [768, 991] [992, 1199] [1200,+00);
*/
define(['jquery', 'fwk/media'], function($, Media) {
  var SS_MAX = 480;
    var XS_MIN = 481, XS_MAX = 781;
    var SM_MIN = 782, SM_MAX = 991;
    var MD_MIN = 992, MD_MAX = 1199;
    var LD_MIN = 1200;

  function calcMediaName(width) {
      var w = width !== void 0 ? width : $(window).width();
      if(w >= LD_MIN) {
          return 'lg';
      }else if (w >= MD_MIN){
          return 'md';
      }else if (w >= SM_MIN) {
          return 'sm';
      }else if (w >= XS_MIN){
          return 'xs';
      }else {
          return 'ss';
      }
  }

  var shortNameMap = {
    ld: 'larget device',
    md: 'media device',
    sm: 'small media',
    xs: 'extral small device',
    ss: 'super small'
  };

  function getMediaType(width) {
    return Media.calcName(width);
  }


  var toString = function() {
    var width = $(window).width();
    var height = $(window).height();
    var type = getMediaType(width);
    var fullName = shortNameMap[type];
    // return 'width : ' + width + '<br>' + 'type : ' + type + '  (' + fullName + ')';
    return '&nbsp;'+width + ' x ' + height + '<br>' +  '&nbsp;'+type + '  (' + fullName + ')';
  };

  var $el = $('<div id="screen-debug-info"></div>').css({
    position: 'fixed',
    bottom: 30,
    left: 0,
    width: 'auto',
    height: 'auto',
    'z-index':999999999
  }).appendTo(document.body).html(toString());

  $(window).resize(function() {
    $el.html(toString());
  });
});