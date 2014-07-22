(function($){
  var $els = $('header > *, main > *, #features > *');

  $els.velocity("transition.slideLeftIn", { stagger: 250, drag: true });

  // ## Smooth Scroll
  $('a[href^="#"]').click(function(event) {
      var id = $(this).attr("href");
      var offset = 60;
      var target = $(id).offset().top - offset;
  
      $('html, body').animate({scrollTop:target}, 500);
  
      event.preventDefault();
  });
})(jQuery);
