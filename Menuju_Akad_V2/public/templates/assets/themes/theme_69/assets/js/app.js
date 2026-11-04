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

// Parallax
gsap.registerPlugin(ScrollTrigger);

AOS.init({
    easing: "ease-out-back",
    duration: 2000,
});

// Progress Bar
let progress = document.querySelector(".progress");

gsap.to("body", {
    scrollTrigger: {
        onUpdate: (self) => (progress.style.width = `${self.progress * 100}%`),
    },
});

// let getRandomInteger = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// gsap.utils.toArray(".ornament-wrap").forEach((ow) => {
//     ow.o = ow.querySelectorAll(".ornament");

//     gsap.utils.toArray(ow.o).forEach((o, i) => {
//         let durations = getRandomInteger(5, 10);
//         gsap.fromTo(
//             ow.querySelector(`.ornament:nth-child(${i + 1})`),
//             durations,
//             { scale: 1 },
//             { scale: 0.5 }
//         )
//             .repeat(-1)
//             .yoyo(true);
//     });
// });

// gsap.utils.toArray(".ornament-wrap").forEach((ow) => {
//     ow.o = ow.querySelectorAll(".ornament");

//     gsap.utils.toArray(ow.o).forEach((o, i) => {
//         let durations = getRandomInteger(5, 10);
//         gsap.fromTo(
//             ow.querySelector(`.ornament:nth-child(${i + 1})`),
//             durations,
//             { scale: 1 },
//             { scale: 0.5 }
//         )
//             .repeat(-1)
//             .yoyo(true);
//     });
// });

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


const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if(siteName === "89yearsofmoonlight.menujuakad.com") {
	const btnReminder = document.querySelector(".header-section .reminder-wrap .btn-reminder");
    if(btnReminder){
        btnReminder.setAttribute("href", "https://www.google.com/calendar/render?action=TEMPLATE&text=Wulandani+Sentosa's+89th+Birthday+Party&details=Visit+the+invitation+here+<a href='http%3A%2F%2F89yearsofmoonlight.menujuakad.com'>http%3A%2F%2F89yearsofmoonlight.menujuakad.com</a>&dates=20250817T173000%2F20250817T174500&ctz=Asia%2FJakarta")
    }
}