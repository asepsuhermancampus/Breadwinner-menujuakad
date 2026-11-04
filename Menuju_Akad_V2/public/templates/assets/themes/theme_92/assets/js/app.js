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

if (siteName === "marvelouslifewitholin.menujuakad.com") {
	const rsvpSection = document.querySelector(".rsvp-section .rsvp-wrapper .rsvp-form");
	if (rsvpSection) {
		const inputCustom = rsvpSection.querySelector("input[name='email']");

		if (inputCustom) {
			const selectElement = document.createElement('select');
			selectElement.name = "address";
			selectElement.classList.add('form-select', 'mb-3');
			selectElement.dataset.anim = "zoom-in-up";
			selectElement.dataset.animDelay = "500";

			const option1 = document.createElement('option');
			option1.value = '';
			option1.textContent = 'Do you have any food allergies or dietary restrictions?';
			option1.disabled = true;
			option1.selected = true;
			selectElement.appendChild(option1);

			const option2 = document.createElement('option');
			option2.value = '1';
			option2.textContent = 'Yes';
			selectElement.appendChild(option2);

			const option3 = document.createElement('option');
			option3.value = '0';
			option3.textContent = 'No';
			selectElement.appendChild(option3);

			inputCustom.replaceWith(selectElement);
		}
	}
} else if(siteName === "michikostefanny.menujuakad.com"){
	const coupleCards = document.querySelectorAll(".couple-section .couple");

	coupleCards.forEach(cc=>{
		const coupleName = cc.querySelector("h3").textContent.trim();
		const titleSection = document.createElement("div");
		titleSection.classList.add("title-section");

		
		if(coupleName === "Michiko Pelano"){
			titleSection.innerHTML = `<h2>Groom</h2>`;
		}else{
			titleSection.innerHTML = `<h2>Bride</h2>`;
		}

		cc.insertBefore(titleSection, cc.querySelector(".image-wrap"));
	})
} else if(siteName === "dennyshierlyn.menujuakad.com"){
	
	// Fungsi untuk menerjemahkan teks
	function translateToIndonesian() {
		// Mencari elemen yang berisi "Holy Matrimony" dan menggantinya
		const elements = document.querySelectorAll('h4');
		
		elements.forEach(element => {
			if (element.textContent.trim() === 'Holy Matrimony') {
				element.textContent = 'Pemberkatan Nikah';
			}
		});
		
		// Tambahkan class notranslate ke elemen tanggal untuk mencegah terjemahan otomatis
		const dateElements = document.querySelectorAll('.date h5');
		dateElements.forEach(element => {
			element.classList.add('notranslate');
		});
	}

	// Fungsi untuk reset terjemahan
	function resetTranslation() {
		const elements = document.querySelectorAll('h4');
		
		elements.forEach(element => {
			if (element.textContent.trim() === 'Pemberkatan Nikah') {
				element.textContent = 'Holy Matrimony';
			}
		});
		
		// Hapus class notranslate saat reset
		const dateElements = document.querySelectorAll('.date h5');
		dateElements.forEach(element => {
			element.classList.remove('notranslate');
		});
	}

	// Event listener untuk tombol terjemahan
	document.addEventListener('DOMContentLoaded', function() {
		// Tambahkan notranslate ke elemen tanggal sejak awal
		const dateElements = document.querySelectorAll('.date h5');
		dateElements.forEach(element => {
			element.classList.add('notranslate');
		});
		
		// Tombol terjemahan Bahasa Indonesia
		const translateButtons = document.querySelectorAll('.translate-btn[data-lang="id"]');
		
		translateButtons.forEach(button => {
			button.addEventListener('click', function(e) {
				e.preventDefault();
				translateToIndonesian();
			});
		});
		
		// Tombol reset terjemahan
		const resetButtons = document.querySelectorAll('[data-lang="reset"], [onclick*="reset_translation"]');
		
		resetButtons.forEach(button => {
			button.addEventListener('click', function(e) {
				e.preventDefault();
				resetTranslation();
			});
		});
		
		const nameInput = document.querySelector('#guestbook_form input[name="name"]');
		if (nameInput) {
			nameInput.value = '';
			if (nameInput.hasAttribute('readonly')) {
				nameInput.removeAttribute('readonly');
			}
		}
	});

	// Jika ada fungsi reset_translation yang sudah ada, override dengan yang baru
	function reset_translation() {
		resetTranslation();
	}
	
	// Group sosmed-wrap with username
	document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
		const username = link.href.split('instagram.com/')[1];
		if (username) {
			// Find the parent sosmed-wrap div
			const sosmedWrap = link.closest('.sosmed-wrap');
			
			if (sosmedWrap) {
				// Create a new container div
				const newContainer = document.createElement('div');
				newContainer.className = 'sosmed-group';
				
				
				// Move the sosmed-wrap content to the new container
				while (sosmedWrap.firstChild) {
					newContainer.appendChild(sosmedWrap.firstChild);
				}
				
				// Create username div
				const usernameDiv = document.createElement('div');
				usernameDiv.className = 'instagram-username';
				usernameDiv.textContent = username;
				usernameDiv.style.fontSize = '0.9em';
				usernameDiv.style.fontWeight = '500';
				
				// Add username to the container
				newContainer.appendChild(usernameDiv);
				
				// Replace sosmed-wrap with the new container
				sosmedWrap.parentNode.replaceChild(newContainer, sosmedWrap);
			}
		}
	});
	
}