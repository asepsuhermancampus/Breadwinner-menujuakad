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

document.body.classList.add("block-scroll");
disableScrollIOS();

document.querySelector("#btn-envelope").addEventListener("click", () => {
  document.body.classList.remove("block-scroll");
  enableScrollIOS();

  document.querySelector(".cover-section").classList.add("cover-opened");

  bgMusicPlay();
  runAnimationOrnament();
  runAnimationLoop();
  forcePlayVideo();
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

const rsvpAmountGuestSelect = document.querySelector(
  ".rsvp-section form select[name='jumlah']",
);
if (rsvpAmountGuestSelect) rsvpAmountGuestSelect.classList.add("form-select");

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

const fontFix = () => {
  const fonts = ["BrittanySignature"];

  document.querySelectorAll("h1,h2,h3,h4,p,span").forEach((e) => {
    if (fonts.includes(getComputedStyle(e).getPropertyValue("font-family"))) {
      e.style.lineHeight = 2;
    }
  });
};

const siteName = document
  .querySelector('meta[property="og:site_name"]')
  ?.getAttribute("content");

if (siteName === "ourdylightfulday.menujuakad.com") {
  const params = new URLSearchParams(window.location.search);

  const eventName = params.get("event");
  const venueSection = document.querySelector(".venue-section");
  if (eventName === "Wedding Ceremony") {
    const pTag = venueSection.querySelectorAll(".card .event-name p");
    pTag[pTag.length - 1].remove();
  }
} else if (siteName === "nindyridhwan.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const events = venueSection.querySelectorAll(".venue-content .card");

  events.forEach((event) => {
    const eventName = event.querySelector(".event-name h4").textContent;

    if (eventName === " Akad Nikah") {
      const pTag = event.querySelectorAll(".event-name p");
      pTag[pTag.length - 1].remove();
      const eventPlace = event.querySelector(".event-place");
      eventPlace.remove();
    }
  });
} else if (siteName === "vichatito.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const events = venueSection.querySelectorAll(".venue-content .card");

  events.forEach((event) => {
    const day = event.querySelector(".event-name p");
    const eventName = event.querySelector(".event-name h4").textContent.trim();

    if (eventName === "Akad Nikah") {
      event.querySelector(".event-place").remove();
    }

    if (day.textContent === "Jumat") {
      day.textContent = "Jum'at";
    }

    day.style.fontSize = "28px";
  });
} else if (siteName === "avilarie.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const events = venueSection.querySelectorAll(".venue-content .card");

  events.forEach((event) => {
    const eventName = event.querySelector(".event-name h4").textContent.trim();

    if (eventName === "Resepsi Pernikahan") {
      event.querySelector(".event-name h4").remove();
    }
  });

  const coupleSection = document.querySelector(".couple-section");
  if (coupleSection) {
    coupleSection.querySelector(".image-wrapper").remove();
  }

  const rsvpSection = document.querySelector(".rsvp-section");
  if (rsvpSection) {
    rsvpSection.querySelector(".image-wrapper").parentElement.remove();
  }
} else if (siteName === "everlastyngwiethnami.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const events = venueSection.querySelectorAll(".venue-content .card");

  events.forEach((event) => {
    const day = event.querySelector(".event-name p");
    const eventName = event.querySelector(".event-name h4").textContent.trim();

    if (eventName === "Akad Nikah") {
      event.querySelector(".event-place").remove();
    }
  });
} else if (
  siteName === "edueki.menujuakad.com" ||
  siteName === "mendapatilhameraihasa.menujuakad.com"
) {
  const rsvp = document.querySelector(".rsvp-section");

  if (rsvp) {
    const imageBg = rsvp.querySelector(".image-wrapper");
    if (imageBg) imageBg.parentElement.remove();
  }
} else if (siteName === "azkadanfaisal.menujuakad.com") {
  // Change the placeholder text
  document.querySelector('textarea[name="comment"]').placeholder =
    "Tulis harapan saudara/saudari";
}

function forcePlayVideo() {
  try {
    const video = document.querySelector(".background-video video");
    if (video) video.play();
  } catch (error) {
    console.error(error);
  }
}
