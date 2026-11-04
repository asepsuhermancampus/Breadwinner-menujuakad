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
    const glider = tabsWrap.querySelector(".glider");
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

$(window).on('resize', function () {
    console.log('Window Resized');
    setTimeout(function () {
        AOS.refresh();
    }, 1000);
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the stepper_id from Laravel (passed as a variable)
    //  const stepperId = {{ $domain->steppers_id ?? 0 }};

    // Check if the stepper_id is 20818
    if (stepper_id === 20818) {
        // Find the input element by name or class
        const nameInput = document.querySelector('input[name="name"]');

        // Change the placeholder
        if (nameInput) {
            nameInput.placeholder = "Nama Lengkap";
        }

        const jumlahSelect = document.getElementById('jumlah');
        if (jumlahSelect) {
            jumlahSelect.classList.remove('form-control');
            jumlahSelect.classList.add('form-select');
        }
    }
});


const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName == "dimasadepaninda.menujuakad.com") {
    const newStyle = document.createElement("link");
    newStyle.setAttribute("rel", "stylesheet");
    newStyle.setAttribute("href", `/templates/assets/themes/theme_57/assets/css/styles-custom-ninda-dimas.css)}`);

    document.head.appendChild(newStyle);

    // link assets
    const urlMedia = "/templates/assets/media/488366da91832c073c7560f58064da1e.webp";
    const flowerCreamUrl = urlMedia.concat("", new URL("/templates/assets/themes/theme_57/assets/images/flower-cream.png"));
    const flowerBurgundyUrl = urlMedia.concat("", new URL("/templates/assets/themes/theme_57/assets/images/flower-burgundy.png"));
    const bgBurgundyUrl = urlMedia.concat("", new URL("/templates/assets/themes/theme_57/assets/images/bg-burgundy.png"));

    const couple = document.querySelector(".couple-section");
    if (couple) {
        const ornWrap = document.createElement("div");
        ornWrap.classList.add("ornaments-wrapper", "orn-front");

        ornWrap.innerHTML = `
            <div class="orn-1">
                <div class="image-element">
                    <img src="${flowerCreamUrl}" alt="flower-cream" class="img-fluid">
                </div>
            </div>
            <div class="orn-2">
                <div class="image-element">
                    <img src="${flowerBurgundyUrl}" alt="flower-burgundy" class="img-fluid">
                </div>
            </div>
            <div class="orn-3">
                <div class="image-element">
                    <img src="${flowerBurgundyUrl}" alt="flower-burgundy" class="img-fluid">
                </div>
            </div>
        `

        couple.insertBefore(ornWrap, couple.firstChild);
    }

    const venue = document.querySelector(".venue-section");
    if (venue) {
        const ornWrap = document.createElement("div");
        ornWrap.classList.add("ornaments-wrapper");

        ornWrap.innerHTML = `
            <div class="bg">
                <div class="image-element">
                    <img src="${bgBurgundyUrl}" alt="bg-burgundy" class="img-fluid">
                </div>
            </div>
            <div class="orn-1">
                <div class="image-element">
                    <img src="${flowerBurgundyUrl}" alt="flower-burgundy" class="img-fluid">
                </div>
            </div>
            <div class="orn-2">
                <div class="image-element">
                    <img src="${flowerBurgundyUrl}" alt="flower-burgundy" class="img-fluid">
                </div>
            </div>
            <div class="orn-3">
                <div class="image-element">
                    <img src="${flowerBurgundyUrl}" alt="flower-burgundy" class="img-fluid">
                </div>
            </div>
            <div class="orn-4">
                <div class="image-element">
                    <img src="${flowerBurgundyUrl}" alt="flower-burgundy" class="img-fluid">
                </div>
            </div>
        `

        venue.insertBefore(ornWrap, venue.firstChild)
    }
}