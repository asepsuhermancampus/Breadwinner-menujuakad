$("body").css("overflow-y", "hidden");

$("#btn-envelope").on("click", function () {
    $("body").css("overflow-y", "auto");

    $(".envelope-wrap").css("transform", "translateY(-100%)");
    bgMusicPlay();
});

const musicControl = $("#musicControl");
const playPauseIcon = document.querySelector("#playPause");
const bgMusic = document.querySelector("audio");

if (bgMusic) {
    bgMusic.load();
}

const bgMusicPlay = (play = true) => {
    if (bgMusic) {
        bgMusic.loop = true;
        bgMusic.controls = false;

        if (play == true) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    }
};

if (musicControl) {
    musicControl.on("click", (event) => {
        if (bgMusic.paused == true) {
            bgMusicPlay();
            playPauseIcon.classList.replace(
                "icofont-music-alt",
                "icofont-ui-pause"
            );
        } else {
            bgMusicPlay(false);
            playPauseIcon.classList.replace(
                "icofont-ui-pause",
                "icofont-music-alt"
            );
        }
    });
}

var previousScroll = 70;
$(window).scroll(function (e) {
    // add/remove class to navbar when scrolling to hide/show
    var scroll = $(window).scrollTop();
    if (scroll >= previousScroll) {
        $("nav").addClass("navbar-hide");
    } else if (scroll < previousScroll) {
        $("nav").removeClass("navbar-hide");
        $("nav").addClass("scrolled");
    }

    if (scroll == 0) {
        $("nav").removeClass("navbar-hide");
        $("nav").removeClass("scrolled");
    }
    previousScroll = scroll;
});

if (document.querySelector(".countdown")) {
    const cd = document.querySelector(".countdown").getAttribute("date");
    Countdown(cd);
}

let getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Parallax
gsap.registerPlugin(ScrollTrigger);

let hs = document.querySelector(".header-section");
let hias = hs.querySelectorAll(".hias");
let hsd = 0;
gsap.utils.toArray(hias).forEach((h, i) => {
    gsap.fromTo(
        h,
        {
            y: 0,
        },
        {
            y: "150%",
            ease: "sine.in",
            scrollTrigger: {
                trigger: hs,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
            },
        }
    );
    gsap.fromTo(
        hs.querySelectorAll(`.hias:nth-child(${i + 1})`),
        { x: "-30%" },
        { x: "30%", ease: "sine.inOut", duration: getRandomInteger(10, 20) }
    )
        .repeat(-1)
        .yoyo(true);
});

let cs = document.querySelector(".couple-section");

if (cs) {
  let ch = cs.querySelectorAll(".hias");
  gsap.utils.toArray(ch).forEach((h, i) => {
    gsap.fromTo(
      h,
      {
        y: 0,
      },
      {
        y: "150%",
        ease: "sine.in",
        scrollTrigger: {
          trigger: cs,
          start: "top center",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    gsap.fromTo(
      cs.querySelectorAll(`.hias:nth-child(${i + 1})`),
      { x: "-30%" },
      { x: "30%", ease: "sine.inOut", duration: getRandomInteger(10, 20) }
    )
    .repeat(-1)
    .yoyo(true);
  });
}

let vs = document.querySelector(".venue-section");
if (vs) {
  let vh = vs.querySelectorAll(".hias");
  gsap.utils.toArray(vh).forEach((h, i) => {
    gsap.fromTo(
      h,
      {
        y: 0,
      },
      {
        y: "250%",
        ease: "sine.in",
        scrollTrigger: {
          trigger: vs,
          start: "top bottom",
          end: "bottom center",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    gsap.fromTo(
      vs.querySelectorAll(`.hias:nth-child(${i + 1})`),
      { x: "-30%" },
      { x: "30%", ease: "sine.inOut", duration: getRandomInteger(10, 20) }
    )
    .repeat(-1)
    .yoyo(true);
  });
}


// Progress Bar
let progress = document.querySelector(".progress");

gsap.to("body", {
    scrollTrigger: {
        onUpdate: (self) => (progress.style.width = `${self.progress * 100}%`),
    },
});

// Egift section
const giftWrap = document.querySelector(".egift-section");
const tabsWrap = document.querySelector(".tabs-gift");
if (giftWrap && tabsWrap) {
    const tab = tabsWrap.querySelectorAll(".tab");
    tab.forEach((el) => {
        el.classList.forEach((c) => {
            c === "active" &&
                giftWrap.querySelector(el.dataset.tab).classList.add("show");
        });

        el.addEventListener("click", (e) => {
            if (tabsWrap.querySelector(".active")) {
                tabsWrap.querySelector(".active").classList.remove("active");
                giftWrap.querySelector(".show").classList.remove("show");
            }

            el.classList.add("active");
            giftWrap.querySelector(el.dataset.tab).classList.add("show");
        });
    });
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

AOS.init({
    easing: "ease-out-back",
    duration: 2000,
});

$("img").on("load", function () {
    ScrollTrigger.refresh();
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
