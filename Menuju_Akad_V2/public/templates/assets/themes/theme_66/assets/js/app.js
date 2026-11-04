window.scrollTo(0, 0);

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

$("body").css("overflow-y", "hidden");

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

// Parallax
gsap.registerPlugin(ScrollTrigger);

// gsap.utils.toArray('.parallax-wrapper').forEach((imgWrap, i) => {
//     imgWrap.parallax = imgWrap.querySelector(".parallax");

//     gsap.fromTo(imgWrap.parallax, {
//         y: 0,
//     }, {
//         y: "80%",
//         ease: "none",
//         scrollTrigger: {
//             trigger: imgWrap,
//             start: "top top",
//             end: "bottom top",
//             scrub: true,
//             invalidateOnRefresh: true,
//         }
//     })

//     gsap.fromTo(imgWrap.parallax, {
//         y: "-80%",
//     }, {
//         y: 0,
//         ease: "none",
//         scrollTrigger: {
//             trigger: imgWrap,
//             start: "top bottom",
//             end: "bottom bottom",
//             scrub: true,
//             invalidateOnRefresh: true,
//         }
//     })
// })

// Progress Bar
let progress = document.querySelector(".progress");

gsap.to("body", {
    scrollTrigger: {
        onUpdate: (self) => (progress.style.width = `${self.progress * 100}%`),
    },
});

gsap.utils.toArray(".event").forEach((evt, i) => {
    evt.eventDesc = evt.querySelector("#event-desc");
    evt.buttonMaps = evt.querySelector("#button-maps");
    if (evt.buttonMaps) {
        evt.btnClose = evt.querySelector(".btn-close");
        evt.target = evt.buttonMaps.dataset.target;
        evt.map = evt.querySelector(evt.target);

        evt.map.style.opacity = 0;
        evt.map.style.display = "none";

        evt.buttonMaps.addEventListener("click", (e) => {
            gsap.fromTo(
                evt.target,
                0.5,
                {
                    scale: 0.5,
                },
                {
                    scale: 1,
                    opacity: 1,
                    ease: "none",
                    display: "block",
                    position: "relative",
                }
            );

            gsap.fromTo(
                evt.eventDesc,
                0.5,
                {
                    scale: 1,
                },
                {
                    scale: 0.5,
                    display: "none",
                    opacity: 0,
                    ease: "none",
                    position: "absolute",
                }
            );
        });

        evt.btnClose.addEventListener("click", (e) => {
            gsap.fromTo(
                evt.eventDesc,
                0.5,
                {
                    scale: 0.5,
                },
                {
                    scale: 1,
                    ease: "none",
                    opacity: 1,
                    display: "block",
                    position: "relative",
                }
            );

            gsap.fromTo(
                evt.target,
                0.5,
                {
                    opacity: 1,
                    scale: 0.8,
                },
                {
                    scale: 0.5,
                    opacity: 0,
                    display: "none",
                    ease: "none",
                    position: "absolute",
                }
            );
        });
    }
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

// $("img").on("load", function () {
//     ScrollTrigger.refresh();
// });
