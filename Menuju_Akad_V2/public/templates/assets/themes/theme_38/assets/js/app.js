gsap.registerPlugin(ScrollTrigger, Flip)

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

window.scrollTo(0, 0);

$("body").css("overflow-y", "hidden");

$("#btn-envelope").on("click", function () {
	$("body").css("overflow-y", "auto");

	$(".logo-viding").addClass("custom-position");

	$(".cover-section").addClass("cover-opened")

	runAnimationOrnament();
	bgMusicPlay()
	forcePlayVideo();

	setTimeout(() => {
		$(".cover-section").hide()
	}, 1200)
});

var previousScroll = 70;
$(window).scroll(function (e) {
	// add/remove class to navbar when scrolling to hide/show
	var scroll = $(window).scrollTop();
	if (scroll >= previousScroll) {
		$("nav").addClass("navbar-hide");
		$("nav").removeClass("scrolled");
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

const cd = document.querySelector(".countdown").getAttribute("date");

Countdown(cd);


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
		gallery: {
			enabled: true,
		},
		zoom: {
			enabled: true,
			easing: "ease-in-out",
		},
	});
}


const formValidation = () => {
	const form = document.querySelectorAll("form");
	const mailPattern = /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

	form.forEach((f) => {
		const input = f.querySelectorAll("input");

		input.forEach((inp) => {
			inp.addEventListener("change", () => {
				switch (inp.type) {
					case "email":
						if (inp.value.match(mailPattern)) {
							f.querySelector("button").disabled = false;
							inp.classList.remove("is-invalid");
						} else {
							f.querySelector("button").disabled = true;
							inp.classList.add("is-invalid");
						}
						break;

					case "number":
						if (isNaN(inp.value)) {
							f.querySelector("button").disabled = true;
							inp.classList.add("is-invalid");
							console.log("in-valid", inp.value)
						} else {
							f.querySelector("button").disabled = false;
							inp.classList.remove("is-invalid");
							console.log("valid", inp.value)
						}
						break

					default:
						break;
				}
			})
		});
	});
};

formValidation();

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "indira-wardana.menujuakad.com") {
	const venueSection = document.querySelector('.venue-section');
	const cards = venueSection.querySelectorAll('.card');
	cards.forEach(el => {
		const eventName = el.querySelector('.event-name h4')?.textContent;
		if (eventName === "Akad nikah") {
			const eventPlaceEl = el.querySelector('.event-place');
			eventPlaceEl.classList.add('d-none');
		} else if (eventName === "Resepsi") {
			el.querySelector('.ribbon-venue').classList.add('d-none');
		}
	})
} else if (siteName === "jevon-jocelyn.menujuakad.com") {
	const streamParent = document.querySelector(".stream-section");
	streamParent.querySelector('.container').classList.add('container-custom');
} else if (siteName === "openhousenovoteltangerangxfinestpaketan.menujuakad.com") {
	const parent = document.querySelector('.venue-section .venue-wrapper .venue-content');
	const events = parent.querySelectorAll('.col-md-6.col-lg-12.position-relative');

	for (let index = 0; index < events.length; index++) {
		if (index !== 0) {
			events[index].remove();
		}
	}
}else if(siteName === "rumahnyacozy.menujuakad.com"){
	const venueSection = document.querySelector('.venue-section');
	const cards = venueSection.querySelectorAll('.card');
	cards.forEach(el => {
		const eventName = el.querySelector('.event-name h4')?.textContent;
		if (eventName === "Wedding Reception") {
			const pTag = el.querySelectorAll('.event-name .date p');
			pTag[pTag.length - 1].textContent = "11am - 2pm"
		}
	})
}else if(siteName === "vinvan.menujuakad.com"){
	const galleryParent = document.querySelector(".gallery-section .row#gallery-1");
	const galleries = galleryParent.querySelectorAll(".col-6.col-md-4.col-lg-4.p-2");

	galleries.forEach(el=>{
		el.classList.remove("col-md-4", "col-lg-4");
	})
}else if(siteName === "salsasurya.menujuakad.com"){
	const formWishes = document.querySelector(".wishes-section form");
	const textarea = formWishes.querySelector("textarea");
	textarea.setAttribute("placeholder", "Ucapan");
}else if(siteName === "mumtazpangeran.menujuakad.com"){
	const venueSection = document.querySelector('.venue-section');
	const cards = venueSection.querySelectorAll('.card');
	cards.forEach(el => {
		const eventName = el.querySelector('.event-name h4')?.textContent;
        const pTag = el.querySelectorAll('.event-name .date p');
        const teks = pTag[pTag.length - 1].textContent;
        const teksBaru = teks.split(" ");

		if(teksBaru[teksBaru.length - 1] === "End"){
			pTag[pTag.length - 1].textContent = `${teksBaru[0]}`;
		}

        const date = el.querySelector(".event-name .date > span");
        const dateContent = date.textContent.split(" ");
        const firtsIndex = dateContent.shift();

        dateContent.push(firtsIndex);

        date.innerHTML = `${dateContent[0]} ${dateContent[1]}, <br> ${dateContent[2].replace(',','')}`;
	})
}

function forcePlayVideo() {
	const video = document.querySelector(".fixed-background .background-element #background-video");
	if (video) {
		video.play().catch(err => {
			console.log(`Failed play video: ${err}`);
		})
	}
}