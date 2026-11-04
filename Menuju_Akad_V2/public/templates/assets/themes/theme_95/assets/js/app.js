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

const inputField = document.getElementById('dynamicInputField');
if (inputField) {
	const steppersId = inputField.getAttribute('data-steppers-id');

	if (steppersId == 17468) {
		inputField.name = 'address';
		inputField.placeholder = 'Allergies';
	} else {
		inputField.name = 'email';
		inputField.placeholder = 'Email';
	}
}

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName == "peterandrani.menujuakad.com") {

} else if (siteName === "weddingcinema.menujuakad.com") {
	const videoId = ['H0q4ipzCwds'];
	if (typeof generatedHtmlVideosInGallery === "function") generatedHtmlVideosInGallery(videoId);
} else if (siteName === "agathonjess.menujuakad.com") {
	const parent = document.querySelector(".multiple-event-wrapper");
	const events = parent.querySelectorAll(".col-10.col-md-6.color-secondary");

	events.forEach(event => {
		const eventName = event.querySelector('label.btn-event-check-label').textContent;
		if (eventName === "Tea Pai (family only)" || eventName === "After Party") {
			event.remove();
		}
	})
} else if (siteName === "horaybelsoklibur.menujuakad.com") {
	const coverParent = document.querySelector(".cover-section");
	const coverDesc = coverParent.querySelector(".cover-description");
	const coverContent = coverDesc.querySelectorAll(".position-relative");
	const coverGreeting = coverDesc.querySelector(".position-relative .greeting-wrapper");
	coverDesc.insertBefore(coverContent[coverContent.length - 1], coverContent[0]);
	coverDesc.insertBefore(coverGreeting, coverContent[coverContent.length - 1]);

	const coverBtn = coverDesc.querySelector(".btn-custom");
	coverBtn.innerHTML = `
	<strong>Silkie Has an Announcement for You <i class="fas fa-envelope-open-text"></i></strong>
	`
} else if (siteName === "charleensecretgarden.menujuakad.com") {
	const reminderParent = document.querySelector(".reminder-wrap");
	const btnReminder = reminderParent.querySelector(".reminder-content .btn-reminder");

	btnReminder.setAttribute("href", "https://www.google.com/calendar/render?action=TEMPLATE&text=Charleen's+Secret+Garden&details=Visit+the+invitation+here+<a href='http%3A%2F%2Fcharleensecretgarden.menujuakad.com'>http%3A%2F%2Fcharleensecretgarden.menujuakad.com</a>&dates=20250816T173000%2F20250816T174500&ctz=Asia%2FJakarta")
} else if (siteName === "kevinana.menujuakad.com") {
	const inputName = document.querySelectorAll("input[name='name']");
	inputName.forEach(input => {
		input.setAttribute("placeholder", "Nama Lengkap");
	})

	const textareaWishes = document.querySelector(".wishes-section .card-form.card form textarea");
	if (textareaWishes) textareaWishes.setAttribute("placeholder", "Tulis Doa & Ucapan Kamu");
} else if (siteName === "livewithlee.menujuakad.com") {
	const venue = document.querySelector(".venue-section");
	if (venue) {
		const events = venue.querySelectorAll(".venue-content .card");

		events.forEach(event => {
			const eventNameEl = event.querySelector(".event-name h4");
			const eventName = eventNameEl.textContent.trim().replace(/\([^)]*\)/g, match => `<br><span>${match}</span>`);

			eventNameEl.innerHTML = eventName;
		})
	}

	const rsvp = document.querySelector(".rsvp-section");
	if (rsvp) {
		const inputName = rsvp.querySelector("input[name='name']");
		if (inputName) inputName.setAttribute("placeholder", "Name/Nama");

		const inputHp = rsvp.querySelector("input[name='no_hp']");
		if (inputHp) inputHp.setAttribute("placeholder", "Phone Number/Nomor HP");

		const inputGuest = rsvp.querySelector("input[name='jumlah']");
		if (inputGuest) inputGuest.setAttribute("placeholder", "Number of Guest/Jumlah Tamu");

		const selectAttend = rsvp.querySelectorAll("select[name='status'] option");
		if (selectAttend) {
			selectAttend[0].textContent = "Confirmation of Attendance/Konfirmasi Kehadiran";
			selectAttend[1].textContent = "Attend/Hadir";
			selectAttend[2].textContent = "Not Attend/Tidak Hadir";
		}

		const titleSelectEvent = rsvp.querySelector(".multiple-event-wrapper > p");
		if (titleSelectEvent) titleSelectEvent.textContent = "Choose Event to Attend (Pilih acara untuk dihadiri):";

		const eventSelects = rsvp.querySelectorAll(".multiple-event-wrapper .row .col-10.col-md-6.color-secondary");
		const lastEl = eventSelects[eventSelects.length - 1];
		console.log(lastEl)
		if (lastEl) lastEl.querySelector("button").textContent = "Attend All (Hadir Keduanya)";
	}

	const wishes = document.querySelector(".wishes-section");
	if (wishes) {
		const inputName = wishes.querySelector("input[name='name']");
		if (inputName) inputName.setAttribute("placeholder", "Name/Nama");

		const inputWish = wishes.querySelector("textarea[name='comment']");
		if (inputWish) inputWish.setAttribute("placeholder", "Write Your Wishes/Tulis Harapan Kamu");
	}

	const egift = document.querySelector(".egift-section");
	if (egift) {
		const inputName = egift.querySelector("input[name='name']");
		if (inputName) inputName.setAttribute("placeholder", "Name/Nama");

		const inputAmount = egift.querySelector("input[name='payment']");
		if (inputAmount) inputAmount.setAttribute("placeholder", "Amount/Jumlah");
	}
} else if (siteName === "vidamegi.menujuakad.com") {
	const venue = document.querySelector(".venue-section");

	if (venue) {
		const events = venue.querySelectorAll(".venue-content .card");

		events.forEach(event => {
			const eventPlace = event.querySelector(".event-place h4");
			eventPlace.classList.remove("notranslate");
		})
	}
} else if (siteName === "marshaveys.menujuakad.com") {
	const rsvp = document.querySelector(".rsvp-section");
	const fullUrl = new URL(window.location.href);

	if (rsvp) {
		if (fullUrl.searchParams.get("event").trim() === "Livestream Resepsi" || fullUrl.searchParams.get("event").trim() === "Livestreaming Akad") {
			const rsvpWrap = rsvp.querySelector(".rsvp-wrapper");
			if (rsvpWrap) rsvpWrap.remove();
		}
	}
} else if (siteName === "mosesgabriella.menujuakad.com") {
	const venue = document.querySelector(".venue-section");

	if (venue) {
		const events = venue.querySelectorAll(".venue-content .card");

		events.forEach(event => {
			const pTag = event.querySelectorAll(".event-name p");
			const jam = pTag[pTag.length - 1];

			jam.textContent = jam.textContent.trim().split("-")[0];
		})
	}
} else if (siteName === "kevinjess.menujuakad.com") {
	const textReminder = document.querySelector(".reminder-wrap .name-opacity");

	if (textReminder) textReminder.textContent = "Counting Days";

	const couples = document.querySelectorAll(".couple");
	couples.forEach(couple => {
		const parentDescription = couple.querySelector(".couple-parent-description");
		const newDiv = document.createElement("div");
		newDiv.classList.add("couple-name");

		if (parentDescription.textContent.includes("Kevin Leonardo")) {
			newDiv.innerHTML = `<span>The Groom</span>`;
		} else {
			newDiv.innerHTML = `<span>The Bride</span>`;
		}

		const imgCouple = couple.querySelector(".image-wrap");
		imgCouple.insertBefore(newDiv, imgCouple.firstChild);
	});

	const titleGallery = document.createElement("div");
	titleGallery.classList.add("title-section");
	titleGallery.innerHTML = `<h2>Our Gallery</h2>`;

	const gallery = document.querySelector(".gallery-section");
	if (gallery) gallery.insertBefore(titleGallery, gallery.firstChild)

} else if (siteName === "aldo-ericka.menujuakad.com") {
	// Find the reminder-content element
	const reminderContent = document.querySelector('.reminder-content');

	// Add the text after the element
	reminderContent.insertAdjacentHTML('afterend', '<div class="hashtag-text">#iDoCherishyou</div>');
} else if (siteName === "kevinandgiovani.menujuakad.com") {

	document.addEventListener('DOMContentLoaded', function () {
		const eventHours = document.querySelectorAll('.event-name');

		const statusSelect = document.querySelector('select[name="status"]');
		const attendOption = statusSelect.querySelector('option[value="1"]');
		const notAttendOption = statusSelect.querySelector('option[value="0"]');


		eventHours.forEach(eventHour => {
			// Get all p elements and find the one that contains time
			const paragraphs = eventHour.querySelectorAll('p');

			paragraphs.forEach(p => {
				// Look for the pattern: time - End
				if (/\d{1,2}:\d{2}\s*-\s*End/.test(p.textContent)) {
					p.textContent = p.textContent.replace(/\s*-\s*End/, '');
				}
			});
		});

		if (attendOption && notAttendOption) {
			attendOption.textContent = "Wouldn't miss it";
			notAttendOption.textContent = "Will celebrate from a far";
		}
	});

	const events = document.querySelectorAll(".venue-section .venue-content .card");

	events.forEach(event => {
		const eventPlaceElement = event.querySelector(".event-place h4");
		console.log(eventPlaceElement.textContent.trim() === "Vihara Avalokhitesvara 95 (觀音堂 95)")
		if (eventPlaceElement.textContent.trim() === "Vihara Avalokhitesvara 95 (觀音堂 95)") {
			eventPlaceElement.innerHTML = "Vihara Avalokhitesvara 95<br>(觀音堂 95)"
		}
	})

} else if (siteName === "joaquinmeilyn.menujuakad.com") {
	document.getElementById('btn-envelope').innerHTML = '<strong>Abrir la Invitación <i class="fas fa-envelope-open-text"></i></strong>';
	document.addEventListener('DOMContentLoaded', function () {
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
				input.placeholder = 'Nombre';
			} else if (placeholder.includes('phone number')) {
				input.placeholder = 'Número de Celular';
			} else if (placeholder.includes('number of guest')) {
				input.placeholder = 'Número de invitados';
			} else if (placeholder.includes('write your wishes')) {
				input.placeholder = 'Déjanos tus palabras de cariño';
			}
		});

		// Update submit buttons in this form
		const submitBtn = form.querySelector('button[type="submit"]');
		if (submitBtn && (submitBtn.textContent.includes('Kirim') || submitBtn.textContent.includes('Send'))) {
			submitBtn.textContent = 'Enviar';
		}

		// Update select if exists in this form
		const select = form.querySelector('select[name="status"]');
		if (select) {
			const options = select.querySelectorAll('option');
			options.forEach(option => {
				if (option.disabled && option.selected) {
					option.textContent = 'Confirmación de Asistencia';
				} else if (option.value === '1') {
					option.textContent = 'Presente';
				} else if (option.value === '0') {
					option.textContent = 'No Presente';
				}
			});
		}

		// Lokasi button
		const lokasiButton = document.querySelectorAll('.event-place .btn-custom[aria-label="button maps"]');
		lokasiButton.forEach(button => {

			if (lokasiButton && button.textContent.includes('Location')) {
				button.textContent = 'Ubicación';
			}
		});

		// Reminder button
		const saveDateButton = document.querySelector('.btn-reminder');
		if (saveDateButton && saveDateButton.textContent.includes('Save the Date')) {
			const svg = saveDateButton.querySelector('svg');
			if (svg) {
				saveDateButton.innerHTML = svg.outerHTML + ' Guardar la Fecha';
			}
		}

		// More targeted approach for better performance
		const targetContainers = document.querySelectorAll('.event-name, .date');
		targetContainers.forEach(container => {
			container.innerHTML = container.innerHTML
				.replace(/Friday/g, 'Viernes')
				.replace(/January/g, 'Enero');
		});

		// Get all countdown labels and translate them
		const countdownLabels = document.querySelectorAll('.countdown .huruf');

		countdownLabels.forEach(label => {
			const text = label.textContent.trim();

			switch (text) {
				case 'Days':
					label.textContent = 'Días';
					break;
				case 'Hours':
					label.textContent = 'Horas';
					break;
				case 'Mins':
					label.textContent = 'Min';
					break;
				case 'Secs':
					label.textContent = 'Seg';
					break;
			}
		});

		// Translate the "Remaining" text
		const remainingElement = document.querySelector('.reminder-wrap .name-opacity');
		if (remainingElement && remainingElement.textContent.includes('Remaining')) {
			remainingElement.textContent = 'Quedan';
		}

		// Translate the "Characters Left"
		const charCountElement = document.getElementById('charCount');
		const textarea = document.querySelector('textarea[name="comment"]');

		if (charCountElement && textarea) {
			// Initial translation
			charCountElement.textContent = 'Caracteres restantes: 300';

			// Add input event listener
			textarea.addEventListener('input', function () {
				const remaining = 300 - this.value.length;
				charCountElement.textContent = `Caracteres restantes: ${remaining}`;
			});
		}

		// Translate the "Remaining" text
		const eventElement = document.querySelector('.multiple-event-wrapper p');
		if (eventElement && eventElement.textContent.includes('Choose Event to Attend:')) {
			eventElement.textContent = 'Elija los eventos que va asistir:';
		}

		// Translate "Attend All"
		const attendAllButton = document.querySelector('.btn-event-check-label-all');
		if (attendAllButton) {
			attendAllButton.textContent = 'Todos';
		}


	}
} else if (siteName === "franwawa.menujuakad.com") {
	const coverBody = document.querySelector(".cover-section .cover-content .cover-body");
	if (coverBody) {
		const greeting = coverBody.querySelector(".greeting-wrapper");

		coverBody.insertBefore(greeting, coverBody.firstElementChild);
	}
}