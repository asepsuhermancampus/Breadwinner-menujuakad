$("body").css("overflow-y", "hidden");

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

// gsap.utils.toArray(".parallax-wrapper").forEach((imgWrap, i) => {
//     imgWrap.parallax = imgWrap.querySelector(".parallax");

//     gsap.fromTo(
//         imgWrap.parallax,
//         {
//             y: 0,
//         },
//         {
//             y: "100%",
//             ease: "none",
//             scrollTrigger: {
//                 trigger: imgWrap,
//                 start: "top top",
//                 end: "bottom top",
//                 scrub: true,
//                 invalidateOnRefresh: true,
//             },
//         }
//     );

//     gsap.fromTo(
//         imgWrap.parallax,
//         {
//             y: "-100%",
//         },
//         {
//             y: 0,
//             ease: "none",
//             scrollTrigger: {
//                 trigger: imgWrap,
//                 start: "top bottom",
//                 end: "bottom bottom",
//                 scrub: true,
//                 invalidateOnRefresh: true,
//             },
//         }
//     );
// });

// Progress Bar
let progress = document.querySelector(".progress");

gsap.to("body", {
    scrollTrigger: {
        onUpdate: (self) => (progress.style.width = `${self.progress * 100}%`),
    },
});

gsap.utils.toArray(".slide-map").forEach((vc, i) => {
    vc.event = vc.querySelector("#event");
    vc.maps = vc.querySelector("#maps");
    vc.buttonMaps = vc.querySelector("#button-maps");
    vc.btnClose = vc.querySelector(".btn-close");

    vc.maps.style.opacity = 0;

    vc.buttonMaps.addEventListener("click", (e) => {
        gsap.fromTo(
            vc.maps,
            0.5,
            {
                x: "100%",
            },
            {
                x: "0%",
                opacity: 1,
                ease: "none",
                display: "block",
                position: "relative",
            }
        );

        gsap.fromTo(
            vc.event,
            0.5,
            {
                x: "0%",
            },
            {
                x: "-100%",
                display: "none",
                opacity: 0,
                ease: "none",
                position: "absolute",
            }
        );
    });

    vc.btnClose.addEventListener("click", (e) => {
        gsap.fromTo(
            vc.event,
            0.5,
            {
                x: "-100%",
            },
            {
                x: "0%",
                ease: "none",
                opacity: 1,
                display: "flex",
                position: "relative",
            }
        );

        gsap.fromTo(
            vc.maps,
            0.5,
            {
                x: "0%",
                opacity: 1,
                position: "absolute",
            },
            {
                x: "100%",
                opacity: 0,
                display: "none",
                ease: "none",
            }
        );
    });
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

const gallery = document.querySelector(".gallery");
if (gallery) {
    const gridLg = [0, 7, 8, 14];
    const gridSm = [0, 5, 6, 11, 12];

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
