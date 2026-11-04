const qselect = (element, elements = false) => {
  if (elements === false) { //single element
    return document.querySelector(element)
  } else { //all elements
    return document.querySelectorAll(element)
  }
}

const getBody = qselect('body')

getBody.style.overflowY = "hidden"

// window.scrollTo(0,0)

const musicControl = qselect("#musicControl")
const playPauseIcon = qselect("#playPause")
const bgMusic = qselect("audio")

if (bgMusic) { bgMusic.load() }

const bgMusicPlay = (play = true) => {
  if (bgMusic) {
    bgMusic.loop = true
    bgMusic.controls = false

    if (play == true) {
      bgMusic.play()
    } else {
      bgMusic.pause()
    }
  }
}

if (musicControl) {
  musicControl.addEventListener("click", (event) => {
    if (bgMusic.paused == true) {
      bgMusicPlay()
      playPauseIcon.classList.replace('icofont-music-alt', 'icofont-ui-pause');
    } else {
      bgMusicPlay(false)
      playPauseIcon.classList.replace('icofont-ui-pause', 'icofont-music-alt');
    }
  })
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {

    if (document.querySelector(".loader-wrapper")) {
      document.querySelector(".loader-wrapper").style.visibility = "hidden";
    } else {
      qselect(".spanner").classList.remove("show")
    }


    const envelopeSection = qselect('#sectionEnvelope')
    const envelopeBtn = qselect('#closeEnvelope')

    if (envelopeSection) {
      envelopeSection.scrollIntoView();
    }

    if (envelopeBtn) {
      envelopeBtn.addEventListener("click", (event) => {
        envelopeSection.style.transform = "translateY(-100%)";
        getBody.style.overflowY = "auto"
        console.log('Button envelope clicked');
        initialize_mansory_item()
        AOS.refresh();
        bgMusicPlay();
      })
    } else {
      getBody.style.overflowY = "auto"
      bgMusicPlay()
    }

    var previousScroll = 70;
    $(window).scroll(function (e) {

      // add/remove class to navbar when scrolling to hide/show
      var scroll = $(window).scrollTop();
      if (scroll >= previousScroll) {
        $('nav').addClass("navbar-hide");
      } else if (scroll < previousScroll) {
        $('nav').removeClass("navbar-hide");
        $('nav').addClass("scrolled");
      }

      if (scroll == 0) {
        $('nav').removeClass("navbar-hide");
        $('nav').removeClass("scrolled");
      }
      previousScroll = scroll;
    });
  }
};

// hide and show name, email, address form if anonymous checked
$("#anonymous_angpao").click(function () {
  if ($(this).is(':checked')) {
    $('#name_angpao').prop('required', false);
    $('#email_angpao').prop('required', false);
    $('#address_angpao').prop('required', false);
    $('#name_angpao_wrapper').hide('500');
    $('#email_angpao_wrapper').hide('500');
    $('#address_angpao_wrapper').hide('500');
  } else {
    $('#name_angpao').prop('required', true);
    $('#email_angpao').prop('required', true);
    $('#address_angpao').prop('required', true);
    $('#name_angpao_wrapper').show('500');
    $('#email_angpao_wrapper').show('500');
    $('#address_angpao_wrapper').show('500');
  }
  AOS.refresh();
});
// end hide and show name, email, address form if anonymous checked

const btnOpenAngpao = document.querySelector("#openAngpao")
const formAngpao = document.querySelector("#formGift")

if (btnOpenAngpao) {
  btnOpenAngpao.addEventListener('click', () => {
    formAngpao.classList.remove("d-none")
    btnOpenAngpao.classList.add("d-none")
    AOS.refresh();
  })
}

const parseDateString = (dateString) => {
  let matchers = [];
  matchers.push(/^[0-9]*$/.source);
  matchers.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
  matchers.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
  matchers = new RegExp(matchers.join("|"));
  if (dateString instanceof Date) {
    return dateString;
  }
  if (String(dateString).match(matchers)) {
    if (String(dateString).match(/^[0-9]*$/)) {
      dateString = Number(dateString);
    }
    if (String(dateString).match(/\-/)) {
      dateString = String(dateString).replace(/\-/g, "/");
    }
    return new Date(dateString);
  } else {
    throw new Error("Couldn't cast `" + dateString + "` to a date object.");
  }
}

$('iframe, img').on('load', function () {
  AOS.refresh();
  console.log('AOS Refreshed');
});


const lightboxs_default = document.querySelector('.default-gallery #lightboxGallery')

if (lightboxs_default) {
  lightGallery(lightboxs_default, {
    thumbnail: true,
    hash: true,
    download: false,
    selector: '.anchor'
  });
}

function initialize_mansory_item() {
  if ($('.default-gallery #lightboxGallery').length > 0) {
    $('.default-gallery #lightboxGallery').masonry({
      percentPosition: true
    });
    console.log('masonry initialized');
    AOS.refresh();
  }
}

const iOSversion = () => {
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
}

const iosVer = iOSversion()

if (iosVer != undefined) {
  if (iosVer[0] <= 12) {
    var sd = document.body.attachShadow({ mode: 'open' });

    // Main slot will absorb all undistributed children.
    var mainSlot = document.createElement('slot');
    var scroller = document.createElement('div');
    scroller.style = 'background: white; position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow-x: hidden; overflow-y: auto; -webkit-overflow-scrolling: touch;';
    scroller.appendChild(mainSlot);
    sd.appendChild(scroller);

    // Selectively, it's also possible to distribute fixed elements separately,
    // emulating fixed layer transfer.
    var fixedLayer = document.createElement('div');
    fixedLayer.style = 'height: 0; width: 0; position: fixed; overflow:visible;';
    sd.appendChild(fixedLayer);

    var mainFixedSlot = document.createElement('slot');
    mainFixedSlot.setAttribute('name', 'fixed');
    fixedLayer.appendChild(mainFixedSlot);

    function addToFixedLayer(element) {
      //var slotId = String(Math.random());
      //var fixedSlot = document.createElement('slot');
      //fixedSlot.setAttribute('name', slotId);
      //fixedLayer.appendChild(fixedSlot);
      //element.setAttribute('slot', slotId);
      element.setAttribute('slot', 'fixed');
    }

    /*Call and pass fixed elemetns to addToFixedLayer method so that they stay
    fixed while scrolling */

    //  const fixedDivId = document.querySelector("#payment-option")

    //  addToFixedLayer(fixedDivId)

    console.log("U are using old iphone, go buy the new one. Or if u don't have money buy an android instead. It's cheaper & more powerful")
  }
} else {
  console.log("Not IOS")
}

$(window).on('resize', function () {
  console.log('Window Resized');
  setTimeout(function () {
    AOS.refresh();
  }, 1000);
});

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "hannisaaviz.menujuakad.com") {
  const venueSection = document.querySelector(".section#venue");
  const events = venueSection.querySelectorAll(".col-12.col-md-6.align-self-stretch.align-items-stretch.p-5");

  events.forEach(event => {
    const eventPlace = event.querySelector("h4 .venue-loc p").textContent;
    if (eventPlace === "Kelapa Gading Balai Samudera") {
      event.querySelector("h4 .venue-loc p").innerHTML = `Kelapa Gading<br>Balai Samudera`;

      event.classList.remove("p-5");
      event.classList.add("mt-n5", "mt-md-0", "px-5", "pb-5", "pt-md-5");
    }
  })
} else if (siteName === "waktuberlalusekejapmata.menujuakad.com") {
  const coverParent = document.querySelector(".section#sectionEnvelope .content");
  const coverButtonParent = coverParent.querySelector(".d-flex.flex-wrap.justify-content-center.text-capitalize.text-center.my-5")
  const greetingText = coverParent.querySelector(".greeting-text");
  const greetingNameText = coverParent.querySelector(".greeting-name-text");

  if (greetingText && greetingNameText) {
    const newEl = document.createElement("div");
    newEl.classList.add('text-center', 'w-full');
    newEl.append(greetingText, greetingNameText);

    coverParent.insertBefore(newEl, coverButtonParent);
  }

} else if (siteName === "rayarajaratubirthday.menujuakad.com") {
  const rsvp = document.querySelector(".section#venue #cardRSVP");
  if (rsvp) {
    const formGroup = rsvp.querySelectorAll(".form-group");
    formGroup.forEach(el => {
      el.classList.add("px-2");

      const emailInput = el.querySelector('input[name="email"]');
      if (emailInput) {
        emailInput.setAttribute("name", "address");
        emailInput.setAttribute("type", "text");
        emailInput.setAttribute("placeholder", "Shirt Size");
      }
    })
  }
} else if (siteName === "stepathon.menujuakad.com") {
  const main = document.querySelector("section#sectionMain");
  if (main) {
    main.querySelector(".event-date")?.remove();
  }
} else if (siteName === "tomyangel.menujuakad.com") {
  const events = document.querySelectorAll("section.section#venue .col-12.col-md-6.align-self-stretch.align-items-stretch.p-0 .card");

  events.forEach(event => {
    const dateTexts = event.querySelectorAll(".event-time-text");

    dateTexts[1].classList.add("mb-3");
  })
} else if (siteName === "heroldbernadeta.menujuakad.com") {
	const eventDateElement = document.querySelector('.event-date');
	if (eventDateElement) {
		eventDateElement.textContent = eventDateElement.textContent.replace(/\s*\|\s*11:00\s*WIB/, '');
	}
} else if (siteName === "dontasya.menujuakad.com") {
	const dateElement = document.querySelector('.event-date');
	// Remove time part (anything after | followed by time pattern)
	dateElement.textContent = dateElement.textContent.replace(/\s*\|\s*\d{1,2}:\d{2}\s*/, '');
	
	// Function to handle image positioning based on screen size
function positionEventImages() {
    const eventSections = document.querySelectorAll('.col-12.col-md-6');
    
    eventSections.forEach(section => {
        const title = section.querySelector('.sub-title p');
        if (title && title.textContent.trim() === 'Resepsi') {
            const image = section.querySelector('img[src="/templates/assets/themes/C/venue.png"]');
            if (image) {
                image.remove();
            }
        }
    });
    
    const locationImages = document.querySelectorAll('img[alt="location"]');
    
    locationImages.forEach(img => {
        const eventWrapper = img.closest('.col-inner');
        const eventNameElement = eventWrapper.querySelector('h3');
        
        if (eventNameElement) {
            // Remove any existing positioning classes
            img.classList.remove('mobile-position', 'desktop-position');
            
            // Check if mobile view (screen width less than 768px)
            if (window.innerWidth < 768) {
                // Mobile view - inline with title
                eventNameElement.style.display = 'flex';
                eventNameElement.style.alignItems = 'center';
                eventNameElement.style.justifyContent = 'center';
                eventNameElement.style.gap = '10px';
                eventNameElement.style.flexWrap = 'wrap';
                
                // Move image into h3 at the beginning
                if (!eventNameElement.contains(img)) {
                    eventNameElement.insertBefore(img, eventNameElement.firstChild);
                }
                
                img.classList.add('mobile-position');
            } else {
                // Desktop view - at top of title
                eventNameElement.style.display = 'block';
                eventNameElement.style.textAlign = 'center';
                
                // Ensure image is above the title, not inside it
                const titleContainer = eventNameElement.closest('.col-12');
                if (titleContainer && !titleContainer.contains(img) && !eventNameElement.contains(img)) {
                    // Create a container for desktop layout if needed
                    let imageContainer = titleContainer.querySelector('.desktop-image-container');
                    if (!imageContainer) {
                        imageContainer = document.createElement('div');
                        imageContainer.className = 'desktop-image-container';
                        imageContainer.style.textAlign = 'center';
                        imageContainer.style.marginBottom = '10px';
                        titleContainer.insertBefore(imageContainer, eventNameElement);
                    }
                    
                    // Clear and add image to container
                    imageContainer.innerHTML = '';
                    imageContainer.appendChild(img);
                }
                
                img.classList.add('desktop-position');
            }
        }
    });
}

		// Add CSS for different layouts
		const style = document.createElement('style');
		style.textContent = `
			.mobile-position {
				margin-bottom: 0 !important;
				display: inline-block;
			}
			
			.desktop-position {
				display: block;
				margin: 0 auto 15px auto;
			}
			
			@media (max-width: 767px) {
				.desktop-image-container {
					display: none;
				}
			}
			
			@media (min-width: 768px) {
				.col-inner h3 {
					display: block !important;
				}
			}
		`;
		document.head.appendChild(style);

		// Initial positioning
		positionEventImages();

		// Update on window resize
		let resizeTimer;
		window.addEventListener('resize', function() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(positionEventImages, 250);
		});

		// Also update when DOM changes (for dynamic content)
		const observer = new MutationObserver(function(mutations) {
			let shouldUpdate = false;
			mutations.forEach(function(mutation) {
				if (mutation.type === 'childList') {
					shouldUpdate = true;
				}
			});
			if (shouldUpdate) {
				positionEventImages();
			}
		});

		// Start observing when DOM is ready
		document.addEventListener('DOMContentLoaded', function() {
			positionEventImages();
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
} else if (siteName === "riccotata.menujuakad.com") {
	
	document.addEventListener('DOMContentLoaded', function() {
		// Move church image
		const churchSection = document.querySelector('.event-venue-wrapper:has(img[alt="church"])');
		const churchImage = churchSection?.querySelector('img[alt="church"]');
		const churchTitle = churchSection?.querySelector('h3');
		
		if (churchImage && churchTitle) {
			churchTitle.parentNode.insertBefore(churchImage, churchTitle);
		}
		
		// Move reception image
		const receptionSection = document.querySelector('.event-venue-wrapper:has(img[alt="reception"])');
		const receptionImage = receptionSection?.querySelector('img[alt="reception"]');
		const receptionTitle = receptionSection?.querySelector('h3');
		
		if (receptionImage && receptionTitle) {
			receptionTitle.parentNode.insertBefore(receptionImage, receptionTitle);
		}
	});

} else if (siteName === "ianhelen.menujuakad.com") {
	//var name = {{ $invitation_data->name ?? request()->name  }};
	
	function transformGreetingAdvanced() {
		const greetingTextEl = document.querySelector('.greeting-text');
		const greetingNameEl = document.querySelector('.greeting-name-text');
		
		// Check if both elements exist and have content
		if (!greetingTextEl || !greetingNameEl) return;
		
		const greetingText = greetingTextEl.textContent.trim();
		const greetingName = greetingNameEl.textContent.trim();
		
		if (!greetingText || !greetingName) return;
		
		// Only proceed if greeting text contains "Kepada Yth."
		if (greetingText.includes('Kepada Yth.')) {
			const container = greetingTextEl.closest('.container');
			
			// Create wrapper div for grouping
			const greetingGroup = document.createElement('div');
			greetingGroup.className = 'greeting-group';
			
			// Create the three lines
			const line1 = document.createElement('p');
			line1.className = 'text-shadow mb-0 text-center greeting-text';
			line1.textContent = 'Kepada Yth.';
			
			const line2 = document.createElement('p');
			line2.className = 'text-shadow mb-0 text-center greeting-salutation';
			line2.textContent = 'Bapak/Ibu/Saudara/i';
			
			const line3 = document.createElement('p');
			line3.className = 'text-shadow mb-2 text-center font-weight-bold greeting-name-text';
			line3.textContent = greetingName;
			
			// Append all lines to the group
			greetingGroup.appendChild(line1);
			greetingGroup.appendChild(line2);
			greetingGroup.appendChild(line3);
			
			// Remove old elements
			greetingTextEl.remove();
			greetingNameEl.remove();
			
			// Insert the grouped greeting at the beginning
			container.insertBefore(greetingGroup, container.firstChild);
		}
	}

	// Run the transformation
	transformGreetingAdvanced();
} else if (siteName === "smartseedxi.menujuakad.com") {
	
	const guestbookForm = document.getElementById("guestbook_form");
	if (guestbookForm) {
		const inputWish = guestbookForm.querySelector("textarea[name='comment']");
		if (inputWish) inputWish.setAttribute("placeholder", "Tulis feedback atau pertanyaan");
	}
	
	function duplicateCarouselWithNewImages(newImages, options = {}) {
		// Default options
		const config = {
			delayStart: 3000, // Delay before starting 2nd carousel (ms)
			enableModal: true, // Enable modal popup for 2nd carousel
			firstCarouselTitle: 'SMARTSEED IX - 2023', // Title for 1st carousel
			secondCarouselTitle: 'SMARTSEED X - 2024', // Title for 2nd carousel
			...options
		};
		
		// Get the original carousel container
		const originalGallery = document.getElementById('gallery-2');
		
		if (!originalGallery) {
			console.error('Original gallery not found');
			return;
		}
		
		// Find the original owl-carousel element
		const originalOwlCarousel = originalGallery.querySelector('.owl-carousel');
		
		if (!originalOwlCarousel) {
			console.error('Owl carousel not found');
			return;
		}
		
		// Destroy the existing Owl Carousel instance if it exists
		if (window.jQuery && jQuery.fn.owlCarousel) {
			const $original = $(originalOwlCarousel);
			if ($original.data('owl.carousel')) {
				$original.trigger('destroy.owl.carousel');
			}
		}
		
		// Clone the gallery container
		const clonedGallery = originalGallery.cloneNode(true);
		
		// Add title to original gallery if it doesn't have one
		if (config.firstCarouselTitle) {
			let originalTitle = originalGallery.querySelector('.carousel-title');
			if (!originalTitle) {
				originalTitle = document.createElement('h3');
				originalTitle.className = 'carousel-title';
				originalTitle.style.cssText = 'margin-bottom: 20px; font-size: 24px; font-weight: bold; color: #333; text-align: center;';
				originalTitle.textContent = config.firstCarouselTitle;
				originalGallery.insertBefore(originalTitle, originalGallery.firstChild);
			}
		}
		
		// Generate unique IDs
		const newGalleryId = 'gallery-' + Date.now();
		const newCarouselId = 'zoom-gallery-' + Date.now();
		
		clonedGallery.id = newGalleryId;
		clonedGallery.setAttribute('data-carousel-type', 'cloned');
		
		// Add title to cloned gallery
		if (config.secondCarouselTitle) {
			let clonedTitle = clonedGallery.querySelector('.carousel-title');
			if (clonedTitle) {
				clonedTitle.textContent = config.secondCarouselTitle;
			} else {
				clonedTitle = document.createElement('h3');
				clonedTitle.className = 'carousel-title';
				clonedTitle.style.cssText = 'margin-bottom: 20px; font-size: 24px; font-weight: bold; color: #333; text-align: center;';
				clonedTitle.textContent = config.secondCarouselTitle;
				clonedGallery.insertBefore(clonedTitle, clonedGallery.firstChild);
			}
		}
		
		const clonedOwlCarousel = clonedGallery.querySelector('.owl-carousel');
		if (clonedOwlCarousel) {
			clonedOwlCarousel.id = newCarouselId;
		}
		
		// Convert simple URLs to objects if needed
		const processedImages = newImages.map(img => 
			typeof img === 'string' ? { highRes: img, thumb: img, alt: 'Gallery image' } : img
		);
		
		// Find the actual item containers
		let itemContainers = clonedOwlCarousel.querySelectorAll('.item');
		
		if (itemContainers.length === 0) {
			itemContainers = clonedOwlCarousel.querySelectorAll('.gallery-item, .carousel-item');
		}
		
		if (itemContainers.length === 0) {
			itemContainers = Array.from(clonedOwlCarousel.children).filter(
				child => !child.classList.contains('owl-stage-outer') && 
						 !child.classList.contains('owl-nav') && 
						 !child.classList.contains('owl-dots')
			);
		}
		
		console.log('Found item containers:', itemContainers.length);
		
		// Clear existing items and rebuild
		clonedOwlCarousel.innerHTML = '';
		
		processedImages.forEach((imageData, index) => {
			const itemDiv = document.createElement('div');
			itemDiv.className = 'item';
			
			const link = document.createElement('a');
			link.href = imageData.highRes;
			link.className = 'gallery-link';
			link.setAttribute('data-image-index', index);
			
			// Add modal trigger class for 2nd carousel
			if (config.enableModal) {
				link.classList.add('modal-trigger');
				link.addEventListener('click', function(e) {
					e.preventDefault();
					openImageModal(imageData.highRes, imageData.alt);
				});
			}
			
			const img = document.createElement('img');
			img.src = imageData.thumb;
			img.alt = imageData.alt || 'Gallery image';
			img.className = 'img-fluid';
			img.style.height = '270px';
			img.style.width = '100%';
			img.style.objectFit = 'cover';
			img.style.borderRadius = '10px';
			
			link.appendChild(img);
			itemDiv.appendChild(link);
			clonedOwlCarousel.appendChild(itemDiv);
		});
		
		// Remove any owl-carousel generated elements
		const owlStage = clonedOwlCarousel.querySelector('.owl-stage-outer');
		const owlNav = clonedOwlCarousel.querySelector('.owl-nav');
		const owlDots = clonedOwlCarousel.querySelector('.owl-dots');
		
		if (owlStage) owlStage.remove();
		if (owlNav) owlNav.remove();
		if (owlDots) owlDots.remove();
		
		// Insert the cloned gallery after the original one
		originalGallery.parentNode.insertBefore(clonedGallery, originalGallery.nextSibling);
		
		// Reinitialize original carousel first
		setTimeout(() => {
			if (window.jQuery && jQuery.fn.owlCarousel) {
				// Initialize original carousel
				$(originalOwlCarousel).owlCarousel({
					loop: true,
					margin: 30,
					nav: true,
					dots: true,
					autoplay: true,
					autoplayTimeout: 3000,
					responsive: {
						0: { items: 1 },
						600: { items: 2 },
						1000: { items: 3 }
					}
				});
				
				console.log('Original carousel initialized');
				
				// Initialize cloned carousel with delay
				setTimeout(() => {
					$('#' + newCarouselId).owlCarousel({
						loop: true,
						margin: 30,
						nav: true,
						dots: true,
						autoplay: true,
						autoplayTimeout: 3000,
						responsive: {
							0: { items: 1 },
							600: { items: 2 },
							1000: { items: 3 }
						}
					});
					
					console.log('Cloned carousel initialized with delay');
				}, config.delayStart);
				
			} else {
				console.error('jQuery or Owl Carousel not loaded');
			}
		}, 100);
		
		return clonedGallery;
	}

	// Create modal for image viewing
	function createImageModal() {
		// Check if modal already exists
		if (document.getElementById('imageModal')) {
			return;
		}
		
		const modalHTML = `
			<div id="imageModal" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.9); overflow: auto;">
				<span id="closeModal" style="position: absolute; top: 20px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; z-index: 10000;">&times;</span>
				<img id="modalImage" style="margin: auto; display: block; max-width: 90%; max-height: 90%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
				<div id="modalCaption" style="margin: auto; display: block; width: 80%; max-width: 700px; text-align: center; color: #ccc; padding: 10px 0; position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);"></div>
			</div>
		`;
		
		document.body.insertAdjacentHTML('beforeend', modalHTML);
		
		// Close modal functionality
		const modal = document.getElementById('imageModal');
		const closeBtn = document.getElementById('closeModal');
		
		closeBtn.onclick = function() {
			modal.style.display = 'none';
		};
		
		// Close on click outside image
		modal.onclick = function(e) {
			if (e.target === modal) {
				modal.style.display = 'none';
			}
		};
		
		// Close on ESC key
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && modal.style.display === 'block') {
				modal.style.display = 'none';
			}
		});
	}

	// Open image in modal
	function openImageModal(imageSrc, caption) {
		// Create modal if it doesn't exist
		createImageModal();
		
		const modal = document.getElementById('imageModal');
		const modalImg = document.getElementById('modalImage');
		const modalCaption = document.getElementById('modalCaption');
		
		modal.style.display = 'block';
		modalImg.src = imageSrc;
		modalCaption.textContent = caption || '';
	}

	// Example usage with new images:
	const newImages = [
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0001.jpeg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0002.jpeg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0003.jpeg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0856.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0864.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0878.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0912.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0917.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0991.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0998.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX0999.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX1004.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX1088.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX1092.jpg',
		'https://viding.sgp1.digitaloceanspaces.com/images/sms/SMSX08561.jpg',
	].map(url => ({
		highRes: url,
		thumb: url,
		alt: 'Gallery Image'
	}));

	// Call the function with custom options
	duplicateCarouselWithNewImages(newImages, {
		delayStart: 8000, // Start 2nd carousel after 3 seconds
		enableModal: true // Enable modal popup for 2nd carousel
	});
	// Or duplicate with detailed image objects
	// duplicateCarouselWithNewImages(detailedImages);

}