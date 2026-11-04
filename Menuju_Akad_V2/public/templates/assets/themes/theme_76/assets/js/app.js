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

$("body").css("overflow", "hidden");

$("#btn-cover").on("click", function () {
	$("body").css("overflow", "auto");

	$(".logo-viding").addClass("custom-position");

	$(".cover-section").css("transform", "translateY(-110%)")

	runAnimationOrnament();
	bgMusicPlay();
});

const getPercentage = (num = 0, max = 0) => {
	return (num / max) * 100;
};

const mW = window.matchMedia("(min-width: 992px)");

const setSizeLayout = (mww) => {
	if (mww.matches) {
		const widthRatio = 10;
		const heightRatio = 16;

		const widthScreen = screen.width;
		const heightScreen = screen.height;

		const aspectRatio = widthRatio / heightRatio;

		const widthResult = parseFloat((heightScreen * aspectRatio).toFixed(2));

		const widthLayout = getPercentage(widthResult, widthScreen).toFixed(2);
		const widthBg = 100 - widthLayout;

		const layoutView = document.querySelector(".layout__views");
		const bgView = document.querySelector(".background__views");

		layoutView.style.width = `${widthLayout}%`;

		bgView.style.width = `${widthBg}%`;

		// Image Transition
		let isActive = "cover";
		const bgSection = document.querySelector(".background__views .background__frames");

		const cover = document.querySelector(".cover-section");
		// let imgURL = cover.querySelector(".image-wrapper img").src ? cover.querySelector(".image-wrapper img").src : cover.querySelector(".image-wrapper img").dataset.src;

		gsap.to(bgSection.querySelector(".background__image"), {
			position: "absolute",
			inset: 0,
			// backgroundImage: `url(${imgURL})`,
			backgroundPosition: "center center",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			opacity: 1,
			onComplete: () => (isActive = "cover"),
		});

		ScrollTrigger.refresh();
	} else {
		const layoutView = document.querySelector(".layout__views");
		layoutView.style.width = `100%`;
	}
};

setSizeLayout(mW);

mW.addEventListener("change", setSizeLayout);

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

const cd_element = document.querySelector(".countdown");

if (cd_element) {
	const cd = cd_element.getAttribute("date");
	Countdown(cd);
}

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

				ScrollTrigger.refresh();
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
			start: "top bottom",
			onToggle: self => {
				if (!self.isActive) return null;
				if (da.dataset.loadAnimation) return self.kill();

				if (da.dataset.animDelay) {
					setTimeout(() => {
						da.classList.add("has-animate")
						da.classList.remove("animation-invisible")
						da.dataset.loadAnimation = true;
						self.kill()
					}, da.dataset.animDelay)
				} else {
					da.classList.add("has-animate")
					da.classList.remove("animation-invisible")
					da.dataset.loadAnimation = true;
					self.kill()
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
					vs.classList.add("has-animate")
					vs.classList.remove("animation-invisible")
					vs.dataset.loadAnimation = true;
				} else {
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
window.onload = function(){
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

const siteName = document.querySelector('meta[property="og:site_name"]')?.content;

if (siteName === "benicorona.menujuakad.com") {
	const coverDate = document.querySelector(".cover-section .cover-description .cover-date");
	if (coverDate) {
		const text = coverDate.textContent;

		const formatted = text.replace("th", "<sub>th</sub>");
		coverDate.innerHTML = formatted;
	}

	const events = document.querySelectorAll(".venue-section .card");

	events.forEach(event => {
		const eventDay = event.querySelector(".event-name .event-day");

		const formatted = eventDay.textContent.replace("th", "<sub>th</sub>");
		eventDay.innerHTML = formatted;
	})

	const eventPlaces = document.querySelectorAll('.event-place h4');
	eventPlaces.forEach(place => {
		const formatted = place.textContent.replace(/(\d+)(st|nd|rd|th)/, '$1<sub>$2</sub>');
		place.innerHTML = formatted;
	});
} else if (siteName === "hansbeatrice.menujuakad.com") {

	// Get the elements
	const firstDiv = document.querySelector('.cover-description > div:first-child');
	const secondDiv = document.querySelector('.cover-description > div:nth-child(2)');

	// Move first div after second div
	secondDiv.insertAdjacentElement('afterend', firstDiv);

} else if (siteName === "delvintorpriscilla.menujuakad.com") {
	const coverImage = document.querySelector(".cover-section .image-wrapper").parentElement;
	if (coverImage) coverImage.remove();
}
