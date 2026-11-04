$("body").css('overflow-y', 'hidden');

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

$("#btn-envelope").on("click", function () {
    $("body").css("overflow-y", "auto");

    $(".envelope-wrap").css("transform", "translateY(-100%)");
    bgMusicPlay();
});

var previousScroll = 70;
$(window).scroll(function (e) {

    // add/remove class to navbar when scrolling to hide/show
    var scroll = $(window).scrollTop();
    if (scroll >= previousScroll) {
        $('nav').addClass("navbar-hide");
    } else if (scroll < previousScroll) {
        $('nav').removeClass("navbar-hide");
        $('nav').addClass("scrolled");
    }

    if (scroll == 0) {
        $('nav').removeClass("navbar-hide");
        $('nav').removeClass("scrolled");
    }
    previousScroll = scroll;
});

const cd = document.querySelector('.countdown')
if (cd) {
  Countdown(cd.getAttribute('date'))
}

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
