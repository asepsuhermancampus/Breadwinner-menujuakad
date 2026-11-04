const qselect = (element, elements = false) => {
  if (elements === false) { //single element
    return document.querySelector(element)
  } else { //all elements
    return document.querySelectorAll(element)
  }
}

const musicControl = qselect("#musicControl")
const playPauseIcon = qselect("#playPause")
const bgMusic = qselect("audio")

if (bgMusic) { bgMusic.load() }

const bgMusicPlay = (play = true) => {
  if (bgMusic) {
    bgMusic.loop = true
    bgMusic.controls = false

    if (play == true) {
      bgMusic.play()
      console.log('bgmusicplay');
    } else {
      bgMusic.pause()
    }
  }
}

$('body').css('overflowY', 'hidden');

$("#btn-envelope").on('click', function () {
  $("body").css("overflow-y", "auto");
  bgMusicPlay();
  $(".envelope-wrapper").css("transform", "translateY(-100%)");
})

$(document).ready(() => {
  AOS.refresh()


  if (musicControl) {
    musicControl.addEventListener("click", (event) => {
      if (bgMusic.paused == true) {
        bgMusicPlay()
        playPauseIcon.classList.replace('icofont-music-alt', 'icofont-ui-pause');
      } else {
        bgMusicPlay(false)
        playPauseIcon.classList.replace('icofont-ui-pause', 'icofont-music-alt');
      }
    })
  }

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

  const default_gallery = document.querySelector('.default-gallery')

  if (default_gallery) {
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
  }

  $(document).scroll(function () {
    $('nav').toggleClass('scrolled', $(this).scrollTop() > $('nav').height())
  });

  $('iframe').on('load', function () {
    AOS.refresh();
  });

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
});

window.addEventListener('resize', function () {
  this.setTimeout(() => {
    AOS.refresh()
    console.log('resize')
  }, 1000)
})