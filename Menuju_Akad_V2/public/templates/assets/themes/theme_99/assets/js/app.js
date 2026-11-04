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

document.body.style.overflow = "hidden";

document.querySelector(".cover-section #btn-envelope").addEventListener("click", () => {
	document.body.style.overflow = "auto"

	document.querySelector(".cover-section").classList.add("cover-opened")

	bgMusicPlay()
	runAnimationOrnament()
	runAnimationLoop()
})

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

const bgStory = document.querySelector(".story-section .elements-wrapper-absolute .background-element img");

if (bgStory) {
	bgStory.src = "/templates/assets/media/5fe7658464408a09b3598fb4d60929ca.webp";
	bgStory.style.mixBlendMode = "unset";
}

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if(siteName === "ericdovi.menujuakad.com") {
	const streamSection = document.querySelector(".stream-section");
	if (streamSection) {
		const ratio = streamSection.querySelector(".ratio");
		const iframe = ratio.querySelector("iframe");
	
		ratio.appendChild(iframe);
	}
} else if(siteName === "tsusan17.menujuakad.com") {
	document.getElementById('btn-envelope').innerHTML = '<strong>Buka Undangan / 招待状 <i class="fas fa-envelope-open-text"></i></strong>';
	document.addEventListener('DOMContentLoaded', function() {
		// Update forms by their IDs for more specific targeting
		updateFormById('tambahdata');
		updateFormById('guestbook_form');
	});

	function updateFormById(formId) {
		const form = document.getElementById(formId);
		if (!form) return;
		
		// Update placeholders within this specific form
		const inputs = form.querySelectorAll('input[placeholder], textarea[placeholder]');
		
		inputs.forEach(input => {
			const placeholder = input.placeholder.toLowerCase();
			
			if (placeholder.includes('nama') || placeholder === 'name') {
				input.placeholder = 'Nama / お名前';
			} else if (placeholder.includes('nomor handphone')) {
				input.placeholder = 'Nomor HP / 電話番号';
			} else if (placeholder.includes('jumlah tamu')) {
				input.placeholder = 'Jumlah Tamu / ご出席人数';
			} else if (placeholder.includes('tulis harapan')) {
				input.placeholder = 'Silakan tuliskan doa atau pesan untuk kami / お祝いの言葉や温かいメッセージをご記入ください。';
			}
		});
		
		// Update submit buttons in this form
		const submitBtn = form.querySelector('button[type="submit"]');
		if (submitBtn && (submitBtn.textContent.includes('Kirim') || submitBtn.textContent.includes('Send'))) {
			submitBtn.textContent = 'Kirim / 送信';
		}
		
		// Update status select if exists in this form
		const statusSelect = form.querySelector('select[name="status"]');
		if (statusSelect) {
			const options = statusSelect.querySelectorAll('option');
			options.forEach(option => {
				if (option.disabled && option.selected) {
					option.textContent = 'Pilihan Kehadiran / 出欠のご回答';
				} else if (option.value === '1') {
					option.textContent = 'Hadir / ご出席';
				} else if (option.value === '0') {
					option.textContent = 'Tidak hadir / ご欠席';
				}
			});
		}
		
		// Update jumlah tamu select if exists in this form
		const jumlahSelect = form.querySelector('select[name="jumlah"]');
		if (jumlahSelect) {
			const disabledOption = jumlahSelect.querySelector('option[disabled]');
			if (disabledOption && disabledOption.textContent.toLowerCase().includes('jumlah tamu')) {
				disabledOption.textContent = 'Jumlah Tamu / ご出席人数';
			}
		}
		
		// Lokasi button
		const lokasiButton = document.querySelector('.event-place .btn-custom[aria-label="button maps"]');
		if (lokasiButton && lokasiButton.textContent.includes('Lokasi')) {
			lokasiButton.innerHTML = 'Lokasi / 住所';
		}
		
		// Reminder button
		const saveDateButton = document.querySelector('.btn-reminder');
		if (saveDateButton && saveDateButton.textContent.includes('Simpan Tanggal')) {
			const svg = saveDateButton.querySelector('svg');
			if (svg) {
				saveDateButton.innerHTML = svg.outerHTML + ' Simpan Tanggal / 日程のご案内';
			}
		}
	}
	
} else if(siteName === "vony-arif.menujuakad.com") {
	document.addEventListener('DOMContentLoaded', function() {
		const dateElements = document.querySelectorAll('.date h5');
		
		dateElements.forEach(element => {
			if (element.textContent.startsWith('0')) {
				element.textContent = element.textContent.substring(1);
			}
		});
	});
}
