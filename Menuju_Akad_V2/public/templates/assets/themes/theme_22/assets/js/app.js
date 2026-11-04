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

AOS.init({
    easing: "ease-out-back",
    duration: 1000,
});

$("html, body").css("overflow-y", "hidden");

$(document).ready(() => {
    // countdown
    const date = $(".countdown").attr("date");
    Countdown(date);

    //autoslider
    // $("#slider").infiniteslide({
    //   speed: 50,
    //   direction: "up",
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

    $("#btn-envelope").on("click", function () {
        $("html, body").css("overflow-y", "auto");
        bgMusicPlay();
        $(".envelope-wrap").css("transform", "translateY(-100%)");
    });

    $(".zoom-gallery-default").magnificPopup({
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

    $(document).scroll(function () {
        $('nav').toggleClass('scrolled', $(this).scrollTop() > $('nav').height())
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
