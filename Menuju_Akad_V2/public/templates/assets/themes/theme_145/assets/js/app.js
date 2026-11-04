gsap.registerPlugin(ScrollTrigger, Flip)

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

	bgMusicPlay()
	runAnimationOrnament()
	runAnimationLoop()
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

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "erickocindy.menujuakad.com") {
	const venueSection = document.querySelector('.venue-section');
	const eventName = venueSection.querySelector('.card .event-name h4')?.textContent;
	if (eventName === "Reception") {
		const pTag = venueSection.querySelectorAll('.card .event-name p');
		pTag[pTag.length - 1].textContent = "18:30 WIB - End";
	}
} else if (siteName === "stevenfelicia181025.menujuakad.com") {
	const coupleName = document.querySelectorAll(".couple-section .couple .couple-description h3");

	coupleName.forEach(name => {
		const fullname = name.textContent.trim();
		const regex = /^([A-Za-z\s]+),\s*(.*)$/;
		const result = fullname.match(regex);

		name.innerHTML = `${result[1]} <span class="degrees">${result[2]}</span>`;
	})

	const events = document.querySelectorAll(".venue-section .venue-wrapper .venue-content .card");

	events.forEach(event => {
		const pTag = event.querySelectorAll(".event-name p");
		const jamEl = pTag[pTag.length - 1];

		const result = jamEl.textContent.trim().replace(/\s*-\s*End/, "");
		jamEl.textContent = result;
	})
} else if (siteName === "sofia-aldi.menujuakad.com") {
	const venueSection = document.querySelector('.venue-section');

	if (venueSection) {
		const events = venueSection.querySelectorAll(".venue-content .card");

		events.forEach(event => {
			const eventName = event.querySelector('.event-name h4')?.textContent.trim();

			if (eventName === "Wedding Event") {
				const pTag = event.querySelectorAll(".event-name p");
				pTag[pTag.length - 1].remove();
			}
		})
	}
} else if (siteName === "yolariezky.menujuakad.com") {
	const coverDesc = document.querySelector(".cover-section .cover-description");
	const greeting = coverDesc.querySelector(".greeting-wrapper");

	if (greeting) {
		coverDesc.insertBefore(greeting, coverDesc.querySelector(".elements-widget"));
	}
} else if (siteName === "wiltonhannywedding.menujuakad.com") {
	const heading = document.querySelector('.event-place-body h4');
	const greetingWrapper = document.querySelector('.greeting-wrapper');
	const coverDesc = document.querySelector(".cover-section .cover-wrapper .cover-description");

	if (greetingWrapper) {
		coverDesc.insertBefore(greetingWrapper, coverDesc.querySelector(".elements-widget"));
	}
	if (heading) {
		heading.innerHTML = heading.innerHTML.replace('Ballroom 3, Sheraton Grand Jakarta Gandaria City Hotel',
			'Ballroom 3, <br/>Sheraton Grand Jakarta Gandaria City Hotel');
	}
} else if (siteName === "our-wedding-runguang-and-berenice.menujuakad.com") {
	document.addEventListener("DOMContentLoaded", function () {
		// Update the input field
		const emailInput = document.querySelector('input[name="email"]');
		if (emailInput) {
			emailInput.type = 'text';
			emailInput.name = 'address';
			// emailInput.placeholder = 'Dietary requirements'; // Optional: add placeholder
		}

		// Update the label
		const emailLabel = document.querySelector('label[for="email"]');
		if (emailLabel) {
			emailLabel.textContent = 'Any dietary restrictions?';
		}

		// Optional: Clear any existing value
		if (emailInput) {
			emailInput.value = '';
		}
	});
} else if (siteName === "thejoyofadel.menujuakad.com") {
	// Function to create map iframe
	function createMapIframe(srcUrl) {
		const iframe = document.createElement('iframe');
		iframe.style.border = '0';
		iframe.src = srcUrl;
		iframe.width = '100%';
		iframe.height = '100%';
		iframe.allowFullscreen = true;
		iframe.loading = 'lazy';
		iframe.referrerPolicy = 'no-referrer-when-downgrade';
		return iframe;
	}

	// Get the elements
	const mapEvent = document.querySelector('.map-event');
	const mapEventReception = document.querySelector('.map-event-reception');

	// Map URLs (replace reception URL with your actual one)
	const mapUrls = {
		ceremony: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15868.69895550811!2d106.83350900000003!3d-6.167996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f50035351b05%3A0x569244078fe933fa!2sKapel%20Katolik%20Biara%20St.%20Ursula!5e0!3m2!1sen!2sid!4v1761859465290!5m2!1sen!2sid',
		reception: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5150960042884!2d106.81938197499011!3d-6.195561693792126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f421963cd607%3A0xdea65bf3cb20aaec!2sSignatures%20Restaurant!5e0!3m2!1sen!2sid!4v1761837806054!5m2!1sen!2sid' // Replace this
	};

	// Add maps to their containers
	if (mapEvent) {
		mapEvent.appendChild(createMapIframe(mapUrls.ceremony));
	}

	if (mapEventReception) {
		mapEventReception.appendChild(createMapIframe(mapUrls.reception));
	}
} else if (siteName === "seharidanselamanya.menujuakad.com") {
	const coverDesc = document.querySelector(".cover-section .cover-description");
	const greeting = coverDesc.querySelector(".greeting-wrapper");
	if (greeting) {
		coverDesc.insertBefore(greeting, coverDesc.querySelector(".elements-widget"));
	}
}