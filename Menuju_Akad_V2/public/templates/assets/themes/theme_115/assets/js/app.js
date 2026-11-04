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

if (document.querySelector(".zoom-gallery-default")) {
	$(".zoom-gallery-default").magnificPopup({
		delegate: "a",
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

const gallery = document.querySelector(".gallery-default");
if (gallery) {
	const gridLg = [3, 4, 11, 12];
	const gridSm = [2, 3, 8, 9];

	const mqm = window.matchMedia("screen and (max-width: 767px)");
	const mqt = window.matchMedia("screen and (min-width:768px) and (max-width: 991px)");
	const mqd = window.matchMedia("(min-width: 992px)");

	const galleryItems = gallery.querySelectorAll("a");

	const switchGridMobile = (mqh) => {
		let grid = gallery.querySelectorAll(".grid-lg-default");
		if (grid && mqh.matches) {
			grid.forEach((el, index) => {
				el.classList.remove("grid-lg-default");
				el.style.height = ``;
				console.log("remove class")
			});
		}
		galleryItems.forEach((el, index) => {
			if (mqh.matches) {
				if (gridSm.includes(index)) {
					el.classList.add("grid-lg-default");
					el.style.height = `${galleryItems[1].clientHeight}px`;
					console.log("mobile")
				}
			}
		});

		ScrollTrigger.create({
			trigger: ".gallery-section",
			start: "top bottom",
			onToggle: self => {
				if (self.isActive) {
					galleryItems.forEach((el, index) => {
						if (mqh.matches) {
							if (gridSm.includes(index)) {
								el.style.height = `${galleryItems[1].querySelector(".photo").clientHeight}px`;
							}
						}
					});
				}
			}
		})
	};
	const switchGridTablet = (mqt) => {
		let grid = gallery.querySelectorAll(".grid-lg-default");
		if (grid && mqt.matches) {
			grid.forEach((el, index) => {
				el.classList.remove("grid-lg-default");
				el.style.height = "";
				console.log("remove class")
			});
		}

		galleryItems.forEach((el, index) => {
			if (mqt.matches) {
				if (gridLg.includes(index)) {
					el.classList.add("grid-lg-default");
					el.style.height = `${galleryItems[1].clientHeight}px`;
					console.log("tablet")
				}
			}
		});

		ScrollTrigger.create({
			trigger: ".gallery-section",
			start: "top bottom",
			onToggle: self => {
				if (self.isActive) {
					galleryItems.forEach((el, index) => {
						if (mqh.matches) {
							if (gridSm.includes(index)) {
								el.style.height = `${galleryItems[1].querySelector(".photo").clientHeight}px`;
							}
						}
					});
				}
			}
		})
	};
	const switchGridDesktop = (mqt) => {
		let grid = gallery.querySelectorAll(".grid-lg-default");
		if (grid && mqt.matches) {
			grid.forEach((el, index) => {
				el.classList.remove("grid-lg-default");
				el.style.height = "";
				console.log("remove class")
			});
		}

		galleryItems.forEach((el, index) => {
			if (mqt.matches) {
				if (gridLg.includes(index)) {
					el.classList.add("grid-lg-default");
					el.style.height = `${galleryItems[1].clientHeight}px`;
					console.log("desktop")
				}
			}
		});

		ScrollTrigger.create({
			trigger: ".gallery-section",
			start: "top bottom",
			onToggle: self => {
				if (self.isActive) {
					galleryItems.forEach((el, index) => {
						if (mqh.matches) {
							if (gridSm.includes(index)) {
								el.style.height = `${galleryItems[1].querySelector(".photo").clientHeight}px`;
							}
						}
					});
				}
			}
		})
	};

	switchGridMobile(mqm);
	switchGridTablet(mqt);
	switchGridDesktop(mqd)

	mqm.addEventListener("change", switchGridMobile);
	mqt.addEventListener("change", switchGridTablet)
	mqd.addEventListener("change", switchGridDesktop)
}