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
		setTimeout(() => resolve(el), 2500)
	})
}

document.body.style.overflow = "hidden";
document.body.style.overflowBlock = "hidden";

document.querySelector("#btn-envelope").addEventListener("click", () => {
	document.body.style.overflow = "auto";
	document.body.style.overflowBlock = "auto";

	document.querySelector(".cover-section").classList.add("cover-opened")

	runAnimationOrnament()
	bgMusicPlay()
	runAnimationLoop()
	waitCoverLoading(document.querySelector(".cover-section")).then((el) => {
		el.remove();
	})
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

const trees = document.querySelectorAll('img[alt="tree-2"]');
if (trees) {
	trees.forEach(el => {
		el.removeAttribute("data-anim");
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

function replaceEndWithFinish(timeElement) {
    const text = timeElement.textContent;
    timeElement.textContent = text.replace(/End/g, 'Finish');
}


const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === 'naufal-arumdriya.menujuakad.com') {
	const wishesParent = document.querySelector(".wishes-section");
	const textarea = wishesParent.querySelector(".textarea-wrapper textarea");

	textarea.setAttribute("placeholder", "Pesan dan Doa Bapak/Ibu")
} else if (siteName === 'ggwed.menujuakad.com') {
	const coupleParentDesc = document.querySelectorAll(".couple-section .couple .couple-description .couple-parent .couple-parent-description");
	coupleParentDesc.forEach(element=>{
		element.remove();
	})

	const urlMedia = "/templates/assets/media/488366da91832c073c7560f58064da1e.webp";

	const leafOrnEl = document.querySelectorAll("img[alt='leaf']");
	console.log(leafOrnEl)
	const leafUrl = new URL('/templates/assets/themes/theme_150/assets/images/leaf-custom-gg.png');
	leafOrnEl.forEach(element=>{
		element.setAttribute("src", urlMedia.concat("", leafUrl));
	})

	const flowerOrnEl = document.querySelectorAll("img[alt='flower']");
	const flowerUrl = new URL('/templates/assets/themes/theme_150/assets/images/flower-custom-gg.png');
	flowerOrnEl.forEach(element=>{
		element.setAttribute("src", urlMedia.concat("", flowerUrl));
	})

	const parrotOrnEl = document.querySelectorAll("img[alt='parrot']");
	const parrotUrl = new URL('/templates/assets/themes/theme_150/assets/images/parrot-custom-gg.png');
	parrotOrnEl.forEach(element=>{
		element.setAttribute("src", urlMedia.concat("", parrotUrl));
	})
	
	const tree1OrnEl = document.querySelectorAll("img[alt='tree-1']");
	const tree1Url = new URL('/templates/assets/themes/theme_150/assets/images/tree-1-custom-gg.png');
	tree1OrnEl.forEach(element=>{
		element.setAttribute("src", urlMedia.concat("", tree1Url));
	})

	const tree2OrnEl = document.querySelectorAll("img[alt='tree-2']");
	const tree2Url = new URL('/templates/assets/themes/theme_150/assets/images/tree-2-custom-gg.png');
	tree2OrnEl.forEach(element=>{
		element.setAttribute("src", urlMedia.concat("", tree2Url));
	})

	const tree4OrnEl = document.querySelectorAll("img[alt='tree-4']");
	const tree4Url = new URL('/templates/assets/themes/theme_150/assets/images/tree-4-custom-gg.png');
	tree4OrnEl.forEach(element=>{
		element.setAttribute("src", urlMedia.concat("", tree4Url));
	})
} else if (siteName === 'selebratingdaywithshal.menujuakad.com') {
	const couple = document.querySelectorAll(".couple-section .couple");

	couple.forEach(element => {
		const sosmedEl = element.querySelector("a.sosmed");
		const splitUrl = sosmedEl.href.split("/");

		const newSmallEl = document.createElement("small");
		newSmallEl.textContent = splitUrl[splitUrl.length - 1];

		sosmedEl.appendChild(newSmallEl);
	})
} else if (siteName === 'monicaaditya.menujuakad.com') {
	document.addEventListener('DOMContentLoaded', function() {
		const calendarLink = document.querySelector('a.btn-reminder');
		
		if (calendarLink) {
			// Update the href attribute
			const originalHref = calendarLink.getAttribute('href');
			const updatedHref = originalHref.replace('The+Wedding+of', 'The+Sangjit+of');
			calendarLink.setAttribute('href', updatedHref);
			
			// Also update the text content if it contains "The Wedding Of"
			const linkText = calendarLink.textContent.trim();
			if (linkText.includes('The Wedding Of') || linkText.includes('Wedding')) {
				calendarLink.textContent = linkText.replace(/The Wedding Of|Wedding/gi, 'The Sangjit Of');
			}
		}
	});
	
	 // Find ALL time elements and convert each one
    const timeElements = document.querySelectorAll('.event-name-body p');
    timeElements.forEach(timeElement => {
        convertTimeFormat(timeElement); // Your existing function
        // Additional cleanup
        let text = timeElement.textContent;
        text = text.replace(/End/g, 'Finish')
                   .replace(/WIB/g, '')
                   .replace(/\s+/g, ' ')
                   .trim();
        timeElement.textContent = text;
    });

} else if (siteName === 'hayyuyusuf.menujuakad.com') {
	
	/* function enhanceDateFormat() {
		const dateElements = document.querySelectorAll('.time-event p');
		console.log('Found date elements:', dateElements.length);
		
		dateElements.forEach((element, index) => {
			console.log(`Element ${index}:`, {
				innerHTML: element.innerHTML,
				textContent: element.textContent
			});
			
			const htmlContent = element.innerHTML.trim();
			console.log(`HTML content ${index}:`, htmlContent);
			
			const match = htmlContent.match(/(\w+)\s*<br>\s*(\d+)/);
			console.log(`Match ${index}:`, match);
			
			if (match) {
				const month = match[1];
				const year = match[2];
				const dayElement = element.closest('.date').querySelector('h5');
				const day = dayElement.textContent.trim();
				
				const formattedDate = `${day} ${month} ${year}`;
				element.innerHTML = formattedDate;
				console.log(`Formatted ${index}:`, formattedDate);
			}
		});
	}

	document.addEventListener('DOMContentLoaded', enhanceDateFormat);
	if (document.readyState !== 'loading') enhanceDateFormat(); */
	
}