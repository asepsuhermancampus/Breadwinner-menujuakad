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
if (giftWrap) {
    const tabsWrap = giftWrap.querySelector(".tabs-gift");
    const tab = tabsWrap.querySelectorAll(".tab");
    tab.forEach((el) => {
        el.classList.forEach((c) => {
            if (c === "active") {
                giftWrap.querySelectorAll(el.dataset.tab).forEach((tb) => {
                    tb.classList.add("show");
                });

                AOS.refresh();
            }
        });

        el.addEventListener("click", (e) => {
            if (tabsWrap.querySelector(".active")) {
                tabsWrap.querySelector(".active").classList.remove("active");
                giftWrap.querySelectorAll(".show").forEach((se) => {
                    se.classList.remove("show");
                });
            }

            el.classList.add("active");
            giftWrap.querySelectorAll(el.dataset.tab).forEach((tb) => {
                tb.classList.add("show");
            });

            AOS.refresh();
        });
    });
}

if (document.querySelector(".zoom-gallery")) {
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

AOS.init({
    easing: "ease-out-back",
    duration: 2000,
});

const gallery = document.querySelector(".gallery");
if (gallery) {
    const gridLg = [2, 3, 8, 9, 14];
    const gridSm = [2, 3, 8, 9, 14];

    const mq = window.matchMedia("(max-width: 767px)");

    const galleryItems = gallery.querySelectorAll("a");

    const switchGrid = (mqh) => {
        let grid = gallery.querySelectorAll(".grid-lg");
        if (grid) {
            grid.forEach((el, index) => {
                el.classList.remove("grid-lg");
            });
        }

        galleryItems.forEach((el, index) => {
            if (mqh.matches) {
                gridSm.includes(index) && el.classList.add("grid-lg");
            } else {
                gridLg.includes(index) && el.classList.add("grid-lg");
            }
        });
    };

    switchGrid(mq);

    mq.addEventListener("change", switchGrid);
}

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

