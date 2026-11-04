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

	const coverEl = document.querySelector(".cover-section")

	gsap.to(coverEl, 1.5, { display: 'none', scale: 1.5, opacity: 0 })

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

// Get all elements with class toggleButton
const toggleButtons = document.querySelectorAll('.toggleButton');

// Loop through each button and add a click event listener
toggleButtons.forEach(button => {
	button.addEventListener('click', function () {
		// Find the corresponding hiddenElement for this button
		const hiddenElement = this.parentNode.nextElementSibling;

		// Toggle the display of the hiddenElement
		if (hiddenElement.style.display === 'none' || hiddenElement.style.display === '') {
			hiddenElement.style.display = 'block';
		} else {
			hiddenElement.style.display = 'none';
		}
	});
});

const rsvpInputForm = document.querySelector("#cardRSVP form");
if (rsvpInputForm) {
	const radios = rsvpInputForm.querySelectorAll(".form-checks input[name='status']");
	radios.forEach(radio=>{
		radio.setAttribute("required", true);
		radio.addEventListener("change",()=>{
			radio.classList.remove('is-invalid');
		})
	})

	rsvpInputForm.addEventListener('submit', (e)=>{
		const anyChecked = Array.from(radios).some(r => r.checked);
	
		if (!anyChecked) {
			radios[0].classList.add('is-invalid');
			e.preventDefault();
			e.stopPropagation();
		} else {
			radios.forEach(r => r.classList.remove('is-invalid'));
		}

		setTimeout(()=>{
			const errorMessage = rsvpInputForm.querySelector(".form-checks label#status-error");
			const attendWrap = rsvpInputForm.querySelector(".input-group.attend");
	
			if(errorMessage) attendWrap.appendChild(errorMessage);
		}, 500)
	})

}

// Reusable functions
function convertDateFormat(dateElement) {
    const [day, month, year] = dateElement.textContent.split('.');
    const fullYear = `20${year}`;
    
    const dayNum = parseInt(day);
    const suffix = dayNum === 1 ? 'st' : dayNum === 2 ? 'nd' : dayNum === 3 ? 'rd' : 'th';
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[parseInt(month) - 1];
    
    dateElement.innerHTML = `${monthName}, ${dayNum}<sup>${suffix}</sup> ${fullYear}`;
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

function applyDateTimeFormatting() {
    // Find ALL date elements and convert each one
    const dateElements = document.querySelectorAll('.event-date .date');
    dateElements.forEach(dateElement => {
        convertDateFormat(dateElement);
    });

    // Find ALL time elements and convert each one
    const timeElements = document.querySelectorAll('.event-name-body .time');
    timeElements.forEach(timeElement => {
        convertTimeFormat(timeElement);
    });
}

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "fendiwidyaweddingday.menujuakad.com") {
	const coverSection = document.querySelector('.cover-section');
	const greetingEl = coverSection.querySelector(".greeting-wrapper");
	if (greetingEl) {
		const coverDesc = coverSection.querySelector(".cover-description");

		coverDesc.insertBefore(greetingEl, coverDesc.firstChild);
	}
} else if (siteName === "kerrysherly.menujuakad.com") {
	const inputName = document.querySelectorAll("input[name='name']");

	inputName.forEach(input=>{
		input.setAttribute("placeholder", "Full Name");
	})
	
	const rsvpFormEl = document.querySelector(".rsvp-section form");
	
	if(rsvpFormEl) {
		const newDiv = document.createElement("div");
		newDiv.classList.add('input-group', 'mb-3');
		newDiv.innerHTML = '<span class="input-group-text" id="basic-addon1"><svg class="icon" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.4843 12C15.5206 12 14.5887 11.5697 13.8593 10.7887C13.1501 10.027 12.717 9.01125 12.6406 7.92937C12.559 6.77531 12.911 5.71406 13.6315 4.94062C14.352 4.16719 15.3593 3.75 16.4843 3.75C17.6014 3.75 18.6115 4.17469 19.3296 4.94625C20.0548 5.72531 20.4078 6.78469 20.3262 7.92891C20.2479 9.01219 19.8153 10.0275 19.1074 10.7883C18.3799 11.5697 17.4485 12 16.4843 12ZM22.6639 20.25H10.3053C10.1066 20.2511 9.91027 20.2065 9.73149 20.1198C9.5527 20.0331 9.3962 19.9065 9.27401 19.7498C9.1444 19.58 9.0549 19.383 9.0122 19.1736C8.9695 18.9643 8.97471 18.748 9.02745 18.5409C9.42213 16.9561 10.3999 15.6417 11.8549 14.7403C13.1464 13.9406 14.7903 13.5 16.4843 13.5C18.2117 13.5 19.8124 13.9219 21.1114 14.7211C22.5696 15.6178 23.5489 16.9397 23.9417 18.5437C23.9938 18.751 23.9984 18.9672 23.9552 19.1765C23.912 19.3857 23.8222 19.5825 23.6923 19.7522C23.5702 19.9082 23.4141 20.0341 23.2358 20.1204C23.0576 20.2067 22.8619 20.251 22.6639 20.25ZM7.62495 12.1875C5.97542 12.1875 4.5251 10.6537 4.39057 8.76891C4.32401 7.80328 4.62495 6.91031 5.23432 6.25547C5.83713 5.60719 6.68745 5.25 7.62495 5.25C8.56245 5.25 9.4062 5.60906 10.0123 6.26109C10.6264 6.92109 10.9264 7.81219 10.856 8.76984C10.7215 10.6542 9.27167 12.1875 7.62495 12.1875ZM10.7028 13.6617C9.87823 13.2586 8.80807 13.057 7.62542 13.057C6.24448 13.057 4.90338 13.417 3.8487 14.0705C2.65292 14.8125 1.84854 15.893 1.5237 17.1975C1.47616 17.3851 1.47166 17.5811 1.51054 17.7707C1.54943 17.9603 1.63068 18.1387 1.74823 18.2925C1.85977 18.4357 2.00266 18.5514 2.16592 18.6307C2.32917 18.71 2.50845 18.7508 2.68995 18.75H7.89307C7.98089 18.75 8.06592 18.7192 8.13334 18.6629C8.20075 18.6066 8.24628 18.5284 8.26198 18.442C8.26713 18.4125 8.2737 18.383 8.2812 18.3539C8.6787 16.7573 9.6101 15.4083 10.9864 14.4248C11.037 14.3884 11.0777 14.3398 11.1048 14.2836C11.1319 14.2274 11.1446 14.1653 11.1417 14.103C11.1387 14.0407 11.1203 13.9801 11.088 13.9267C11.0557 13.8733 11.0106 13.8288 10.9568 13.7972C10.8832 13.7541 10.7989 13.7086 10.7028 13.6617Z" fill="#D7E2E8"></path></svg></span>';

		// new select
		const select = document.createElement("select");
		select.name = "address";
		select.classList.add("form-select");
	
		const options = ["Chef’s Choice (Beef)", "No Beef", "Vegetarian"];
	
		const optionDisable = document.createElement("option");
		optionDisable.disabled = true;
		optionDisable.selected = true;
		optionDisable.textContent = "Please select one meal option:";

		select.appendChild(optionDisable);
	
		options.forEach((text) => {
		  const option = document.createElement("option");
		  option.value = text;
		  option.textContent = text;
		  select.appendChild(option);
		});

		newDiv.appendChild(select);

		rsvpFormEl.insertBefore(newDiv, rsvpFormEl.querySelector(".input-group.attend"));
	}
} else if (siteName === "stacyjustin.menujuakad.com") {
	 applyDateTimeFormatting();
}
document.getElementById('formGift').action = `#;