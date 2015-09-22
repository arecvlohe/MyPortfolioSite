$(document).ready(function(){

  $(".main").flowtype({
    minimum  : 500,
    maximum  : 1200,
    minFont  : 12,
    maxFont  : 40,
    fontRatio: 40
  });

  $(".main").onepage_scroll({
    sectionContainer  : "section",
    easing            : "ease",
    animationTime     : 1000,
    pagination        : false,
    updateURL         : false,
    beforeMove        : function(index) {},
    afterMove         : function(index) {},
    loop              : true,
    keyboard          : true,
    responsiveFallback: 600,
    direction         : "vertical"
  });

});
