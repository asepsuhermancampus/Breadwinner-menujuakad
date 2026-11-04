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
      playPauseIcon.classList.replace("icofont-music-alt", "icofont-ui-pause");
    } else {
      bgMusicPlay(false);
      playPauseIcon.classList.replace("icofont-ui-pause", "icofont-music-alt");
    }
  });
}

const waitCoverLoading = (el) => {
  return new Promise((resolve) => {
    el.classList.add("cover-opening");

    setTimeout(() => resolve(el), 2500);
  });
};

document.body.style.overflow = "hidden";

document.querySelector("#btn-envelope").addEventListener("click", () => {
  document.body.style.overflow = "auto";

  document.querySelector(".cover-section").classList.add("cover-opened");

  runAnimationOrnament();
  runAnimationLoop();
  bgMusicPlay();

  gsap.to(".slide-full img", {
    duration: 4,
    x: "-100%",
    stagger: {
      amount: 2.5,
    },
    onComplete: () => {
      document.querySelector("#slide-wrap").style.display = "none";
    },
  });
});

const couples = document.querySelectorAll(".couple-section .couple");
if (couples.length === 1)
  couples.forEach((couple) => couple.classList.add("single"));

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

if (cd) Countdown(cd.getAttribute("date"));

gsap.registerPlugin(ScrollTrigger, Flip);

// Progress Bar
let progress = document.querySelector(".progress");

ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => (progress.style.width = `${self.progress * 100}%`),
});

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
      const flipState = Flip.getState(glider);

      if (tabsWrap.querySelector(".active")) {
        tabsWrap.querySelector(".active").classList.remove("active");
        giftWrap.querySelectorAll(".show").forEach((se) => {
          se.classList.remove("show");
        });
      }

      el.classList.add("active");
      el.appendChild(glider);
      giftWrap.querySelectorAll(el.dataset.tab).forEach((tb) => {
        tb.classList.add("show");
      });

      Flip.from(flipState, { duration: 0.25, ease: "power1.inOut" });

      ScrollTrigger.refresh();
    });
  });
}

const getLoadedIframe = (ifr) => {
  return new Promise((resolve, reject) => {
    ifr.onload = () => resolve("maps loaded!");
    ifr.onerror = () =>
      reject("Iframe Load Failed: Please Check Again Your URL!");
    ifr.src = ifr.dataset.src;
  });
};

window.onload = function () {
  // Modal Event Handler
  const mapModal = document.querySelectorAll(".modal");

  mapModal.forEach((modal) => {
    modal.addEventListener("shown.bs.modal", (e) => {
      const loader = e.target.querySelector(".loader-wrapper-modal");
      const iframe = e.target.querySelector("iframe");

      getLoadedIframe(iframe)
        .then(() => {
          loader.classList.add("loaded");
        })
        .catch((err) => {
          console.log(err);
        });
    });

    modal.addEventListener("hidden.bs.modal", (e) => {
      const iframe = e.target.querySelector("iframe");
      const loader = e.target.querySelector(".loader-wrapper-modal");
      iframe.src = "";
      loader.classList.remove("loaded");
    });
  });
};

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
  document.querySelectorAll("[data-anim]").forEach((ada) => {
    ada.classList.add("animation-invisible");
  });
}

const runAnimationOrnament = () => {
  document.querySelectorAll("[data-anim]").forEach((da) => {
    ScrollTrigger.create({
      trigger: da,
      start: da.dataset.animAnchor ? da.dataset.animAnchor : "top bottom",
      onToggle: (self) => {
        if (!self.isActive) {
          if (da.classList.contains("animate-loop")) {
            return da.classList.add("animate-paused");
          } else {
            return null;
          }
        }
        if (da.dataset.loadAnimation) {
          if (da.classList.contains("animate-loop")) {
            return da.classList.remove("animate-paused");
          } else {
            return self.kill();
          }
        }

        if (da.dataset.animDuration)
          da.style.animationDuration = `${da.dataset.animDuration}ms`;

        if (da.dataset.animDelay)
          da.style.animationDelay = `${da.dataset.animDelay}ms`;

        da.classList.add("has-animate");
        da.classList.remove("animation-invisible");
        da.dataset.loadAnimation = true;
      },
    });
  });
};

const runAnimationOrnamentCover = () => {
  document.querySelectorAll(".cover-section [data-anim]").forEach((vs) => {
    ScrollTrigger.create({
      trigger: vs,
      start: "top bottom",
      onToggle: (self) => {
        if (self.isActive) {
          if (vs.dataset.animDuration)
            vs.style.animationDuration = vs.dataset.animDuration;

          if (vs.dataset.animDelay) {
            setTimeout(() => {
              vs.classList.add("has-animate");
              vs.classList.remove("animation-invisible");
              vs.dataset.loadAnimation = true;
              self.kill();
            }, vs.dataset.animDelay);
          } else {
            vs.classList.add("has-animate");
            vs.classList.remove("animation-invisible");
            vs.dataset.loadAnimation = true;
            self.kill();
          }
        } else {
          vs.classList.add("animation-invisible");
          self.kill();
        }
      },
    });
  });
};

const runAnimationLoop = () => {
  document.querySelectorAll("[data-animationloop]").forEach((al) => {
    ScrollTrigger.create({
      trigger: al,
      start: "-10% bottom",
      onToggle: (self) =>
        self.isActive
          ? al.classList.add("animation-loop")
          : al.classList.remove("animation-loop"),
    });
  });
};

const siteName = document
  .querySelector('meta[property="og:site_name"]')
  ?.getAttribute("content");

if (siteName === "itsalwaysbeenyol.menujuakad.com") {
  const parent = document.querySelector(
    ".cover-section .cover-wrapper .cover-content .cover-body .cover-description",
  );
  const greetingEl = parent.querySelector(".greeting-wrapper");
  if (greetingEl) {
    const lastChild = parent.querySelector(".elements-widget");

    greetingEl.classList.add("my-4");
    parent.style.marginTop = "-2rem";
    parent.insertBefore(greetingEl, lastChild);
  }

  const btnReminder = document.querySelector(".btn-reminder");
  if (btnReminder)
    btnReminder.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_2411_134)">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 0.625C5 0.45924 4.93415 0.300269 4.81694 0.183058C4.69973 0.065848 4.54076 0 4.375 0C4.20924 0 4.05027 0.065848 3.93306 0.183058C3.81585 0.300269 3.75 0.45924 3.75 0.625V1.25H2.5C1.83696 1.25 1.20107 1.51339 0.732233 1.98223C0.263392 2.45107 0 3.08696 0 3.75L0 17.5C0 18.163 0.263392 18.7989 0.732233 19.2678C1.20107 19.7366 1.83696 20 2.5 20H17.5C18.163 20 18.7989 19.7366 19.2678 19.2678C19.7366 18.7989 20 18.163 20 17.5V3.75C20 3.08696 19.7366 2.45107 19.2678 1.98223C18.7989 1.51339 18.163 1.25 17.5 1.25H16.25V0.625C16.25 0.45924 16.1842 0.300269 16.0669 0.183058C15.9497 0.065848 15.7908 0 15.625 0C15.4592 0 15.3003 0.065848 15.1831 0.183058C15.0658 0.300269 15 0.45924 15 0.625V1.25H5V0.625ZM1.25 17.5V5H18.75V17.5C18.75 17.8315 18.6183 18.1495 18.3839 18.3839C18.1495 18.6183 17.8315 18.75 17.5 18.75H2.5C2.16848 18.75 1.85054 18.6183 1.61612 18.3839C1.3817 18.1495 1.25 17.8315 1.25 17.5ZM10 9.36625C12.08 7.2275 17.2812 10.97 10 15.7812C2.71875 10.9688 7.92 7.2275 10 9.36625Z" fill="#F9FDF9"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2411_134">
                                            <rect width="20" height="20" fill="white"></rect>
                                        </clipPath>
                                    </defs>
                                </svg> Save The Date`;
} else if (siteName === "yourinvited.menujuakad.com") {
  const btnReminder = document.querySelector(
    ".couple-section .reminder-wrap .btn-reminder",
  );
  if (btnReminder) {
    btnReminder.setAttribute(
      "href",
      "https://www.google.com/calendar/render?action=TEMPLATE&text=Chloe+Sweet+Seventeen+Party&details=Visit+the+invitation+here+<a href='http%3A%2F%2Fyourinvited.menujuakad.com'>http%3A%2F%2Fyourinvited.menujuakad.com</a>&dates=20250823T170000%2F20250823T171500&ctz=Asia%2FJakarta",
    );
  }
} else if (siteName === "iandfanfan6sept.menujuakad.com") {
  const cover = document.querySelector(".cover-section .cover-description");
  const greetingWrapper = cover.querySelector(".greeting-wrapper");
  if (greetingWrapper) {
    const buttonCover = cover.querySelector(".elements-widget");
    cover.insertBefore(greetingWrapper, buttonCover);
  }
} else if (siteName === "martincynthia.menujuakad.com") {
  const multipleSelectEvent = document.querySelector(
    ".rsvp-section form .multiple-event-wrapper",
  );

  if (multipleSelectEvent) {
    const inputs = multipleSelectEvent.querySelectorAll(
      "input[name='event_ids[]']",
    );
    const selectEvents = multipleSelectEvent.querySelectorAll(
      ".btn-event-check-label",
    );

    inputs.forEach((input, index) => {
      input.setAttribute("type", "radio");

      selectEvents[index].setAttribute("for", input.id);
    });

    const btnSelectAll = multipleSelectEvent.querySelector(
      "button.btn-event-check-label-all",
    );
    if (btnSelectAll) btnSelectAll.parentElement.remove();

    window.onload = () => {
      $(document).off("click", ".btn-event-check-label");

      // selectEvents.forEach((selectEvent, index) =>{
      // 	selectEvent.onclick = ()=>{
      // 		if(inputs[index] && inputs[index].type === 'radio'){
      // 			inputs[index].checked = true;
      // 			selectEvent.classList.toggle("active");
      // 		}
      // 	}
      // })
    };
  }
} else if (siteName === "ariekocintantya.menujuakad.com") {
  const venue = document.querySelector(".venue-section");

  if (venue) {
    const events = venue.querySelectorAll(".venue-content .card");

    events.forEach((event) => {
      const eventName = event
        .querySelector(".event-name h4")
        .textContent.trim();

      if (eventName === "Pemberkatan Perkawinan") {
        const pTag = event.querySelectorAll(".event-name p");
        pTag[pTag.length - 1].textContent = "14:00 WIB - Selesai";
      }
    });
  }
} else if (siteName === "aufarsindi.menujuakad.com") {
  // Find the Acara Pernikahan section
  const eventName = document.querySelector("h4");
  if (eventName && eventName.textContent.trim() === "Acara Pernikahan") {
    // Navigate to the date section that contains the time we want to remove
    const dateSection = eventName.closest(".event-name").querySelector(".date");

    if (dateSection) {
      // Find the paragraph containing the time
      const timeParagraph =
        dateSection.querySelector("p.mt-2").nextElementSibling;

      // Check if this is the time paragraph we want to remove
      if (
        timeParagraph &&
        timeParagraph.textContent.includes("09:00") &&
        timeParagraph.textContent.includes("Selesai")
      ) {
        timeParagraph.remove();
      }
    }
  }

  const gallery = document.querySelector(".gallery-section");
  if (gallery) {
    gallery.insertAdjacentHTML(
      "afterbegin",
      `
				<div class="title-section">
					<h2>Gallery</h2>
				</div>
			`,
    );
  }

  // Create the background element
  const backgroundElement = document.createElement("div");
  backgroundElement.className = "background-element";
  backgroundElement.setAttribute("bis_skin_checked", "1");

  // Create the picture element with responsive images
  const picture = document.createElement("picture");

  // Create source for mobile
  const sourceMobile = document.createElement("source");
  sourceMobile.media = "(max-width: 767px)";
  sourceMobile.srcset =
    "/templates/assets/media/ce2ee2469abd539d40a9ce9553fe4c88.webp";

  // Create image for desktop
  const img = document.createElement("img");
  img.src =
    "/templates/assets/media/a259396936422c5fe2f72ac078d9d5f7.webp";
  img.alt = "bg-header";

  // Build the structure
  picture.appendChild(sourceMobile);
  picture.appendChild(img);
  backgroundElement.appendChild(picture);

  // Find the target container and insert the background element at the beginning
  const wishesFormWrapper = document.querySelector(".wishes-section");
  if (wishesFormWrapper) {
    wishesFormWrapper.insertBefore(
      backgroundElement,
      wishesFormWrapper.firstChild,
    );
  }
} else if (
  siteName === "iwanjennifer.menujuakad.com" ||
  siteName.includes("iwanjennifer.menujuakad.com")
) {
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.name = "address";
      emailInput.placeholder =
        "Dietary Restrictions/Allergies (e.g. vegetarian, vegan, no seafood, no beef)";
    }

    const dateContainers = document.querySelectorAll(".date");

    // Loop through each date container
    dateContainers.forEach((dateContainer) => {
      // Get the h5 element containing the day number
      const dayElement = dateContainer.querySelector("h5");

      if (dayElement) {
        // Store the original day number and remove any leading zeros
        const dayNumber = dayElement.textContent.trim().replace(/^0+/, "");

        // Update the content with superscript and font size
        dayElement.innerHTML = `${dayNumber}<sup style="font-size: 18px;">th</sup>`;
        dayElement.style.fontSize = "30px";
      }
    });
  });
} else if (siteName === "laurenedgar.menujuakad.com") {
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.name = "address";
      emailInput.type = "text";
      emailInput.placeholder =
        "Dietary Restrictions/Allergies (e.g. vegetarian, vegan, no seafood, no beef)";
    }
    const dateContainers = document.querySelectorAll(".date");

    // Loop through each date container
    dateContainers.forEach((dateContainer) => {
      // Get the h5 element containing the day number
      const dayElement = dateContainer.querySelector("h5");

      if (dayElement) {
        // Store the original day number
        const dayNumber = dayElement.textContent.trim();

        // Update the content with superscript and font size
        dayElement.innerHTML = `${dayNumber} <sup style="font-size: 36px;">th</sup>`;
        //dayElement.style.fontSize = '30px';
      }
    });

    const venue = document.querySelector(".venue-content");

    if (venue) {
      const events = venue.querySelectorAll(".card");

      events.forEach((event) => {
        const dateDiv = event.querySelector(".event-name .date");
        if (dateDiv) {
          const timePTags = dateDiv.querySelectorAll("p");
          const lastTimePTag = timePTags[timePTags.length - 1];

          if (lastTimePTag) {
            const fullText = lastTimePTag.textContent;
            // Find the time pattern (like 17:30) and keep only that
            const timeMatch = fullText.match(/\d{1,2}:\d{2}/);
            if (timeMatch) {
              lastTimePTag.textContent = timeMatch[0];
            }
          }
        }

        const images = event.querySelectorAll(".event-place img");
        if (images.length > 0) {
          const eventNameWrap = event.querySelector(".event-name");
          const h4Element = eventNameWrap.querySelector("h4");

          if (h4Element) {
            // Insert the image after the h4 element
            h4Element.parentNode.insertBefore(images[0], h4Element.nextSibling);
          }
        }
      });
    }

    // Find the specific paragraph in the form group
    const formGroup = document.querySelector(".multiple-event-wrapper");
    if (formGroup) {
      const eventParagraph = formGroup.querySelector("p.mb-1");
      if (eventParagraph) {
        eventParagraph.textContent = "Choose an Event to Attend:";
      }
    }
  });
}
