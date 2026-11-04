$("body").css("overflow", "hidden");

$("#btn-envelope").on("click", function () {
    $("body").css("overflow", "auto");

    $(".envelope-wrap").css("transform", "translate(0,-100%)");
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

// Parallax
gsap.registerPlugin(ScrollTrigger);

// gsap.utils.toArray(".parallax-wrapper").forEach((imgWrap, i) => {
// 	imgWrap.parallax = imgWrap.querySelector(".parallax");
//
// 	gsap.fromTo(
// 		imgWrap.parallax,
// 		{
// 			y: 0,
// 		},
// 		{
// 			y: "50%",
// 			ease: "none",
// 			scrollTrigger: {
// 				trigger: imgWrap,
// 				start: "top top",
// 				end: "bottom top",
// 				scrub: true,
// 				invalidateOnRefresh: true,
// 			},
// 		}
// 	);
//
// 	gsap.fromTo(
// 		imgWrap.parallax,
// 		{
// 			y: "-50%",
// 		},
// 		{
// 			y: 0,
// 			ease: "none",
// 			scrollTrigger: {
// 				trigger: imgWrap,
// 				start: "top bottom",
// 				end: "bottom bottom",
// 				scrub: true,
// 				invalidateOnRefresh: true,
// 			},
// 		}
// 	);
// });

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
