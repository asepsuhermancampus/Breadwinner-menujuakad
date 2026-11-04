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

document.body.style.overflow = "hidden"

const waitCoverLoading = (el) => {
	return new Promise(resolve => {
		el.classList.add("cover-opening")
		setTimeout(() => resolve(el), 3500)
	})
}

document.querySelector("#btn-envelope").addEventListener("click", () => {
	waitCoverLoading(document.querySelector(".cover-section")).then((el) => {
		el.classList.remove("cover-opening");
		el.classList.add("cover-opened");

		document.body.style.overflow = "auto"
	})

	const noAnim = [0, 1]

	gsap.utils.toArray(".rose").forEach((el, index) => {
		const flipState = Flip.getState(el)

		document.querySelector(`#rose-${index}`).appendChild(el)

		Flip.from(flipState,
			{
				duration: 3.5,
				ease: "power1.inOut",
				onComplete: () => {
					if (!noAnim.includes(index)) {
						el.classList.add("has-animate", "animate-loop")
						el.dataset.anim = "rotate-right"
						ScrollTrigger.refresh()
					}
				}
			})
	})

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
const mapModal = document.querySelectorAll(".show-maps");

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

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "sukmadeforyan.menujuakad.com") {
	const parent = document.querySelectorAll('.venue-section .event-name');
	parent.forEach(element => {
		const eventName = element.querySelector("h4").textContent;
		if (eventName === "Pemberkatan") {
			const pTag = element.querySelectorAll("p");
			pTag[pTag.length - 1].textContent = "10:00 WIB - Selesai";
		}
	});
} else if (siteName === "yohansusie.menujuakad.com") {
	const coverDesc = document.querySelector('.cover-section .cover-description');
	const greetingWrap = coverDesc.querySelector(".greeting-wrapper");

	coverDesc.insertBefore(greetingWrap, coverDesc.querySelector(".elements-widget"));
} else if (siteName === "kevinitelyforgryson.menujuakad.com") {
	const rsvpEmailInput = document.querySelector(".rsvp-section form input[name='email']");
	if (rsvpEmailInput) {
		rsvpEmailInput.setAttribute("name", "address");
		rsvpEmailInput.setAttribute("placeholder", "Any diet restriction?");
		rsvpEmailInput.setAttribute("type", "text");
	}
} else if (siteName === "theweddingofjeffrykatrin.menujuakad.com") {
	const events = document.querySelectorAll(".venue-section .venue-content .card");

	events.forEach(event => {
		const pTag = event.querySelectorAll(".event-name p");

		pTag[pTag.length - 2].classList.add("fw-bold");
	})
} else if (siteName === "theweddingofmichaelclairine.menujuakad.com") {
	const wishesForm = document.querySelector(".wishes-section form");

	if (wishesForm) {
		const name = wishesForm.querySelector("input[name='name']");
		if (name) name.setAttribute("placeholder", "Name (Nama)");

		const wish = wishesForm.querySelector("textarea");
		if (wish) wish.setAttribute("placeholder", "Write your wishes (Tulis ucapan disini)");
	}
} else if (siteName === "mikhalisaforever.menujuakad.com") {
	document.addEventListener('DOMContentLoaded', function() {
		const form = document.querySelector('#cardRSVP form');
		if (form) {
			const select = form.querySelector('select[name="status"]');
			if (select) {
				const options = select.querySelectorAll('option');
				options.forEach(option => {
					if (option.value === '1') {
						option.textContent = 'Attending';
					} else if (option.value === '0') {
						option.textContent = 'Not Attending';
					}
				});
			}
		}
	});
} else if (siteName === "rupanabirthday.menujuakad.com") {
	
	const wishesForm = document.querySelector(".wishes-section form");
	if (wishesForm) {
		const wish = wishesForm.querySelector("textarea");
		if (wish) wish.setAttribute("placeholder", "Doa dan harapan untuk Iting");
	}

	document.addEventListener('DOMContentLoaded', function() {
		// Target the specific paragraph structure
		const eventNameDiv = document.querySelector('.event-name');
		if (eventNameDiv) {
			const paragraphs = eventNameDiv.querySelectorAll('p');
			
			// The time should be the last paragraph in .event-name
			const timeParagraph = paragraphs[paragraphs.length - 1];
			
			if (timeParagraph) {
				console.log('Time paragraph found:', timeParagraph.innerHTML);
				timeParagraph.innerHTML = '15:30 WIB - Selesai';
			}
		}
	});
			
}