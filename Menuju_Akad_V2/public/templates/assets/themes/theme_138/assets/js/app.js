gsap.registerPlugin(ScrollTrigger, Flip);

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

const ribbon = document.querySelectorAll(
  ".venue-section .venue-wrapper .venue-content .ribbon-venue",
);
ribbon.forEach((r) => r.classList.add("color__button__trans"));

const eventCards = document.querySelectorAll(
  ".venue-section .venue-wrapper .venue-content .card",
);
eventCards.forEach((event) => event.classList.add("color__button__trans"));

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  if (!button.classList.contains("btn-secondary"))
    button.classList.add("color-secondary");
});

window.scrollTo(0, 0);

$("body").css("overflow", "hidden");
disableScrollIOS();

$("#btn-envelope").on("click", function () {
  $("body").css("overflow", "auto");

  $(".logo-viding").addClass("custom-position");

  $(".cover-section").addClass("cover-opened");

  runAnimationOrnament();
  runAnimationLoop();
  bgMusicPlay();
  forcePlayVideo();
  enableScrollIOS();

  setTimeout(() => {
    $(".cover-section").hide();

    if (typeof playYt === "function") {
      playYt();
    } else {
      console.warn("function playYt not found");
    }

    ScrollTrigger?.refresh();
  }, 1200);
});

var previousScroll = 70;
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

const cd = document.querySelector(".countdown").getAttribute("date");

Countdown(cd);

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

if (document.querySelectorAll("[data-anim]")) {
  document.querySelectorAll("[data-anim]").forEach((ada) => {
    ada.classList.add("animation-invisible");
  });
}

ScrollTrigger.create({
  trigger: ".venue-section",
  start: "top bottom",
  onEnter: () => ScrollTrigger.refresh(),
});

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

const getLoadedIframe = (ifr) => {
  return new Promise((resolve, reject) => {
    ifr.onload = () => resolve("maps loaded!");
    ifr.onerror = () =>
      reject("Iframe Load Failed: Please Check Again Your URL!");
    ifr.src = ifr.dataset.src;
  });
};

// Modal Event Handler
window.onload = function () {
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
    gallery: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      easing: "ease-in-out",
    },
  });
}

const coupleDesc = document.querySelectorAll(
  ".couple-section .couple-description",
);
coupleDesc.forEach((element) => element.classList.add("color-primary"));

const formValidation = () => {
  const form = document.querySelectorAll("form");
  const mailPattern =
    /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

  form.forEach((f) => {
    const input = f.querySelectorAll("input");

    input.forEach((inp) => {
      inp.addEventListener("change", () => {
        switch (inp.type) {
          case "email":
            if (inp.value.match(mailPattern)) {
              f.querySelector("button").disabled = false;
              inp.classList.remove("is-invalid");
            } else {
              f.querySelector("button").disabled = true;
              inp.classList.add("is-invalid");
            }
            break;

          case "number":
            if (isNaN(inp.value)) {
              f.querySelector("button").disabled = true;
              inp.classList.add("is-invalid");
              console.log("in-valid", inp.value);
            } else {
              f.querySelector("button").disabled = false;
              inp.classList.remove("is-invalid");
              console.log("valid", inp.value);
            }
            break;

          default:
            break;
        }
      });
    });
  });
};

formValidation();

const coupleNoImage = document.querySelector(
  ".couple-section .couple.no-image",
);
if (coupleNoImage) {
  const and = document.createElement("div");
  and.classList.add("and");
  and.innerHTML = `<span>&</span>`;

  coupleNoImage.parentElement.parentElement.insertBefore(
    and,
    coupleNoImage.parentElement.nextElementSibling,
  );
}

const siteName = document
  .querySelector('meta[property="og:site_name"]')
  ?.getAttribute("content");

if (siteName === "indira-wardana.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const cards = venueSection.querySelectorAll(".card");
  cards.forEach((el) => {
    const eventName = el.querySelector(".event-name h4")?.textContent;
    if (eventName === "Akad nikah") {
      const eventPlaceEl = el.querySelector(".event-place");
      eventPlaceEl.classList.add("d-none");
    } else if (eventName === "Resepsi") {
      el.querySelector(".ribbon-venue").classList.add("d-none");
    }
  });
} else if (siteName === "jevon-jocelyn.menujuakad.com") {
  const streamParent = document.querySelector(".stream-section");
  streamParent.querySelector(".container").classList.add("container-custom");
} else if (siteName === "openhousenovoteltangerangxfinestpaketan.menujuakad.com") {
  const parent = document.querySelector(
    ".venue-section .venue-wrapper .venue-content",
  );
  const events = parent.querySelectorAll(
    ".col-md-6.col-lg-12.position-relative",
  );

  for (let index = 0; index < events.length; index++) {
    if (index !== 0) {
      events[index].remove();
    }
  }
} else if (siteName === "rumahnyacozy.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const cards = venueSection.querySelectorAll(".card");
  cards.forEach((el) => {
    const eventName = el.querySelector(".event-name h4")?.textContent;
    if (eventName === "Wedding Reception") {
      const pTag = el.querySelectorAll(".event-name .date p");
      pTag[pTag.length - 1].textContent = "11am - 2pm";
    }
  });
} else if (siteName === "vinvan.menujuakad.com") {
  const galleryParent = document.querySelector(
    ".gallery-section .row#gallery-1",
  );
  const galleries = galleryParent.querySelectorAll(
    ".col-6.col-md-4.col-lg-4.p-2",
  );

  galleries.forEach((el) => {
    el.classList.remove("col-md-4", "col-lg-4");
  });
} else if (siteName === "salsasurya.menujuakad.com") {
  const formWishes = document.querySelector(".wishes-section form");
  const textarea = formWishes.querySelector("textarea");
  textarea.setAttribute("placeholder", "Ucapan");
} else if (siteName === "mumtazpangeran.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const cards = venueSection.querySelectorAll(".card");
  cards.forEach((el) => {
    const eventName = el.querySelector(".event-name h4")?.textContent;
    const pTag = el.querySelectorAll(".event-name .date p");
    const teks = pTag[pTag.length - 1].textContent;
    const teksBaru = teks.split(" ").filter((t) => t !== "" && t !== "\n");

    if (
      teksBaru[teksBaru.length - 1] === "End\n" ||
      teksBaru[teksBaru.length - 1] === "End"
    ) {
      pTag[pTag.length - 1].textContent = `${teksBaru[0]}`;
    }

    const date = el.querySelector(".event-name .date > span");
    const dateContent = date.textContent.split(" ");
    const firtsIndex = dateContent.shift();

    dateContent.push(firtsIndex);

    date.innerHTML = `${dateContent[0]} ${dateContent[1]}, <br> ${dateContent[2].replace(",", "")}`;
  });

  const guestInputRsvp = document.querySelector(
    ".rsvp-section form select[name='jumlah']",
  );
  if (guestInputRsvp)
    guestInputRsvp.querySelectorAll("option")[0].textContent =
      "Number of Guests";
} else if (siteName === "fortunatewithsarah.menujuakad.com") {
  const buttonCover = document.querySelector(
    ".cover-section .cover-wrapper .cover-content .elements-widget .btn-custom strong",
  );
  if (buttonCover) buttonCover.textContent = "You're invited, get excited!";
} else if (siteName === "quinaradi.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  if (venueSection) {
    const rowVenue = venueSection.querySelector(".row-venue");
    rowVenue.classList.remove("row-venue");

    const cards = venueSection.querySelectorAll(".card");
    cards.forEach((el) => {
      const eventName = el.querySelector(".event-name h4")?.textContent.trim();
      if (eventName === "Akad") {
        const eventPlace = el.querySelector(".event-place");
        eventPlace.remove();
      }
    });
  }
} else if (siteName === "theweddingof-fandygivani.menujuakad.com") {
  function resetPlayer() {
    // Hancurkan player yang ada
    if (player2) {
      console.log(player2);
      player2.destroy();
    }

    // Membuat ulang instance player
    player2 = new YT.Player("player", {
      height: "390",
      width: "640",
      videoId: "MmveQsPlgRA", // Ganti dengan video ID yang diinginkan
      events: {
        onStateChange: onLivestreamStateChange,
      },
    });
  }

  function onLivestreamStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      player2.playVideo(); // Memulai ulang video
    }
  }

  window.playYt = function () {
    const iframeYt = document.querySelector(
      ".stream-section .stream-wrapper iframe",
    );

    if (iframeYt) {
      ScrollTrigger.create({
        trigger: iframeYt,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            if (player2) {
              player2.playVideo();
              player2.mute();
            }
            // setTimeout(()=>bgMusicPlay(), 500);
          }
        },
      });
    }
  };

  const btnOpenGift = document.querySelector(
    ".egift-section .gift-wrap .angpao button#openAngpao",
  );
  if (btnOpenGift) {
    btnOpenGift.innerHTML = `
		<span>Send Gift</span> <svg width="25" height="25" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.625 12.1094L11.3906 12.1094C10.8594 11.2734 10.5469 10.2813 10.5469 9.21875C10.5469 6.2461 12.9648 3.82813 15.9375 3.82813C17.5547 3.82813 19.0117 4.54688 20 5.67969C20.9883 4.54688 22.4453 3.82813 24.0625 3.82813C27.0352 3.82813 29.4531 6.24609 29.4531 9.21875C29.4531 10.2813 29.1445 11.2734 28.6094 12.1094L34.375 12.1094C35.0664 12.1094 35.625 12.668 35.625 13.3594L35.625 21.1719C35.625 21.3438 35.4844 21.4844 35.3125 21.4844L33.75 21.4844L33.75 34.9219C33.75 35.6133 33.1914 36.1719 32.5 36.1719L7.5 36.1719C6.8086 36.1719 6.25 35.6133 6.25 34.9219L6.25 21.4844L4.6875 21.4844C4.51563 21.4844 4.375 21.3438 4.375 21.1719L4.375 13.3594C4.375 12.668 4.93359 12.1094 5.625 12.1094ZM18.6719 9.21875C18.6719 7.71094 17.4453 6.48438 15.9375 6.48438C14.4297 6.48438 13.2031 7.71094 13.2031 9.21875C13.2031 10.7266 14.4297 11.9531 15.9375 11.9531L18.6719 11.9531L18.6719 9.21875ZM24.0625 6.48438C22.5547 6.48438 21.3281 7.71094 21.3281 9.21875L21.3281 11.9531L24.0625 11.9531C25.5703 11.9531 26.7969 10.7266 26.7969 9.21875C26.7969 7.71094 25.5703 6.48438 24.0625 6.48438ZM32.9688 18.8281L32.9688 14.7656L21.3281 14.7656L21.3281 18.8281L32.9688 18.8281ZM31.0938 21.4844L21.3281 21.4844L21.3281 33.5156L31.0938 33.5156L31.0938 21.4844ZM8.90625 33.5156L18.6719 33.5156L18.6719 21.4844L8.90625 21.4844L8.90625 33.5156ZM7.03125 18.8281L18.6719 18.8281L18.6719 14.7656L7.03125 14.7656L7.03125 18.8281Z" fill="#F9FDF9"></path></svg>
		`;
  }
} else if (siteName === "rickytalithawed.menujuakad.com") {
  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/rickytalithawed.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "korbanperasaan.menujuakad.com") {
  const reminderBtn = document.querySelector(
    ".reminder-wrap .reminder-content .btn-reminder",
  );
  if (reminderBtn) {
    const href = reminderBtn.href;
    const url = new URL(href);

    url.searchParams.set("text", "Brisia Jodie’s special Showcase");

    reminderBtn.href = url.toString();
  }
} else if (siteName === "gorjess.menujuakad.com") {
  const reminderBtn = document.querySelector(
    ".reminder-wrap .reminder-content .btn-reminder",
  );
  if (reminderBtn) {
    const href = reminderBtn.href;
    const url = new URL(href);

    url.searchParams.set("text", "The Wedding of Igor & Jessica");

    reminderBtn.href = url.toString();
  }
} else if (siteName === "glendakevin.menujuakad.com") {
  const venueSection = document.querySelector(".venue-section");
  const cards = venueSection.querySelectorAll(".card");
  cards.forEach((el) => {
    const eventName = el.querySelector(".event-name h4")?.textContent.trim();
    if (eventName === "Akad Nikah") {
      el.querySelector(".event-place").remove();
    } else if (eventName === "Wedding Reception") {
      el.querySelector(".ribbon-venue").remove();
    }
  });
} else if (siteName === "a-m-toinfinityandbeyond.menujuakad.com") {
  const coverDesc = document.querySelector(
    ".cover-section .cover-wrapper .cover-description",
  );
  const descEl = coverDesc.querySelectorAll(".position-relative p");
  const btnWrapCover = coverDesc.querySelector(".elements-widget");
  console.log(descEl[descEl.length - 1]);

  btnWrapCover.insertBefore(descEl[descEl.length - 1], btnWrapCover.firstChild);
} else if (siteName === "ferryjennifer.menujuakad.com") {
  const gallery = document.querySelector(".gallery-section");
  if (gallery) {
    const newEl = document.createElement("div");
    newEl.classList.add("title-section");

    newEl.innerHTML = `<h2>Our Moment</h2>`;

    gallery.insertBefore(newEl, gallery.firstChild);
  }

  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/ferryjennifer.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }

  const btnMap = document.querySelectorAll(
    ".venue-section .venue-content .card .event-place .btn-custom, .modal .btn-custom",
  );

  btnMap.forEach((btn) => (btn.textContent = "Google Maps"));
} else if (siteName === "calvinstefany.menujuakad.com") {
  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/calvinstefany3.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "veldymichelle.menujuakad.com") {
  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/veldymichelle.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }

  const venueSection = document.querySelector(".venue-section");
  const cards = venueSection.querySelectorAll(".card");

  cards.forEach((el) => {
    const eventName = el.querySelector(".event-name h4")?.textContent.trim();
    if (eventName === "Holy Matrimony") {
      el.querySelector(".event-place").remove();
    }
  });
} else if (siteName === "julioamel.menujuakad.com") {
  const parent = document.querySelector(".layout__views");
  const header = parent.querySelector(".header-section");

  const newEl = header.cloneNode(false);
  newEl.innerHTML = `<video id="background-video" loop="" muted="" playsinline="" class="video-main"><source src="/templates/assets/themes/assets/videos/couples/julioamel.mp4" type="video/mp4"></video>`;

  parent.insertBefore(newEl, header);
} else if (siteName === "radotregenveronika.menujuakad.com") {
  const events = document.querySelectorAll(
    ".venue-section .venue-content .card",
  );

  events.forEach((event) => {
    const btn = event.querySelector(".btn-custom");
    btn.textContent = "Click for Direction";
  });
} else if (siteName === "ourdayvalenabahy.menujuakad.com") {
  const events = document.querySelectorAll(
    ".venue-section .venue-content .card",
  );

  events.forEach((event) => {
    const eventName = event.querySelector(".event-name h4")?.textContent.trim();
    if (eventName === "Akad Nikah") {
      event.querySelector(".event-place").remove();
    }
  });
} else if (siteName === "theinnercirclebytsclub.menujuakad.com") {
  const reminderBtn = document.querySelector(
    ".reminder-wrap .reminder-content .btn-reminder",
  );
  if (reminderBtn) {
    const href = reminderBtn.href;
    const url = new URL(href);

    url.searchParams.set("text", "The Commons 3.0: The Inner Circle");

    reminderBtn.href = url.toString();
  }
} else if (siteName === "frandymademefell.menujuakad.com") {
  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/frandyfelisia.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "ajengfadel.menujuakad.com") {
  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/ajengfadel.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "gebyarpernikahanindonesia.menujuakad.com") {
  const rsvpButtonSubmit = document.querySelector(".rsvp-section form button");

  if (rsvpButtonSubmit) rsvpButtonSubmit.textContent = "SUBMIT";

  const coverBtn = document.querySelector(
    ".cover-section .cover-description .btn-custom strong",
  );
  if (coverBtn) coverBtn.textContent = "RSVP Free Ticket";
} else if (siteName === "ivanmonikah.menujuakad.com") {
  const sendAngpao = document.querySelectorAll(".egift-section .angpao button");

  sendAngpao.forEach((btn) => {
    btn.textContent = "Send Angpao";
  });
} else if (siteName === "thomasedrina.menujuakad.com") {
  const coverEvent = document.querySelector(
    ".cover-section .cover-description .cover-event",
  );
  const elWidget = document.querySelector(
    ".cover-section .cover-description .elements-widget",
  );

  if (coverEvent) elWidget.insertBefore(coverEvent, elWidget.firstChild);
} else if (siteName === "vincentandmichelle.com") {
  const greeting = document.querySelector(
    ".cover-section .cover-description .greeting-wrapper",
  );

  if (greeting) {
    const widget = document.querySelector(
      ".cover-section .cover-description .elements-widget",
    );

    widget.insertBefore(greeting, widget.firstChild);
  }
} else if (siteName === "brigaladinner2025.com") {
  // Find the link element
  const calendarLink = document.querySelector('a[href*="calendar/render"]');

  if (calendarLink) {
    // Create a URL object to easily manipulate parameters
    const url = new URL(calendarLink.href);
    const params = new URLSearchParams(url.search);

    // Set the new text parameter
    params.set(
      "text",
      "BRI Appreciation Night : The Night of Infinite Partnership",
    );

    // Update the search part of the URL
    url.search = params.toString();

    // Update the link href
    calendarLink.href = url.toString();

    console.log("Calendar link updated successfully");
  } else {
    console.log("Calendar link not found");
  }
} else if (siteName === "robertuscindy.menujuakad.com") {
  document.addEventListener("DOMContentLoaded", function () {
    // Target cards by their position in the DOM
    const cards = document.querySelectorAll(".venue-content .card");

    // First card (Sakramen Perkawinan)
    if (cards[0]) {
      const timeParagraph = cards[0].querySelector(".date p");
      if (timeParagraph) {
        timeParagraph.textContent = "11:30 WIB - Selesai";
      }
    }

    // Second card (Resepsi Pernikahan)
    if (cards[1]) {
      const timeParagraph = cards[1].querySelector(".date p");
      if (timeParagraph) {
        timeParagraph.textContent = "18:30 WIB - Selesai";
      }
    }
  });
} else if (siteName === "inifilyhanvindy.menujuakad.com") {
  document.querySelectorAll("span").forEach((span) => {
    if (span.textContent === "The Groom") {
      span.textContent = "Mempelai pria";
    } else if (span.textContent === "The Bride") {
      span.textContent = "Mempelai wanita";
    }
  });
} else if (siteName === "bintangruth.menujuakad.com") {
  try {
    const videoUrl =
      "https://viding.sgp1.digitaloceanspaces.com/video/bintangruth.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "leonpenny.menujuakad.com") {
  const greetingElement = document.querySelector(".greeting-name-text");
  greetingElement.className = greetingElement.className
    .replace("left", "")
    .trim();
} else if (
  siteName === "renaldyandnicole.menujuakad.com" ||
  siteName === "theweddingofrn.menujuakad.com"
) {
  document.addEventListener("DOMContentLoaded", function () {
    const titleElements = document.querySelectorAll(".title-couple span");
    console.log("Found elements:", titleElements.length); // Debug line

    titleElements.forEach((element) => {
      const originalText = element.textContent.trim();
      console.log("Processing:", originalText); // Debug line

      if (originalText.startsWith("The")) {
        const thePart = "The";
        const restOfText = originalText.substring(3).trim();
        const roleClass = restOfText.toLowerCase().includes("groom")
          ? "groom"
          : "bride";

        element.innerHTML = `<span class="the-part">${thePart}</span> <span class="${roleClass}-part">${restOfText}</span>`;
        console.log("Updated element"); // Debug line
      }
    });

    // Get the elements
    const firstDiv = document.querySelector(
      ".cover-description > div:first-child",
    );
    const secondDiv = document.querySelector(
      ".cover-description > div:nth-child(2)",
    );

    // Move first div after second div
    secondDiv.insertAdjacentElement("afterend", firstDiv);

    try {
      const videoUrl =
        "https://viding.sgp1.digitaloceanspaces.com/video/renaldyandnicole.mp4";
      changeBgImageToVideo(videoUrl);
    } catch (error) {
      console.error("Gagal mengubah ke video:", error);
    }
  });
} else if (siteName === "officiallyjojo.menujuakad.com") {
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
} else if (siteName === "jodhimelly.menujuakad.com") {
  try {
    const videoUrl =
      "https://viding.sgp1.digitaloceanspaces.com/video/jodhimelly.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "maurarifqi.menujuakad.com") {
  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/maurarifqi.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "farhandewi.menujuakad.com") {
  try {
    const videoUrl =
      "/templates/assets/themes/assets/videos/couples/farhandewi.mp4";
    changeBgImageToVideo(videoUrl);
  } catch (error) {
    console.error("Gagal mengubah ke video:", error);
  }
} else if (siteName === "pweclustertiarawo.menujuakad.com") {
  try {
    const nameRsvp = document.querySelector(
      ".rsvp-section form input[name='name']",
    );
    if (nameRsvp) nameRsvp.placeholder = "Bride & Groom";

    const navbar = document.querySelector("nav.navbar");
    if (navbar) navbar.style.padding = 0;
  } catch (error) {
    console.error(error);
  }
}

(function () {
  const originalAlert = window.alert;
  let video = null;
  let expectPlaying = false;

  function attachVideoListener(el) {
    if (video === el) return; // sudah pernah di-attach
    video = el;
    video.addEventListener("pause", () => {
      if (expectPlaying) {
        video.play().catch((err) => console.warn("Gagal resume video:", err));
      }
    });
  }

  // cek langsung kalau videonya udah ada duluan
  const existing = document.querySelector(
    ".background-element #background-video",
  );
  if (existing) attachVideoListener(existing);

  // pantau DOM kalau videonya ditambahkan belakangan
  const observer = new MutationObserver(() => {
    const found = document.querySelector(
      ".background-element #background-video",
    );
    if (found && found !== video) {
      attachVideoListener(found);
      observer.disconnect();
      console.log(`[CHECK] found:${found} video:${video}`);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.alert = function (msg) {
    if (video) expectPlaying = !video.paused;

    originalAlert(msg);
    console.log(`[ALERT] msg:${msg} expectPlaying:${expectPlaying}`);

    setTimeout(() => {
      expectPlaying = false;
    }, 1000);
  };
})();

function forcePlayVideo() {
  const videos = document.querySelectorAll(
    ".background-element #background-video",
  );

  videos.forEach((video) => {
    video.play().catch((err) => {
      console.log(`Failed play video: ${err}`);
    });

    video.onended = function () {
      this.currentTime = 0;
      this.play();
    };
  });
}

function changeBgImageToVideo(urlVideo) {
  const backgroundFixed = document.querySelector(
    ".main-app .fixed-background .background-element",
  );
  const imageBgSrc = backgroundFixed.querySelector("img").dataset.src;

  backgroundFixed.innerHTML = `
		<video id="background-video" loop="" muted="" playsinline="" poster="${imageBgSrc}" class="video-main"><source src="${urlVideo}" type="video/mp4"></video>
	`;

  const scriptElement = document.createElement("script");

  scriptElement.textContent = `
			document.getElementById('background-video').addEventListener('ended', function() {this.currentTime = 0;this.play();}, false);
        `;

  document.body.appendChild(scriptElement);
}

function changeBgImageToVideoWithoutAutoPlay(urlVideo) {
  const backgroundFixed = document.querySelector(
    ".main-app .fixed-background .background-element",
  );
  const imageBgSrc = backgroundFixed.querySelector("img").dataset.src;

  backgroundFixed.innerHTML = `
		<video id="background-video" loop="" muted="" playsinline="" poster="${imageBgSrc}" class="video-main"><source src="${urlVideo}" type="video/mp4"></video>
	`;

  const scriptElement = document.createElement("script");

  scriptElement.textContent = `
			document.getElementById('background-video').addEventListener('ended', function() {this.currentTime = 0;this.play();}, false);
        `;

  document.body.appendChild(scriptElement);
}
