const musicControl = $("#musicControl")
const playPauseIcon = document.querySelector("#playPause")
const bgMusic = document.querySelector("audio");

if (bgMusic) {
    bgMusic.load();
}

const bgMusicPlay = (play = true) => {
    if (bgMusic) {
        bgMusic.loop = true
        bgMusic.controls = false

        if (play == true) {
            bgMusic.play()
        } else {
            bgMusic.pause()
        }
    }
}

// initialization AOS Animation
AOS.init({
    easing: "ease-out-back",
    duration: 1000,
});

$(document).ready(() => {
  //countdown
  const Countdown = (date) => {
    console.log(date);
    const ct = new Date(date).getTime();

    const x = setInterval(() => {
      let now = new Date().getTime();

      let distance = ct - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance <= 0) {
        clearInterval(x);
      } else {
        $(".days .angka").text(days);
        $(".hours .angka").text(hours);
        $(".minutes .angka").text(minutes);
        $(".seconds .angka").text(seconds);
      }
    }, 1000);
  };

  // countdown
  const date = $(".countdown").attr("date");
  Countdown(date);

  //autoslider
  // $("[id='slider']").infiniteslide({
  //   speed: 50,
  //   direction: "up",
  // });

  // $("#lightSlider").lightSlider({
  //   item: 1,
  //   gallery: true,
  //   thumbItem: 4,
  //   loop: true,
  //   controls: true,
  // });

  if (musicControl) {
      musicControl.on("click", (event) => {
          if (bgMusic.paused == true) {
              bgMusicPlay()
              playPauseIcon.classList.replace('icofont-music-alt', 'icofont-ui-pause')
          } else {
              bgMusicPlay(false)
              playPauseIcon.classList.replace('icofont-ui-pause', 'icofont-music-alt')
          }
      })
  }

  var previousScroll = 70;
		$(window).scroll(function(e) {

	        // add/remove class to navbar when scrolling to hide/show
	        var scroll = $(window).scrollTop();
	        if (scroll >= previousScroll) {
	            $('nav').addClass("navbar-hide");
	        }else if (scroll < previousScroll) {
	            $('nav').removeClass("navbar-hide");
	            $('nav').addClass("scrolled");
	        }

	        if(scroll == 0){
	            $('nav').removeClass("navbar-hide");
	            $('nav').removeClass("scrolled");
	        }
	        previousScroll = scroll;
	    });

  $(document).scroll(function () {
    $('nav').toggleClass('scrolled', $(this).scrollTop() > $('nav').height())
  });

  $(".zoom-gallery").magnificPopup({
    delegate: "a",
    type: "image",
    mainClass: "mfp-with-zoom mfp-img-mobile",
    gallery: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      easing: "ease-in-out",
    },
  });

  $("body").css("overflow-y", "hidden");

  $("#btn-envelope").on("click", function () {
    $("body").css("overflow-y", "auto");

    bgMusicPlay();
    $(".envelope-wrap").css("transform", "translateX(-100%)");
  });
});

$('iframe, img').on('load', function () {
    AOS.refresh();
    console.log('AOS Refreshed');
});

$(window).on('resize', function(){
    console.log('Window Resized');
    setTimeout(function() {
        AOS.refresh();
    }, 1000);
});
