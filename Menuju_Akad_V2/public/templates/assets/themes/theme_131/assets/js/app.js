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

const coupleNames = document.querySelectorAll(
  ".couple-section .couple .couple-description h3",
);
coupleNames.forEach((name) => {
  name.dataset.anim = "zoom-out";
});

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

  bgMusicPlay();
  runAnimationOrnament();
  runAnimationLoop();
});

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
  onUpdate: (self) => (progress.style.transform = `${self.progress}`),
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

const statusRsvpSelect = document.querySelector(
  ".rsvp-section form select[name='status']",
);
if (statusRsvpSelect) {
  statusRsvpSelect.removeAttribute("data-anim");
  statusRsvpSelect.parentElement.dataset.anim = "zoom-in-up";
  statusRsvpSelect.parentElement.dataset.animDelay = "500";
}

const getLoadedIframe = (ifr) => {
  return new Promise((resolve, reject) => {
    ifr.onload = () => resolve("maps loaded!");
    ifr.onerror = () =>
      reject("Iframe Load Failed: Please Check Again Your URL!");
    ifr.src = ifr.dataset.src;
  });
};

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
          da.style.animationDuration = da.dataset.animDuration;

        if (da.dataset.animDelay) {
          setTimeout(() => {
            da.classList.add("has-animate");
            da.classList.remove("animation-invisible");
            da.dataset.loadAnimation = true;
          }, da.dataset.animDelay);
        } else {
          da.classList.add("has-animate");
          da.classList.remove("animation-invisible");
          da.dataset.loadAnimation = true;
        }
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

try {
  const headersTree = document.querySelectorAll(
    ".header-section img[alt='tree-2']",
  );
  headersTree.forEach((element) => {
    element.removeAttribute("data-anim");
  });

  const rsvpWrap = document.querySelector(".rsvp-section .rsvp-wrapper");
  if (rsvpWrap) {
    rsvpWrap.querySelectorAll("img[alt='tree-2']").forEach((element) => {
      element.removeAttribute("data-anim");
    });

    rsvpWrap
      .querySelectorAll(".town-1 .image-element, .town-2 .image-element")
      .forEach((element) => {
        element.removeAttribute("data-anim");
      });
  }
} catch (error) {
  console.error(error);
}

const siteName = document
  .querySelector('meta[property="og:site_name"]')
  ?.getAttribute("content");

if (siteName === "ainagilang.menujuakad.com") {
  const nameCover = document.querySelector(".cover-section h1.title");
  const nameHeader = document.querySelector(".header-section h1.title");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const eventParam = urlParams.get("event");

  if (eventParam === "Resepsi Pernikahan") {
    nameCover.textContent = "Gilang & Aina";
    nameHeader.innerHTML = "Gilang <span>&</span> Aina";

    const coupleRow = document.querySelector(
      ".couple-section .couple-container .row",
    );
    coupleRow.classList.add("flex-md-row-reverse", "flex-column-reverse");
  }
} else if (siteName === "officialleyfarels.menujuakad.com") {
  const streamParent = document.querySelector(".stream-section");
  const streamDesc = streamParent.querySelector(".stream-description");

  const newChild = document.createElement("div");
  newChild.classList.add("col-12", "position-relative", "mt-4");
  newChild.innerHTML = `
		<div class="ratio ratio-16x9">
			<iframe width="560" height="315" src="https://www.youtube.com/embed/IKFuu4dm3ZI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
		</div>
		<a href="https://youtu.be/IKFuu4dm3ZI" target="_blank" class="btn btn-custom color-secondary mt-3">Join Live Youtube</a>
	`;

  streamDesc.appendChild(newChild);
} else if (siteName === "dikefebri.menujuakad.com") {
  const url = new URLSearchParams(window.location.search);
  const event = url.get("event");

  if (event === "Wedding Event") {
    const events = document.querySelectorAll(
      ".venue-section .venue-content .card",
    );
    events.forEach((event) => {
      event.querySelector(".event-place").remove();
    });
  }
} else if (siteName === "theweddingof-taufikrika.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  if (venueSection) {
    const events = venueSection.querySelectorAll(".venue-content .card");
    events.forEach((el) => {
      const eventName = el.querySelector(".event-name h4").textContent;
      if (eventName === "Akad") {
        const pTag = el.querySelectorAll(".event-name p");
        pTag[pTag.length - 1].textContent = "14:00 WIB - Selesai";
      }
      if (eventName === "Resepsi Pernikahan") {
        const pTag = el.querySelectorAll(".event-name p");
        pTag[pTag.length - 1].textContent = "10:00 WIB - Selesai";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.querySelector('select[name="status"]');
    if (selectElement) {
      const firstOption = selectElement.options[0];
      if (firstOption && firstOption.disabled && firstOption.selected) {
        firstOption.textContent = "Konfirmasi Kehadiran (Resepsi)";
      }
    }
  });
} else if (siteName === "pengajianamara.menujuakad.com") {
  function updateTimeFormat() {
    const timeElements = document.querySelectorAll("p");

    timeElements.forEach((element) => {
      let text = element.textContent;
      // Gunakan regex untuk pattern yang lebih spesifik
      text = text.replace(/(09:30)\s*-\s*Selesai\s*/, "$1 WIB - Selesai");
      element.textContent = text;
    });
  }

  // Multiple execution untuk memastikan
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(updateTimeFormat, 100);
    setTimeout(updateTimeFormat, 500);
  });
} else if (siteName === "almauritsrohma.menujuakad.com") {
  const coverDesc = document.querySelector(".cover-section .cover-description");
  const greeting = coverDesc.querySelector(".greeting-wrapper");
  if (greeting)
    coverDesc.insertBefore(
      greeting,
      coverDesc.querySelector(".elements-widget"),
    );
}
