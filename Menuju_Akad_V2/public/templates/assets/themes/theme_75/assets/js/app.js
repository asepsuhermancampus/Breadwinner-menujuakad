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
    bgMusicPlay();
    $(".envelope-wrap").css("transform", "translateY(-100%)");
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

const cd = document.querySelector(".countdown");

if (cd) Countdown(cd.getAttribute("date"));

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

// Egift section
const giftWrap = document.querySelector(".egift-section");
const tabsWrap = document.querySelector(".tabs-gift");

if (giftWrap && tabsWrap) {
    const tab = tabsWrap.querySelectorAll(".tab");
    const glider = tabsWrap.querySelector(".glider");

    tab.forEach((el) => {
        el.classList.forEach((c) => {
            c === "active" &&
                giftWrap.querySelectorAll(el.dataset.tab).forEach((el) => {
                    el.classList.add("show");
                });
        });

        el.addEventListener("click", (e) => {
            glider.style.width = "95%";
            setTimeout(() => {
                if (tabsWrap.querySelector(".active")) {
                    tabsWrap
                        .querySelector(".active")
                        .classList.remove("active");
                    giftWrap.querySelectorAll(".show").forEach((el) => {
                        el.classList.remove("show");
                    });
                }

                glider.style.width = `${el.offsetWidth}px`;
                el.classList.add("active");

                giftWrap.querySelectorAll(el.dataset.tab).forEach((el) => {
                    el.classList.add("show");
                });
            }, 250);
        });
    });
}

$("#zoom-gallery").magnificPopup({
    delegate: "li a",
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

$(window).on('resize', function () {
    console.log('Window Resized');
    setTimeout(function () {
        AOS.refresh();
    }, 1000);
});
