
var $slider = $(".slideshow .slider"),
  maxItems = $(".item", $slider).length,
  dragging = false,
  tracking,
  rightTracking;

$sliderRight = $(".slideshow")
  .clone()
  .addClass("slideshow-right")
  .appendTo($(".split-slideshow"));

rightItems = $(".item", $sliderRight).toArray();
reverseItems = rightItems.reverse();
$(".slider", $sliderRight).html("");
for (i = 0; i < maxItems; i++) {
  $(reverseItems[i]).appendTo($(".slider", $sliderRight));
}

$slider.addClass("slideshow-left");
$(".slideshow-left")
  .slick({
    vertical: true,
    verticalSwiping: true,
    arrows: false,
    infinite: true,
    dots: true,
    speed: 1000,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
  })
  .on("beforeChange", function(event, slick, currentSlide, nextSlide) {
    if (
      currentSlide > nextSlide &&
      nextSlide == 0 &&
      currentSlide == maxItems - 1
    ) {
      $(".slideshow-right .slider").slick("slickGoTo", -1);
      $(".slideshow-text").slick("slickGoTo", maxItems);
    } else if (
      currentSlide < nextSlide &&
      currentSlide == 0 &&
      nextSlide == maxItems - 1
    ) {
      $(".slideshow-right .slider").slick("slickGoTo", maxItems);
      $(".slideshow-text").slick("slickGoTo", -1);
    } else {
      $(".slideshow-right .slider").slick(
        "slickGoTo",
        maxItems - 1 - nextSlide
      );
      $(".slideshow-text").slick("slickGoTo", nextSlide);
    }
  })
  .on("mousewheel", function(event) {
    event.preventDefault();
    if (event.deltaX > 0 || event.deltaY < 0) {
      $(this).slick("slickNext");
    } else if (event.deltaX < 0 || event.deltaY > 0) {
      $(this).slick("slickPrev");
    }
  })
  .on("mousedown touchstart", function() {
    dragging = true;
    tracking = $(".slick-track", $slider).css("transform");
    tracking = parseInt(tracking.split(",")[5]);
    rightTracking = $(".slideshow-right .slick-track").css("transform");
    rightTracking = parseInt(rightTracking.split(",")[5]);
  })
  .on("mousemove touchmove", function() {
    if (dragging) {
      newTracking = $(".slideshow-left .slick-track").css("transform");
      newTracking = parseInt(newTracking.split(",")[5]);
      diffTracking = newTracking - tracking;
      $(".slideshow-right .slick-track").css({
        transform:
          "matrix(1, 0, 0, 1, 0, " + (rightTracking - diffTracking) + ")"
      });
    }
  })
  .on("mouseleave touchend mouseup", function() {
    dragging = false;
  });

$(".slideshow-right .slider").slick({
  swipe: false,
  vertical: true,
  arrows: false,
  infinite: true,
  speed: 950,
  cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
  initialSlide: maxItems - 1
});
$(".slideshow-text").slick({
  swipe: false,
  vertical: true,
  arrows: false,
  infinite: true,
  speed: 900,
  cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
});


(function($) {
 
  var SliceSlider = {
    
    /**
     * Settings Object
     */
    settings: {
      delta:              0,
      currentSlideIndex:  0,
      scrollThreshold:    40,
      slides:             $('.slide'),
      numSlides:          $('.slide').length,
      navPrev:            $('.js-prev'),
      navNext:            $('.js-next'),
    },
    
    /**
     * Init
     */
    init: function() {
      s = this.settings;
      this.bindEvents();
    },
    
    /**
     * Bind our click, scroll, key events
     */
    bindEvents: function(){
      
      // Scrollwheel & trackpad
      s.slides.on({
        'DOMMouseScroll mousewheel' : SliceSlider.handleScroll
      });
      // On click prev
      s.navPrev.on({
        'click' : SliceSlider.prevSlide
      });
      // On click next
      s.navNext.on({
        'click' : SliceSlider.nextSlide
      });
      // On Arrow keys
      $(document).keyup(function(e) {
        // Left or back arrows
        if ((e.which === 37) ||  (e.which === 38)){
          SliceSlider.prevSlide();
        }
        // Down or right
        if ((e.which === 39) ||  (e.which === 40)) {
          SliceSlider.nextSlide();
        }
      });
    },
    
    /** 
     * Interept scroll direction
     */
    handleScroll: function(e){

      // Scrolling up
      if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) { 

        s.delta--;
     
        if ( Math.abs(s.delta) >= s.scrollThreshold) {
          SliceSlider.prevSlide();
        }
      }
 
      // Scrolling Down
      else {
 
        s.delta++;
 
        if (s.delta >= s.scrollThreshold) {
          SliceSlider.nextSlide();
        }
      }
 
      // Prevent page from scrolling
      return false;
    },

    /**
     * Show Slide
     */
    showSlide: function(){ 
      // reset
      s.delta = 0;
      // Bail if we're already sliding
      if ($('body').hasClass('is-sliding')){
        return;
      }
      // Loop through our slides
      s.slides.each(function(i, slide) {

        // Toggle the is-active class to show slide
        $(slide).toggleClass('is-active', (i === s.currentSlideIndex)); 
        $(slide).toggleClass('is-prev', (i === s.currentSlideIndex - 1)); 
        $(slide).toggleClass('is-next', (i === s.currentSlideIndex + 1)); 
        
        // Add and remove is-sliding class
        $('body').addClass('is-sliding');

        setTimeout(function(){
            $('body').removeClass('is-sliding');
        }, 1000);
      });
    },

    /**
     * Previous Slide
     */
    prevSlide: function(){
      
      // If on first slide, loop to last
      if (s.currentSlideIndex <= 0) {
        s.currentSlideIndex = s.numSlides;
      }
      s.currentSlideIndex--;
      
      SliceSlider.showSlide();
    },

    /**
     * Next Slide
     */
    nextSlide: function(){
      
      s.currentSlideIndex++;
   
      // If on last slide, loop to first
      if (s.currentSlideIndex >= s.numSlides) { 
        s.currentSlideIndex = 0;
      }
 
      SliceSlider.showSlide();
    },
  };
  SliceSlider.init();
})(jQuery);