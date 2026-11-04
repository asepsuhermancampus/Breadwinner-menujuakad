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
                evt.eventDesc,
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

        evt.btnClose.addEventListener("click", (e) => {
            gsap.fromTo(
                evt.eventDesc,
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
                evt.target,
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
    }
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

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "kazamievent.menujuakad.com") {
	// Wait for the page to load
	document.addEventListener('DOMContentLoaded', function() {
		// Find the couple div
		const coupleDiv = document.querySelector('.couple.h-100');
		
		// Create Instagram container
		const instagramContainer = document.createElement('div');
		instagramContainer.className = 'instagram-container';
		instagramContainer.style.cssText = `
			text-align: center;
			margin-top: 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
		`;
		
		// Create Instagram icon (using Font Awesome classes)
		const icon = document.createElement('i');
		icon.className = 'fab fa-instagram';
		icon.style.cssText = `
			color: #E4405F;
			font-size: 16px;
		`;
		
		// Create username
		const username = document.createElement('span');
		username.textContent = 'kazami_store';
		username.style.cssText = `
			font-family: Arial, sans-serif;
			font-size: 14px;
			color: #333;
			text-decoration: none;
		`;
		
		// Create link wrapper
		const link = document.createElement('a');
		link.href = 'https://instagram.com/kazami_store';
		link.target = '_blank';
		link.style.cssText = `
			text-decoration: none;
			color: inherit;
			display: flex;
			align-items: center;
			gap: 8px;
		`;
		
		// Assemble the elements
		link.appendChild(icon);
		link.appendChild(username);
		instagramContainer.appendChild(link);
		
		// Insert after the image-wrap div
		coupleDiv.appendChild(instagramContainer);
	});
}