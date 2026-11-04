gsap.registerPlugin(ScrollTrigger, Flip)

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

$("body").css("overflow-y", "hidden");

document.addEventListener("click", e => {
	if (e.target.closest("#btn-envelope")) {
		$("body").css("overflow-y", "auto");

		$(".logo-viding").addClass("custom-position");

		$(".cover-section").addClass("cover-opened")

		runAnimationOrnament();
		runAnimationLoop();
		bgMusicPlay();

		const coverTime = setTimeout(() => {
			$(".cover-section").hide()
			clearTimeout(coverTime)
		}, 1200)
	}
})

let previousScroll = 70;
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

const cd = document.querySelector(".countdown");

if (cd) Countdown(cd.getAttribute("date"));

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
window.onload = function () {
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
		gallery: {
			enabled: true,
		},
		zoom: {
			enabled: true,
			easing: "ease-in-out",
		},
	});
}

if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			console.log("Latitude:", position.coords.latitude);
			console.log("Longitude:", position.coords.longitude);
		},
		(error) => {
			console.error("Error getting location:", error.message);
		}
	);
} else {
	console.log("Geolocation not supported by this browser.");
}

const btnOpenAngpao = document.querySelector(".egift-section .gift-wrap .angpao button#openAngpao");
if (btnOpenAngpao) btnOpenAngpao.classList.remove("w-50");

const couples = document.querySelectorAll(".couple-section .couple .couple-description");
console.log(couples)
couples.forEach(couple => {
	couple.querySelector("h3")?.removeAttribute("data-anim");
})

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "nadira-vito.menujuakad.com") {
	const mainParent = document.querySelector(".header-section");
	const reminderParent = document.querySelector(".couple-section .reminder-wrap");
	const storyParent = document.querySelector(".story-section");
	const rsvpParent = document.querySelector(".rsvp-section");

	if (mainParent) {
		const cat1 = document.createElement('div');
		cat1.classList.add('cat-1')
		cat1.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-black.png" alt="cat-black" class="img-fluid"></div>`
		const cat2 = document.createElement('div');
		cat2.classList.add('cat-2')
		cat2.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-white.png" alt="cat-white" class="img-fluid"></div>`
		const cat3 = document.createElement('div');
		cat3.classList.add('cat-3')
		cat3.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-oren.png" alt="cat-oren" class="img-fluid"></div>`

		const orn2 = mainParent.querySelector(".orn-2");
		const orn3 = mainParent.querySelector(".orn-3");
		const orn7 = mainParent.querySelector(".orn-7");

		orn2.insertBefore(cat1, orn2.firstChild);
		orn3.insertBefore(cat2, orn3.firstChild);
		orn7.insertBefore(cat3, orn7.firstChild);
	}
	if (reminderParent) {
		const cat2 = document.createElement('div');
		cat2.classList.add('cat-2')
		cat2.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-black.png" alt="cat-black" class="img-fluid"></div>`
		const cat1 = document.createElement('div');
		cat1.classList.add('cat-1')
		cat1.innerHTML = `<div class="cat-2"><div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-black.png" alt="cat-black" class="img-fluid"></div></div><div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-white.png" alt="cat-white" class="img-fluid"></div>`
		const cat3 = document.createElement('div');
		cat3.classList.add('cat-3')
		cat3.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-oren.png" alt="cat-oren" class="img-fluid"></div>`

		const ornaments = reminderParent.querySelector(".ornaments-wrapper");
		ornaments.append(cat1, cat3);
	}
	if (storyParent) {
		const cat1 = document.createElement('div');
		cat1.classList.add('cat-1')
		cat1.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-black.png" alt="cat-black" class="img-fluid"></div>`
		const cat2 = document.createElement('div');
		cat2.classList.add('cat-2')
		cat2.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-white.png" alt="cat-white" class="img-fluid"></div>`
		const cat3 = document.createElement('div');
		cat3.classList.add('cat-3')
		cat3.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-oren.png" alt="cat-oren" class="img-fluid"></div>`

		const orn2 = storyParent.querySelector(".orn-2");
		const orn3 = storyParent.querySelector(".orn-3");
		const orn7 = storyParent.querySelector(".orn-7");

		orn2.insertBefore(cat1, orn2.firstChild);
		orn3.insertBefore(cat2, orn3.firstChild);
		orn7.insertBefore(cat3, orn7.firstChild);
	}
	if (rsvpParent) {
		const cat1 = document.createElement('div');
		cat1.classList.add('cat-1')
		cat1.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-black.png" alt="cat-black" class="img-fluid"></div>`
		const cat2 = document.createElement('div');
		cat2.classList.add('cat-2')
		cat2.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-white.png" alt="cat-white" class="img-fluid"></div>`
		const cat3 = document.createElement('div');
		cat3.classList.add('cat-3')
		cat3.innerHTML = `<div class="image-element"><img src="/templates/assets/themes/theme_167/assets/images/cat-oren.png" alt="cat-oren" class="img-fluid"></div>`

		const orn2 = rsvpParent.querySelector(".orn-2");
		const orn5 = rsvpParent.querySelector(".orn-5");
		const orn5Img = rsvpParent.querySelector(".orn-5 > .image-element");

		orn2.insertBefore(cat1, orn2.firstChild);
		orn5.appendChild(cat2);
		orn5.insertBefore(cat3, orn5Img);
	}
} else if (siteName === "fromztom.menujuakad.com") {
	const egiftSection = document.querySelector(".egift-section");
	if (egiftSection) {
		const angpaoTab = egiftSection.querySelector(".tab[data-tab='.angpao']");
		angpaoTab.innerHTML = `
		<div class="glider"></div>
		<svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31.668 8.75H8.33464C7.56244 8.75438 6.82311 9.06307 6.27708 9.60911C5.73104 10.1551 5.42234 10.8945 5.41797 11.6667V28.3333C5.42234 29.1055 5.73104 29.8449 6.27708 30.3909C6.82311 30.9369 7.56244 31.2456 8.33464 31.25H31.668C32.4402 31.2456 33.1795 30.9369 33.7255 30.3909C34.2716 29.8449 34.5803 29.1055 34.5846 28.3333V11.6667C34.5803 10.8945 34.2716 10.1551 33.7255 9.60911C33.1795 9.06307 32.4402 8.75438 31.668 8.75ZM32.0846 11.6667V14.45H31.7346C31.5354 14.4749 31.3339 14.4749 31.1346 14.45H30.918C30.7297 14.4122 30.5455 14.3564 30.368 14.2833H30.168C29.93 14.1681 29.7152 14.0099 29.5346 13.8167C29.2874 13.5726 29.0909 13.282 28.9564 12.9616C28.822 12.6412 28.7523 12.2974 28.7513 11.95C28.7518 11.7186 28.7854 11.4885 28.8513 11.2667H31.668C31.7756 11.2666 31.8792 11.3082 31.9569 11.3828C32.0345 11.4573 32.0803 11.5591 32.0846 11.6667ZM8.33464 11.25H11.1513C11.2172 11.4718 11.2509 11.7019 11.2513 11.9333C11.2503 12.2808 11.1806 12.6246 11.0462 12.9449C10.9117 13.2653 10.7152 13.5559 10.468 13.8C10.283 13.9882 10.0692 14.1458 9.83464 14.2667H9.61797C9.45479 14.3471 9.28073 14.4033 9.1013 14.4333H8.86797C8.66875 14.4583 8.46719 14.4583 8.26797 14.4333H7.91797V11.6667C7.91797 11.5562 7.96187 11.4502 8.04001 11.372C8.11815 11.2939 8.22413 11.25 8.33464 11.25ZM7.91797 28.3333V25.55H8.26797C8.46719 25.5251 8.66875 25.5251 8.86797 25.55H9.08464C9.27474 25.5801 9.45981 25.6362 9.63464 25.7167H9.83464C10.0692 25.8376 10.283 25.9951 10.468 26.1833C10.7152 26.4274 10.9117 26.718 11.0462 27.0384C11.1806 27.3588 11.2503 27.7026 11.2513 28.05C11.2509 28.2814 11.2172 28.5115 11.1513 28.7333H8.33464C8.22696 28.7334 8.12343 28.6918 8.04575 28.6172C7.96807 28.5427 7.92228 28.4409 7.91797 28.3333ZM13.7013 28.75C13.7184 28.5225 13.7184 28.2941 13.7013 28.0667C13.7076 27.3899 13.5763 26.719 13.3156 26.0944C13.0549 25.4699 12.6702 24.9048 12.1846 24.4333C11.9393 24.1849 11.6651 23.9667 11.368 23.7833L11.0846 23.6C10.89 23.4996 10.6896 23.4105 10.4846 23.3333L10.1513 23.2C9.86232 23.115 9.5669 23.0537 9.26797 23.0167C9.09617 22.9995 8.9231 22.9995 8.7513 23.0167H7.91797V17.0333H9.33464C9.56077 16.9948 9.78363 16.9391 10.0013 16.8667L10.368 16.75C10.6227 16.663 10.8683 16.5514 11.1013 16.4167L11.368 16.2667C11.679 16.0622 11.9693 15.8277 12.2346 15.5667C12.7202 15.0952 13.1049 14.5301 13.3656 13.9056C13.6263 13.281 13.7575 12.6101 13.7513 11.9333C13.7684 11.7059 13.7684 11.4775 13.7513 11.25H26.3513C26.3342 11.4775 26.3342 11.7059 26.3513 11.9333C26.3451 12.6101 26.4763 13.281 26.737 13.9056C26.9977 14.5301 27.3824 15.0952 27.868 15.5667C28.1289 15.8326 28.4197 16.0675 28.7346 16.2667L29.0013 16.4167C29.2343 16.5514 29.4799 16.663 29.7346 16.75L30.1013 16.8667C30.3249 16.9343 30.5533 16.9844 30.7846 17.0167H32.1846V22.95H31.3513C31.1795 22.9335 31.0065 22.9335 30.8346 22.95C30.5357 22.987 30.2403 23.0484 29.9513 23.1333L29.618 23.2667C29.3952 23.3528 29.1781 23.453 28.968 23.5667L28.6846 23.75C28.3875 23.9334 28.1133 24.1516 27.868 24.4C27.3824 24.8715 26.9977 25.4366 26.737 26.0611C26.4763 26.6856 26.3451 27.3566 26.3513 28.0333C26.3342 28.2608 26.3342 28.4892 26.3513 28.7167L13.7013 28.75ZM31.668 28.75H28.8513C28.7854 28.5282 28.7518 28.2981 28.7513 28.0667C28.7523 27.7192 28.822 27.3754 28.9564 27.0551C29.0909 26.7347 29.2874 26.4441 29.5346 26.2C29.7152 26.0068 29.93 25.8486 30.168 25.7333H30.368C30.5463 25.6626 30.7303 25.6068 30.918 25.5667H31.1346C31.3339 25.5417 31.5354 25.5417 31.7346 25.5667H32.0846V28.3333C32.0846 28.4438 32.0407 28.5498 31.9626 28.628C31.8845 28.7061 31.7785 28.75 31.668 28.75Z" fill="#353A40"></path><path d="M20.0013 14.167C18.8476 14.167 17.7198 14.5091 16.7605 15.1501C15.8012 15.7911 15.0535 16.7021 14.612 17.768C14.1705 18.8339 14.055 20.0068 14.2801 21.1384C14.5051 22.2699 15.0607 23.3093 15.8765 24.1251C16.6923 24.9409 17.7317 25.4965 18.8633 25.7216C19.9948 25.9467 21.1677 25.8311 22.2336 25.3896C23.2995 24.9481 24.2106 24.2004 24.8515 23.2412C25.4925 22.2819 25.8346 21.154 25.8346 20.0003C25.8346 18.4532 25.2201 16.9695 24.1261 15.8755C23.0321 14.7816 21.5484 14.167 20.0013 14.167ZM20.0013 23.3337C19.342 23.3337 18.6976 23.1382 18.1494 22.7719C17.6012 22.4056 17.174 21.885 16.9217 21.2759C16.6694 20.6668 16.6034 19.9966 16.732 19.35C16.8606 18.7034 17.1781 18.1095 17.6443 17.6433C18.1105 17.1771 18.7044 16.8597 19.351 16.731C19.9976 16.6024 20.6678 16.6684 21.2769 16.9207C21.886 17.173 22.4066 17.6003 22.7729 18.1484C23.1391 18.6966 23.3346 19.3411 23.3346 20.0003C23.3346 20.8844 22.9834 21.7322 22.3583 22.3573C21.7332 22.9825 20.8854 23.3337 20.0013 23.3337Z" fill="#353A40"></path></svg>
		`
	}
} else if (siteName === "fikaandfirman.menujuakad.com") {
	const venueSection = document.querySelector(".venue-section");
	// if(venueSection){
	// 	const events = venueSection.querySelectorAll(".venue-wrapper .venue-content .card");

	// 	events.forEach(event=>{
	// 		const eventName = event.querySelector(".event-name h4").textContent.trim();

	// 		if(eventName === 'Wedding Traditional Ceremony'){
	// 			const eventPlace = event.querySelector(".event-place");
	// 			eventPlace.remove();
	// 		}
	// 	})
	// }
} else if (siteName === "nabillahfarhan.menujuakad.com") {
	const venueSection = document.querySelector(".venue-section");
	if (venueSection) {
		const events = venueSection.querySelectorAll(".venue-wrapper .venue-content .card");

		events.forEach(event => {
			const pTag = event.querySelectorAll(".event-name p");
			pTag[pTag.length - 1].remove();
		})
	}
} else if (siteName === "intanadel.menujuakad.com") {
	const venueSection = document.querySelector(".venue-section");
	if (venueSection) {
		const events = venueSection.querySelectorAll(".venue-wrapper .venue-content .card");

		for (let index = 0; index < events.length; index++) {
			const modalEvent = document.querySelectorAll(".modal.modal-event .btn-custom");

			const newEl = document.createElement("a");
			newEl.classList.add("btn", "btn-custom", "color-secondary");
			newEl.textContent = "Lihat Maps";
			newEl.href = modalEvent[index];
			newEl.setAttribute("target", "_blank");
			newEl.setAttribute("rel", "noopener noreferrel");

			const button = events[index].querySelector(".event-place .btn-custom");
			button.replaceWith(newEl);

		}
	}
} else if (siteName === "shiella.menujuakad.com") {
	const venueSection = document.querySelector(".venue-section");
	if (venueSection) {
		const events = venueSection.querySelectorAll(".venue-wrapper .venue-content .card");

		events.forEach(event => {
			const eventName = event.querySelector(".event-name h4");
			if (eventName.textContent.trim() === "Akad & Wedding Reception") {
				const pTag = event.querySelectorAll(".event-name p");
				pTag[pTag.length - 1].remove();

				const splitEventName = eventName.textContent.trim().split("&");

				eventName.innerHTML = `${splitEventName[0].trim()} <br> & <br> ${splitEventName[1].trim()}`;
			}
		})
	}
} else if (siteName === "sailastforari.menujuakad.com") {
	const venueSection = document.querySelector(".venue-section");
	if (venueSection) {
		const events = venueSection.querySelectorAll(".venue-wrapper .venue-content .card");

		events.forEach(event => {
			const eventName = event.querySelector(".event-name h4");
			if (eventName.textContent.trim() === "Resepsi Pernikahan (Upacara Pedang Pora)") {
				const newText = eventName.textContent.trim().replace("(", "<br>(");

				eventName.innerHTML = newText;
			}
		})
	}
} else if (siteName === "ilmiridan.menujuakad.com") {
	const eventContainer = document.querySelector('.event-name-body');
	eventContainer.innerHTML = eventContainer.innerHTML.replace(/Minggu/g, 'Ahad');
} else if (siteName === "raniasam.menujuakad.com") {
	// Remove specific time paragraphs
	/*
	const timeParagraphs = document.querySelectorAll('p');
	timeParagraphs.forEach(p => {
		const text = p.textContent.trim();
		if (text === '13.30 - 15.30 WIB' || text === '19.00 - 21.00 WIB') {
			p.remove();
		}
	});
	*/
} else if (siteName === "aninditha-rinaldi.menujuakad.com") {
	const media = "/templates/assets/media/488366da91832c073c7560f58064da1e.webp";

	const saorajaAssets = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/saoraja.png"));
	const cobokLongAssets = media.concat(new URL("/templates/assets/themes/theme_155/assets/images/cobok-long.png"));

	const saoraja = document.createElement("div");
	saoraja.classList.add("rumah");
	saoraja.innerHTML = `<div class="image-element"><img src="${saorajaAssets}" alt="saoraja" class="img-fluid"></div>`;
	const cobok = document.createElement("div");
	cobok.classList.add("cobok");
	cobok.innerHTML = `<div class="image-element"><img src="${cobokLongAssets}" alt="cobok" class="img-fluid"></div>`;
	const cobok2 = document.createElement("div");
	cobok2.classList.add("cobok");
	cobok2.innerHTML = `<div class="image-element"><img src="${cobokLongAssets}" alt="cobok" class="img-fluid"></div><div class="image-element"><img src="${cobokLongAssets}" alt="cobok" class="img-fluid"></div>`;

	const headerOrn = document.querySelector(".header-section .ornaments-wrapper");
	if (headerOrn) headerOrn.insertBefore(cobok, headerOrn.querySelector(".orn-11"));

	const headerOrnFront = document.querySelector(".header-section .ornaments-wrapper.orn-front");
	if (headerOrnFront) headerOrnFront.insertBefore(saoraja, headerOrnFront.firstElementChild);

	const storyOrn = document.querySelector(".story-section .ornaments-wrapper");
	if (storyOrn) storyOrn.insertBefore(cobok2, storyOrn.firstElementChild);

	const events = document.querySelectorAll(".venue-section .venue-content .card");
	events.forEach(event => {
		const eventNameOrn = event.querySelector(".event-name .ornaments-wrapper");
		if (eventNameOrn) eventNameOrn.prepend(cobok.cloneNode(true), saoraja.cloneNode(true));
	})

	const thankOrn = document.querySelector(".thank-section .ornaments-wrapper");
	if (thankOrn) thankOrn.insertBefore(cobok.cloneNode(true), thankOrn.querySelector(".orn-11"));

	const thankOrnFront = document.querySelector(".thank-section .ornaments-wrapper.orn-front");
	if (thankOrnFront) thankOrnFront.insertBefore(saoraja.cloneNode(true), thankOrnFront.firstElementChild);
} else if (siteName === "pepidanzaidan.menujuakad.com") {
	const media = "/templates/assets/media/488366da91832c073c7560f58064da1e.webp";

	const pilar = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/pepidanzaidan/pilar.png"));
	const siger = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/pepidanzaidan/siger.png"));
	const pajajaran = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/pepidanzaidan/pajajaran.png"));
	const roof = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/pepidanzaidan/roof.png"));
	const motifRibbonVertical = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/pepidanzaidan/motif-ribbon-vertical.png"));
	const motifRibbon = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/pepidanzaidan/motif-ribbon.png"));
	const motifVertical = media.concat(new URL("/templates/assets/themes/theme_167/assets/images/pepidanzaidan/motif-vertical.png"));

	const frames = document.querySelectorAll("img[alt='frame']");
	frames.forEach(frame => {
		frame.src = pajajaran;
	})

	const gebyok = document.querySelectorAll("img[alt='gebyok-upper']");
	gebyok.forEach(element => {
		element.src = pilar;
	})

	const gunungan = document.querySelectorAll("img[alt='gunungan-gold'], img[alt='gunungan-dark']");
	gunungan.forEach(element => {
		element.src = siger;
	})

	const frame2 = document.querySelectorAll("img[alt='frame-2']");
	frame2.forEach(element => {
		element.src = roof;
	})

	const ribbonVertical = document.querySelectorAll("img[alt='mawar-blue']");
	ribbonVertical.forEach(element => {
		element.src = motifRibbonVertical;
	})

	const ribbons = document.querySelectorAll("img[alt='motif-ribbon']");
	ribbons.forEach(element => {
		element.src = motifRibbon;
	})
} else if (siteName === "annisaheza.menujuakad.com") {
	try {
		const events = document.querySelectorAll(".venue-section .venue-wrapper .venue-content .card");

		events.forEach(event => {
			const eventName = event.querySelector(".event-name h4").textContent.trim();

			if (eventName === "Akad") {
				event.querySelector(".event-place").remove();
			}
		})
	} catch (error) {
		console.error(error);
	}
} else if (siteName === "filzahdanilham.menujuakad.com") {
	const galleryLayouts = document.querySelectorAll(".gallery-section div#gallery-1 > .col-6");

	galleryLayouts.forEach(element => {
		element.classList.remove("p-2");
		element.classList.add("p-1");
	})

	const events = document.querySelectorAll(".venue-section .venue-wrapper .venue-content .card");
	events.forEach(event => {
		const eventName = event.querySelector(".event-name h4").textContent.trim();

		if (eventName === "Akad Nikah") {
			const newEl = document.createElement("div");
			newEl.classList.add("text-center", "fw-bold", "pt-3");
			newEl.innerHTML = `<p>(Khusus Keluarga)</p>`;

			event.querySelector(".event-name .event-name-body").appendChild(newEl);

			const pTag = event.querySelectorAll(".event-name .event-name-body > p");
			const jamEl = pTag[pTag.length - 1];

			window.onload = function () {
				const str = jamEl.textContent.trim();
				const wib = str.match(/WIB/)[0];
				if (wib) {
					const cleaned = str.replace(/\s*WIB/, "");
					const [time, rest] = cleaned.split("-");
					const result = `${time} ${wib} - ${rest}`;

					jamEl.textContent = result;
				}
			}
		}
	})

	const eventVenueWrapper = document.createElement("div");
	eventVenueWrapper.classList.add("col-md-6", "col-lg-12");
	eventVenueWrapper.innerHTML = `
	<div class="card">
                                                            <div class="ornaments-wrapper">
                                                                <div class="elements-wrapper-absolute">
                                                                    <div class="background-element">
                                                                        <img data-src="/templates/assets/media/f2cb48b239db33c6db6913813201d34e.webp" alt="bg-2" class=" ls-is-cached lazyloaded" src="/templates/assets/media/f2cb48b239db33c6db6913813201d34e.webp">
                                                                    </div>
                                                                </div>
                                                                <div class="orn-7">
                                                                    <div class="orn-8">
                                                                        <div class="image-element">
                                                                            <img src="/templates/assets/media/fd4f2577192750d4d07c4e11e2e6bee8.webp" alt="flower-4" class="img-fluid animate-loop has-animate" data-anim="lambai" data-load-animation="true">
                                                                        </div>
                                                                    </div>
                                                                    <div class="image-element">
                                                                        <img src="/templates/assets/media/a8662f655d73d08045de13e0bcd36ade.webp" alt="flower-2" class="img-fluid animate-loop has-animate animate-paused" data-anim="lambai" data-anim-duration="4500ms" style="animation-duration: 4500ms;" data-load-animation="true">
                                                                    </div>
                                                                </div>
                                                                <div class="orn-9">
                                                                    <div class="orn-10">
                                                                        <div class="image-element">
                                                                            <img src="/templates/assets/media/fd4f2577192750d4d07c4e11e2e6bee8.webp" alt="flower-4" class="img-fluid animate-loop has-animate" data-anim="lambai" data-load-animation="true">
                                                                        </div>
                                                                    </div>
                                                                    <div class="image-element">
                                                                        <img src="/templates/assets/media/a8662f655d73d08045de13e0bcd36ade.webp" alt="flower-2" class="img-fluid animate-loop has-animate animate-paused" data-anim="lambai" data-anim-duration="4800ms" style="animation-duration: 4800ms;" data-load-animation="true">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="card-body">
                                                                                                                                    <div class="event-name">
                                                                        <div class="frame frame-topCenter">
                                                                            <div class="image-element">
                                                                                <img src="/templates/assets/media/c761f681b0920efd304f4c5322131cdd.webp" alt="frame-2" class="img-fluid">
                                                                            </div>
                                                                        </div>
                                                                        <div class="ornaments-wrapper">
                                                                            <div class="orn-3">
                                                                                <div class="image-element">
                                                                                    <img src="/templates/assets/media/a8662f655d73d08045de13e0bcd36ade.webp" alt="flower-2" class="img-fluid animate-loop has-animate" data-anim="lambai" data-anim-duration="4600ms" style="animation-duration: 4600ms;" data-load-animation="true">
                                                                                </div>
                                                                                <div class="orn-5">
                                                                                    <div class="image-element">
                                                                                        <img src="/templates/assets/media/7df751265d0ecda04b6abde3bf83c8c8.webp" alt="flower-5" class="img-fluid animate-loop has-animate" data-anim="lambai" data-anim-duration="4200ms" style="animation-duration: 4200ms;" data-load-animation="true">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="orn-4">
                                                                                <div class="orn-6">
                                                                                    <div class="image-element">
                                                                                        <img src="/templates/assets/media/fd4f2577192750d4d07c4e11e2e6bee8.webp" alt="flower-4" class="img-fluid animate-loop has-animate" data-anim="lambai" data-load-animation="true">
                                                                                    </div>
                                                                                </div>
                                                                                <div class="image-element">
                                                                                    <img src="/templates/assets/media/a8662f655d73d08045de13e0bcd36ade.webp" alt="flower-2" class="img-fluid animate-loop has-animate" data-anim="lambai" data-load-animation="true">
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="event-name-body has-animate" data-anim="fade" data-load-animation="true">
                                                                            <h4 class="title-event-name" style="font-family: ; font-size: px;">Akad Nikah</h4>
                                                                            <span>Sabtu,</span>
                                                                            <div class="date">
                                                                                <h5>20</h5>
                                                                                <div class="line color__button__trans" style="--color-button-trans: #1e1f1e;"></div>
                                                                            </div>
                                                                            <span>Desember 2025</span>
                                                                            <p>11:00 WIB
                                                                                -
                                                                                Selesai</p>
                                                                        <div class="text-center fw-bold pt-3"><p>(Khusus Keluarga)</p></div></div>
                                                                    </div>
                                                                                                                                <div class="event-place">
                                                                    <div class="ornaments-wrapper">
                                                                        <div class="motif">
                                                                            <div class="image-element">
                                                                                <img src="/templates/assets/media/570ff3c7dad48518c88e541969747907.webp" alt="motif-ribbon" class="img-fluid">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="event-place-body has-animate" data-anim="fade-up" data-load-animation="true">
                                                                                                                                                <div class="ribbon-venue" data-animationloop="keyframe">
                                                                            <div data-anim="zoom-out" class="has-animate" data-load-animation="true">
                                                                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 560 560" style="enable-background:new 0 0 560 560;overflow: visible;" xml:space="preserve">
                                                                                    <g id="Layer_1">
                                                                                    </g>
                                                                                    <g id="Layer_3">
                                                                                        <g>
                                                                                            <g>
                                                                                                <path class="st0" d="M273.3,48.3c34.1,0,66.1,13.3,90.3,37.4c24.1,24.1,37.4,56.2,37.4,90.3c0,93.4-63.7,165.3-105.8,212.8c-4.4,4.9-8.5,9.6-12.3,14c-2.9,3.4-6.3,5.2-9.5,5.2c-4.1,0-7.4-2.8-9.4-5.2c-4.6-5.3-9.4-10.7-14.5-16.5c-20.4-23-43.5-49.1-63-80c-22.1-35-34.9-69.1-39.2-104.3c-4.8-39.7,6.8-79.6,31.9-109.4c22.5-26.7,53.5-42.4,87.3-44.2C268.7,48.4,271.1,48.3,273.3,48.3 M273.3,29.3c-2.6,0-5.2,0.1-7.8,0.2c-87.5,4.6-147.7,87.9-137.1,174.9c11.7,96.3,80.1,163.3,121.1,210.8c6.8,7.8,15.3,11.8,23.8,11.8c8.6,0,17.1-3.9,23.9-11.8C338.4,367.6,420,286.7,420,176C420,95,354.3,29.3,273.3,29.3L273.3,29.3z"></path>
                                                                                            </g>
                                                                                            <g>
                                                                                                <path class="st0" d="M275.1,118c30.6,0,55.5,24.9,55.5,55.5S305.7,229,275.1,229s-55.5-24.9-55.5-55.5S244.5,118,275.1,118 M275.1,99c-41.1,0-74.5,33.3-74.5,74.5S234,248,275.1,248s74.5-33.3,74.5-74.5S316.2,99,275.1,99L275.1,99z"></path>
                                                                                            </g>
                                                                                        </g>
                                                                                    </g>
                                                                                    <g id="Layer_2">
                                                                                        
                                                                                        <ellipse class="st1" cx="272.8" cy="437.9" rx="146.4" ry="40.9"></ellipse>
                                                                                        <ellipse class="st0 dot" cx="273.6" cy="437.9" rx="63.1" ry="17"></ellipse>
                                                                                    </g>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <h4 class="notranslate" style="font-family: ; font-size: px;">Thamrin Nine Ballroom</h4>
                                                                        <span class="notranslate"><p>Chubb Square, Thamrin Nine, Jl. MH Thamrin No.10 Lantai GF, RT.14/RW.20, Kb. Melati, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10230, Indonesia</p></span>
                                                                                                                                                    <div class="widget-elements">
                                                                                <a class="btn btn-custom color-secondary" aria-label="button maps" href="#" data-bs-toggle="modal" data-bs-target="#event76262">Lokasi</a>
                                                                            </div>
                                                            		</div>
                                                                </div>
                                                            </div>
                                                        </div>
	`;

	const url = new URL(window.location.href);

	const eventName = url.searchParams.get("event")?.trim();

	if (eventName && eventName !== "Akad Nikah") {
		const venueRow = document.querySelector(".venue-section .venue-content .row.row-venue");

		venueRow.insertBefore(eventVenueWrapper, venueRow.firstElementChild);

		document.body.insertAdjacentHTML("beforeend", `
			<div class="modal modal-event fade show-maps" id="event76262" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-lg">
					<div class="modal-content">
						<div class="modal-body text-center">
							<button type="button" class=" btn-modal" data-bs-dismiss="modal" aria-label="Close">
								<i class="fas fa-xmark"></i>
							</button>
							<div class="modal-actions">
								<h2 style="font-family: ; font-size: px;">Akad Nikah</h2>
							</div>
							<div class="col-12 mt-3">
								<div class="maps-element">
									<div class="loader-wrapper-modal">
										<div class="lds-default">
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
											<div></div>
										</div>
									</div>
									<iframe class="maps-embed" width="100%" height="328" id="gmap_canvas" data-src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=Thamrin%20Nine%20Ballroom&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
								</div>
								<a class="btn btn-custom color__button__trans color-secondary mt-3" href="https://www.google.com/maps/search/?api=1&amp;query=Thamrin%20Nine%20Ballroom" target="_blank">Lokasi</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			`);
	}
}

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