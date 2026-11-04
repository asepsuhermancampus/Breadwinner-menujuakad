window.scrollTo(0, 0)

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

const waitCoverLoading = (el) => {
	return new Promise((resolve) => {
		el.classList.add('cover-opening')

		setTimeout(() => resolve(el), 2500)
	})
}

document.body.style.overflow = "hidden"

document.querySelector("#btn-envelope").addEventListener("click", () => {
	document.body.style.overflow = "auto"

	document.querySelector(".cover-section").classList.add("cover-opened")

	runAnimationOrnament()
	runAnimationLoop()

	bgMusicPlay()
})

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

if (cd) Countdown(cd.getAttribute("date"))

gsap.registerPlugin(ScrollTrigger, Flip)

// Progress Bar
let progress = document.querySelector(".progress");

ScrollTrigger.create({
	trigger: "body",
	start: "top top",
	end: "bottom bottom",
	onUpdate: (self) => (progress.style.transform = `${self.progress}`),
})

// Egift section
const giftWrap = document.querySelector(".egift-section");
if (giftWrap) {
	const tabsWrap = giftWrap.querySelector(".tabs-gift");
	const tab = tabsWrap.querySelectorAll(".tab");
	const glider = tabsWrap.querySelector(".glider");
	tab.forEach((el) => {
		el.classList.forEach((c) => {
			if (c === "active") {
				giftWrap.querySelectorAll(el.dataset.tab).forEach((tb) => {
					tb.classList.add("show");
				});

				ScrollTrigger.refresh();
			}
		});

		el.addEventListener("click", (e) => {
			const flipState = Flip.getState(glider)

			if (tabsWrap.querySelector(".active")) {
				tabsWrap.querySelector(".active").classList.remove("active");
				giftWrap.querySelectorAll(".show").forEach((se) => {
					se.classList.remove("show");
				});
			}

			el.classList.add("active");
			el.appendChild(glider)
			giftWrap.querySelectorAll(el.dataset.tab).forEach((tb) => {
				tb.classList.add("show");
			});

			Flip.from(flipState, { duration: .25, ease: "power1.inOut" })

			ScrollTrigger.refresh();
		});
	});
}

const getLoadedIframe = (ifr) => {
	return new Promise((resolve, reject) => {
		ifr.onload = () => resolve("maps loaded!")
		ifr.onerror = () => reject("Iframe Load Failed: Please Check Again Your URL!")
		ifr.src = ifr.dataset.src
	})
}

// Modal Event Handler
window.onload = function(){
	const mapModal = document.querySelectorAll(".modal");

	mapModal.forEach(modal => {
		modal.addEventListener("shown.bs.modal", (e) => {
			const loader = e.target.querySelector(".loader-wrapper-modal")
			const iframe = e.target.querySelector("iframe")

			getLoadedIframe(iframe).then(() => {
				loader.classList.add("loaded")
			}).catch(err => {
				console.log(err)
			})
		})

		modal.addEventListener("hidden.bs.modal", (e) => {
			const iframe = e.target.querySelector("iframe")
			const loader = e.target.querySelector(".loader-wrapper-modal")
			iframe.src = "";
			loader.classList.remove("loaded");
		})
	})
}

if (document.querySelector("#zoom-gallery-default")) {
	$("#zoom-gallery-default").magnificPopup({
		delegate: "li a",
		type: "image",
		mainClass: "mfp-with-zoom mfp-img-mobile",
		zoom: {
			enabled: true,
			easing: "ease-in-out",
		},
	});
}


if (document.querySelectorAll("[data-anim]")) {
	document.querySelectorAll("[data-anim]").forEach(ada => {
		ada.classList.add("animation-invisible")
	})
}

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

const runAnimationLoop = () => {
	document.querySelectorAll("[data-animationloop]").forEach(al => {
		ScrollTrigger.create({
			trigger: al,
			start: "-10% bottom",
			onToggle: self => self.isActive ? al.classList.add("animation-loop") : al.classList.remove("animation-loop")
		})
	})
}

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "theweddingofabiyahfajar.menujuakad.com") {
	const venueSection = document.querySelector(".venue-section");
	if (venueSection) {
		const events = venueSection.querySelectorAll(".venue-wrapper .venue-content .card");

		events.forEach(event => {
			const eventName = event.querySelector(".event-name h4").textContent.trim();
			console.log(eventName);
			if (eventName === 'Akad Nikah') {
				const eventPlace = event.querySelector(".event-place");
				eventPlace.remove();
			}
		})
	}
} else if (siteName === "anantodara.menujuakad.com") {
	const coverDesc = document.querySelector(".cover-section .cover-wrapper .cover-content .cover-body .cover-description");
	const greetingWrap = coverDesc.querySelector(".greeting-wrapper");
	const btnCover = coverDesc.querySelector(".elements-widget");

	if (greetingWrap) {
		coverDesc.insertBefore(greetingWrap, btnCover);
		greetingWrap.classList.add("mt-5");
	}
} else if (siteName === "raakindanhanna.menujuakad.com") {
	const egiftSection = document.querySelector(".egift-section");
	if (egiftSection) {
		const btnOpenAngpao = egiftSection.querySelector(".gift-wrap .angpao button#openAngpao");
		btnOpenAngpao.textContent = "E-Gift";
	}
} else if (siteName === "nadhifah-dimas.menujuakad.com") {
	// Wait for DOM to be fully loaded
	document.addEventListener('DOMContentLoaded', function () {
		const textarea = document.querySelector('textarea[placeholder="Tulis harapan kamu"]');
		if (textarea) { textarea.placeholder = "Do'a dan Harapan"; }
	});
} else if (siteName === "tiasfitraswedding.menujuakad.com") {
	document.addEventListener('DOMContentLoaded', function () {
		// Target the specific card for Resepsi Pernikahan
		const resepsiCards = document.querySelectorAll('.venue-content .card');

		resepsiCards.forEach(card => {
			const title = card.querySelector('.event-name-body h4');
			if (title && title.textContent.trim() === "Resepsi Pernikahan") {
				const timeParagraphs = card.querySelectorAll('.event-name-body p');
				// The last p tag should be the time
				if (timeParagraphs.length >= 3) {
					timeParagraphs[timeParagraphs.length - 1].textContent = "18:30 WIB - Selesai";
				}
			}
		});
	});
} else if (siteName === "resendeternally.menujuakad.com") {
	const events = document.querySelectorAll(".venue-content .card");

	events.forEach(event => {
		const eventName = event.querySelector(".event-name h4");

		if (eventName) {
			const originalText = eventName.innerHTML;
			const newEventName = originalText.replace("(", "<br><span style='font-size: 0.7em; font-weight: normal;'>(").replace(")", ")</span>");
			eventName.innerHTML = newEventName;
		}
	});
} else if (siteName === "qurridiffa.menujuakad.com") {
	const events = document.querySelectorAll(".venue-section .venue-content .card");

	events.forEach(event => {
		const eventNameElement = event.querySelector(".event-name h4");

		if (eventNameElement.textContent.trim() === "Akad Nikah (Telah Dilaksanakan)") {
			eventNameElement.innerHTML = eventNameElement.textContent.trim().replace(/\((.*?)\)/, '<span>($1)</span>');
		}
	})
} else if (siteName === "viding-democos.menujuakad.com") {
	const newOrn = document.createElement("div");
	newOrn.classList.add("ornaments-wrapper");
	newOrn.innerHTML = `
					<div class="tree-1">
                        <div class="tree">
                            <div class="image-element" data-anim="fade-right">
                                <img src="/templates/assets/media/933882450fe0f26e615baa8c808887d4.webp" alt="tree" class="img-fluid animate-loop" data-anim="rotate-left" data-anim-duration="4500ms">
                            </div>
                        </div>
                        <div class="image-element" data-anim="fade-right">
                            <img src="/templates/assets/media/933882450fe0f26e615baa8c808887d4.webp" alt="tree" class="img-fluid animate-loop" data-anim="rotate-left">
                        </div>
                    </div>
					<div class="tree-2">
                        <div class="tree">
                            <div class="image-element" data-anim="fade-left">
                                <img src="/templates/assets/media/933882450fe0f26e615baa8c808887d4.webp" alt="tree" class="img-fluid animate-loop" data-anim="rotate-left" data-anim-duration="4500ms">
                            </div>
                        </div>
                        <div class="image-element" data-anim="fade-left">
                            <img src="/templates/assets/media/933882450fe0f26e615baa8c808887d4.webp" alt="tree" class="img-fluid animate-loop" data-anim="rotate-left">
                        </div>
                    </div>
	`;

	const headerOrn = document.querySelector(".header-section .ornaments-wrapper");
	headerOrn.insertBefore(newOrn, headerOrn.querySelector(".orn-1"));
}
