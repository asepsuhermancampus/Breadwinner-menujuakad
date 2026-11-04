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

document.addEventListener("click", e => {
	if (e.target.closest("#btn-envelope")) {
		document.body.style.overflow = "auto"

		document.querySelector(".cover-section").classList.add("cover-opened")

		bgMusicPlay()
		runAnimationOrnament()
		runAnimationLoop()
	}
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
	onUpdate: (self) => (progress.style.width = `${self.progress * 100}%`),
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

function convertTimeFormat(timeElement) {
	const timeText = timeElement.textContent;

	const convertedTime = timeText.replace(/(\d{1,2}):(\d{2})/g, (match, hours, minutes) => {
		const hourNum = parseInt(hours);
		const period = hourNum >= 12 ? 'PM' : 'AM';
		const displayHour = hourNum % 12 || 12;
		return `${displayHour}:${minutes} ${period}`;
	});

	timeElement.textContent = convertedTime;
}

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "audreyandhikawedding.menujuakad.com") {
	const parent = document.querySelector('.wishes-section');
	const textarea = parent.querySelector('.card .card-body form textarea');
	textarea.setAttribute("placeholder", "Silahkan Tulis Harapan Anda");
} else if (siteName === "khaixlisa.menujuakad.com") {
	// Find ALL time elements and convert each one
	const timeElements = document.querySelectorAll('.event-name p');
	timeElements.forEach(timeElement => {
		convertTimeFormat(timeElement);
	});
} else if (siteName === "andrisasha.menujuakad.com") {

	document.addEventListener('DOMContentLoaded', function () {
		const brideElement = document.querySelectorAll('.bride_style.notranslate');

		brideElement.forEach(element => {
			if (element.hasAttribute('data-anim')) {
				element.setAttribute('data-anim', 'zoom-in');
			}
		});
	});
} else if (siteName == "arsyaidhar.menujuakad.com") {
	const button = document.querySelector('#btn-envelope');
	button.querySelector('strong').innerHTML = 'Open Invitation <i class="fas fa-envelope-open-text"></i>';
} else if (siteName == "firairham.menujuakad.com") {
	/*
	const venue = document.querySelector(".venue-section");
	if (venue) {
		const events = venue.querySelectorAll(".venue-content .card");

		events.forEach(event => {
			const eventNameEl = event.querySelector(".event-name h4");
			let eventName = eventNameEl.textContent.trim();
			
			// Handle "Acara Pernikahan Resepsi" specifically
			if (eventName === "Acara Pernikahan Resepsi") {
				eventNameEl.innerHTML = `Acara Pernikahan <br><span style="font-size: 0.8em;">Resepsi</span>`;
			}
			// Handle cases where "Resepsi" appears in other contexts
			else if (eventName.includes("Resepsi")) {
				eventNameEl.innerHTML = eventName.replace(/Resepsi/g, `<br><span style="font-size: 0.8em;">Resepsi</span>`);
			}
		});
	}
	*/
} else if (siteName === "boykeferry.menujuakad.com") {
	try {
		const events = document.querySelectorAll(".venue-section .venue-wrapper .venue-content .card");

		events.forEach(event => {
			const dateWrapper = event.querySelector(".event-name .date");
			if (dateWrapper) {
				const day = dateWrapper.querySelector("p").textContent.trim();
				const date = dateWrapper.querySelector("h5").textContent.trim();

				const dates = event.querySelectorAll(".event-name > p");
				dates[0].textContent = `${day}, ${date} ${dates[0].textContent.trim()}`;

				dateWrapper.remove();
			}
		})
	} catch (error) {
		console.error(error)
	}
}
