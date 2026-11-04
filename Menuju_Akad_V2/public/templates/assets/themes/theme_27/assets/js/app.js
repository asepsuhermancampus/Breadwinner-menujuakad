document.addEventListener("DOMContentLoaded", function () {
    const splide_element = document.querySelector(".default-gallery")
    if (splide_element) {
        const splide = new Splide(".splide", {
            // type: "slide",
            perPage: 3,
            pagination: false,
            gap: '.75rem',
            perMove: 1,
            breakpoints: {
                576: {
                    perPage: 1,
                }
            }
        });

        splide.mount();

        $("#zoom-gallery").magnificPopup({
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
});

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

$(document).ready(() => {
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

    // countdown
    const date = $(".countdown").attr("date");
    Countdown(date);

    $("body").css("overflow-y", "hidden");

    $("#btn-envelope").on("click", function () {
        $("body").css("overflow-y", "auto");
        bgMusicPlay();
        $(".envelope-wrap").css("transform", "translateY(-100%)");
    });

    $(document).scroll(function () {
        $('nav').toggleClass('scrolled', $(this).scrollTop() > $('nav').height())
    });

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

if(siteName === "sanabrenton.menujuakad.com") {
	const venueSection = document.querySelector('.section-5');
	const events = venueSection.querySelectorAll('.content .card');

	events.forEach(event=>{
		const eventName = event.querySelector('h5[data-aos="zoom-in"]').textContent;

		if(eventName === "Dinner Reception"){
			const h6Tag = event.querySelectorAll("h6");
			h6Tag[h6Tag.length - 1].remove();
		}
	})
}