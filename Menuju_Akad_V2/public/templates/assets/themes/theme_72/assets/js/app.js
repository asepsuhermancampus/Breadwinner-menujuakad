const mainApp = document.querySelector(".main-app");
const scriptGsap = document.createElement("script");
scriptGsap.src = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js";
const scriptFlip = document.createElement("script");
scriptFlip.src = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Flip.min.js";
mainApp.append(scriptGsap, scriptFlip);


const musicControl = $("#musicControl");
const playPauseIcon = document.querySelector("#playPause");
const bgMusic = document.querySelector("audio");

gsap.registerPlugin(ScrollTrigger)

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

    runAnimationOrnament();
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

if (document.querySelector("#zoom-gallery")) {
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
}

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

const runAnimationOrnament = () => {
	document.querySelectorAll("[data-anim]").forEach(da => {
		ScrollTrigger.create({
			trigger: da,
			start: da.dataset.animAnchor ? da.dataset.animAnchor : "top bottom",
			onToggle: self => {
				if (!self.isActive) {
					if (da.classList.contains("animate-loop")) {
						return da.classList.add("animate-paused")
					} else {
						return null;
					}
				}
				if (da.dataset.loadAnimation) {
					if (da.classList.contains("animate-loop")) {
						return da.classList.remove("animate-paused")
					} else {
						return self.kill()
					}
				}

				if (da.dataset.animDuration) da.style.animationDuration = da.dataset.animDuration

				if (da.dataset.animDelay) {
					setTimeout(() => {
						da.classList.add("has-animate")
						da.classList.remove("animation-invisible")
						da.dataset.loadAnimation = true;
					}, da.dataset.animDelay)
				} else {
					da.classList.add("has-animate")
					da.classList.remove("animation-invisible")
					da.dataset.loadAnimation = true;
				}
			}
		})
	})
}

const runAnimationOrnamentCover = () => {
	document.querySelectorAll(".cover-section [data-anim]").forEach(vs => {
		ScrollTrigger.create({
			trigger: vs,
			start: "top bottom",
			onToggle: self => {
				if (self.isActive) {
					if (vs.dataset.animDuration) vs.style.animationDuration = vs.dataset.animDuration

					if (vs.dataset.animDelay) {
						setTimeout(() => {
							vs.classList.add("has-animate")
							vs.classList.remove("animation-invisible")
							vs.dataset.loadAnimation = true;
							self.kill()
						}, vs.dataset.animDelay)
					} else {
						vs.classList.add("has-animate")
						vs.classList.remove("animation-invisible")
						vs.dataset.loadAnimation = true;
						self.kill()
					}
				} else {
					vs.classList.add("animation-invisible")
					self.kill()
				}
			}
		})
	})
}


const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "dee-and-ibra.menujuakad.com") {
    const reminderWrap = document.querySelector(".couple-section .reminder-wrap");
    if (reminderWrap) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("reminder-bg");

        const newImg = document.createElement("img");
        newImg.src = "/templates/assets/media/edb41b55872fee6cff59026916d63002.webp";
        newImg.alt = "crystal-border-horizontal";
        newImg.classList.add("reminder-border");

        newDiv.appendChild(newImg);

        reminderWrap.insertBefore(newDiv, reminderWrap.firstElementChild);
    }

    const events = document.querySelectorAll(".venue-section .venue-content .card");
    const event1 = events[0].parentElement;

    event1.querySelector("img.orn-1")?.remove();

    const newOrnWrap = document.createElement("div");
    newOrnWrap.classList.add("ornaments-wrapper");
    newOrnWrap.dataset.anim = "zoom-in";

    const orn1 = document.createElement("div");
    orn1.classList.add("orn-1");
    const ornImg1 = document.createElement("img");
    ornImg1.classList.add("img-fluid", "animate-loop");
    ornImg1.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
    ornImg1.alt = "rose-venue-1";
    ornImg1.dataset.anim = "lambai";
    orn1.appendChild(ornImg1);
    const orn2 = document.createElement("div");
    orn2.classList.add("orn-2");
    const ornImg2 = document.createElement("img");
    ornImg2.classList.add("img-fluid", "animate-loop");
    ornImg2.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
    ornImg2.alt = "rose-venue-1";
    ornImg2.dataset.anim = "lambai";
    orn2.appendChild(ornImg2);
    const orn3 = document.createElement("div");
    orn3.classList.add("orn-3");
    const ornImg3 = document.createElement("img");
    ornImg3.classList.add("img-fluid", "animate-loop");
    ornImg3.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
    ornImg3.alt = "rose-venue-1";
    ornImg3.dataset.anim = "lambai";
    orn3.appendChild(ornImg3);
    const orn4 = document.createElement("div");
    orn4.classList.add("orn-4");
    const ornImg4 = document.createElement("img");
    ornImg4.classList.add("img-fluid", "animate-loop");
    ornImg4.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
    ornImg4.alt = "rose-venue-1";
    ornImg4.dataset.anim = "lambai";
    orn4.appendChild(ornImg4);
    const orn5 = document.createElement("div");
    orn5.classList.add("orn-5");
    const ornImg5 = document.createElement("img");
    ornImg5.classList.add("img-fluid", "animate-loop");
    ornImg5.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
    ornImg5.alt = "rose-venue-1";
    ornImg5.dataset.anim = "lambai";
    orn5.appendChild(ornImg5);
    const orn6 = document.createElement("div");
    orn6.classList.add("orn-6");
    const ornImg6 = document.createElement("img");
    ornImg6.classList.add("img-fluid", "animate-loop");
    ornImg6.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
    ornImg6.alt = "rose-venue-1";
    ornImg6.dataset.anim = "lambai";
    orn6.appendChild(ornImg6);
    const orn7 = document.createElement("img");
    orn7.classList.add("orn-7");
    orn7.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
    orn7.alt = "rose-venue-1";
    orn7.dataset.anim = "lambai";

    newOrnWrap.append(orn1, orn2, orn3, orn4, orn5, orn6);

    event1.insertBefore(newOrnWrap, event1.firstElementChild);

    if (events.length == 2) {
        const event2 = events[1].parentElement;
        event2.querySelector("img.orn-2")?.remove();

        const newOrnWrapClone = newOrnWrap.cloneNode(false);
        newOrnWrapClone.append(orn1.cloneNode(true), orn2.cloneNode(true), orn3.cloneNode(true), orn4.cloneNode(true), orn5.cloneNode(true), orn6.cloneNode(true));

        event2.insertBefore(newOrnWrapClone, event2.firstElementChild);
    }

    const gallery = document.querySelector(".gallery-section");
    if (gallery) {
        const orn1 = document.createElement("img");
        orn1.classList.add("orn-1");
        orn1.src = "/templates/assets/media/3c77f98e50c2d4beff18df3a9d972d2e.webp";
        orn1.alt = "rose-venue-1";

        gallery.insertBefore(orn1, gallery.firstElementChild);
    }
}