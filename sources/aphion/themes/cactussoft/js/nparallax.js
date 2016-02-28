$(document).ready(function(){
    $('section[data-type="background"]').each(function(){
        var $bgobj = $(this); // СЃРѕР·РґР°РµРј РѕР±СЉРµРєС‚
        $(window).scroll(function() {
            var yPos = -($(window).scrollTop() / $bgobj.data('speed')) + $bgobj.data('start'); // РІС‹С‡РёСЃР»СЏРµРј РєРѕСЌС„С„РёС†РёРµРЅС‚ 
            // РџСЂРёСЃРІР°РёРІР°РµРј Р·РЅР°С‡РµРЅРёРµ background-position
            var coords = 'center '+ yPos + 'px';
            // РЎРѕР·РґР°РµРј СЌС„С„РµРєС‚ Parallax Scrolling
            $bgobj.css({ backgroundPosition: coords });
        });
    });
});




$(window).load(function(){
  $(document).scroll(function(){
      $('.b-about-block').each(function(){
        parallaxHeight = $(this).offset().top - $(window).height();
        mainHeight = $(this).offset().top - $(window).height() + $(this).outerHeight() + 300;
        mainWidth = 300;
        if ($(document).scrollTop() > parallaxHeight) {
          var yPos = (-($(window).scrollTop() - $(this).offset().top) / 2) - 60;
          var coords = 'center '+ yPos + 'px';
          $(this).children('section.b-about-rblock').css({ backgroundPosition: coords });
        }
        if ($(document).scrollTop() > mainHeight) {
          $(this).animate({height: mainWidth}, 'slow');
        }
        else {
          return false;
        }
    });
  });
});

$(window).bind('scroll.counter', function(){
    $('section[data-type="counter"]').each(function(){
        var index = $(this).data('count'),
            $bgobj = $(this),
            mainHeight =  $(this).parent().offset().top - $(window).height() + $(this).parent().height();

        if ($(document).scrollTop() > mainHeight) {
            (function stepsLine(lines) {
                if (isNaN(lines)) {
                    lines = 0;
                }
                if (lines > index) {
                    showAllCount();
                }
                if (lines <= index) {
                    $bgobj.text(lines);
                    lines++;
                    setTimeout(function () {
                        stepsLine(lines)
                    }, 13);
                    showAllCount();
                }
            })(jQuery);
        }
    });
});

function showAllCount() {
    $(window).unbind('scroll.counter')
}