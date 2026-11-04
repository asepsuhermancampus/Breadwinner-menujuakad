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

$(document).ready(() => {
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
});

$('iframe, img').on('load', function () {
  AOS.refresh();
  console.log('AOS Refreshed');
});

$(window).on('resize', function () {
  console.log('Window Resized');
  setTimeout(function () {
    AOS.refresh();
  }, 1000);
});

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName == "samuelandfinley.menujuakad.com") {

  // Target all event cards and update the date format
  const eventCards = document.querySelectorAll('.card.text-start.border-0');

  eventCards.forEach(card => {
    const dateElement = card.querySelector('.event-name p.mb-0');
    if (dateElement && dateElement.textContent.includes('Saturday, March 28th, 2026')) {
      dateElement.textContent = 'Saturday, 28 March 2026';
    }
  });

  // const bridePhotoUrl = "/templates/assets/themes/theme_48/assets/images/samuelandfinley/bride.jpeg";
  // const groomPhotoUrl = "/templates/assets/themes/theme_48/assets/images/samuelandfinley/groom.jpeg";

  // const layoutCoupleImage = document.createElement("div");
  // layoutCoupleImage.classList.add("col-md-4", "col-xl-3");
  // const coupleImages = document.createElement("div");
  // coupleImages.classList.add("image-wrapper");

  // coupleImages.innerHTML = `
  //   <div class="image-element">
  //     <img src="${groomPhotoUrl}" alt="couple-images" class="couple-image" />
  //   </div>
  //   <div class="image-element">
  //     <img src="${bridePhotoUrl}" alt="couple-images" class="couple-image" />
  //   </div>
  // `;

  // layoutCoupleImage.appendChild(coupleImages);

  // const coupleRows = document.querySelectorAll(".couple-section .container > .row.justify-content-center");

  // try {
  //   const rowCoupleDetails = coupleRows[1];

  //   const heightLayout = rowCoupleDetails.querySelector(".col-md-8").clientHeight;
  //   coupleImages.style.height = `${heightLayout}px`;

  //   if (rowCoupleDetails) rowCoupleDetails.insertBefore(layoutCoupleImage, rowCoupleDetails.firstElementChild);
  // } catch (error) {
  //   console.error(error);
  // }
} 