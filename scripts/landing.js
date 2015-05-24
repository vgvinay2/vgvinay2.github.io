jQuery(function($) {
    function fixDiv() {
      var $cache = $('#sidebar_form'); 
      if ($(window).scrollTop() > 300) 
        $cache.css({'position': 'fixed', 'top': '15px'}); 
      else
        $cache.css({'position': 'relative', 'top': 'auto'});
    }
    $(window).scroll(fixDiv);
    fixDiv();


    $('.number, .point_header').click(function(){
      $(this).siblings('.point_explanation').slideToggle();
    });
});
