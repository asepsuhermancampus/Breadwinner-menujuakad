const qselect = (element, elements = false) => {
  if (elements === false) { //single element
    return document.querySelector(element)
  } else { //all elements
    return document.querySelectorAll(element)
  }
}

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

    AOS.init();

    window.scrollTo(0, 0)

    if (document.querySelector(".loader-wrapper")) {
      document.querySelector(".loader-wrapper").style.visibility = "hidden";
    } else {
      qselect(".spanner").classList.remove("show")
    }

    const getBody = qselect('body')
    const containSec = qselect('.containers .section', true);

    setTimeout(() => {
      AOS.refresh();
    }, 1000);

    getBody.style.overflowY = "auto"

    const detectOverflow = () => {
      if (getBody.clientHeight == getBody.scrollHeight) {

        const checking = (cs, c) => {
          if (cs.id == "galleries") {
            return true
          } else if (c == 0) {
            cs.classList.replace('py-5', 'h-100')
          } else {
            cs.classList.add('h-100')
          }
        }

        containSec.forEach(checking)

      } else if (getBody.clientHeight != getBody.scrollHeight) {

        const checking = (cs, c) => {
          if (cs.id == "galleries") {
            return true
          } else if (c == 0) {
            cs.classList.replace('h-100', 'py-5')
          } else {
            cs.classList.remove('h-100')
          }
        }

        containSec.forEach(checking)
      }
    }

    setInterval(() => {
      detectOverflow();
    }, 1000);

    const envelopeSection = qselect('#sectionEnvelope')
    const envelopeBtn = qselect('#closeEnvelope')

    if (envelopeSection) {
      envelopeSection.scrollIntoView();
    }

    if (envelopeBtn) {
      envelopeBtn.addEventListener("click", (event) => {
        envelopeSection.style.transform = "translateY(-100%)";
        getBody.style.overflowY = "auto"
        bgMusicPlay()
      })
    } else {
      getBody.style.overflowY = "auto"
      bgMusicPlay()
    }

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

function sortDom(selectorArray) {
  while (selectorArray.length) {
    let $el = $('.section[data-id="' + selectorArray.pop() + '"]');
    $el.parent().prepend($el);
  }
}

$('iframe, img').on('load', function () {
  AOS.refresh();
  console.log('AOS Refreshed');
});

$(window).on('resize', function () {
  console.log('Window Resized');
  setTimeout(function () {
    AOS.refresh();
  }, 1000);
});

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

const newYear = () => {
  const now = new Date().getTime();
  gap = countDate - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const d = Math.floor(gap / (day));
  const h = Math.floor((gap % (day)) / (hour));
  const m = Math.floor((gap % (hour)) / (minute));
  const s = Math.floor((gap % (minute)) / second);

  if (d >= 0)
    qselect('#day').innerText = d;
  else
    qselect('#day').innerText = '0';
  if (h >= 0)
    qselect('#hour').innerText = h;
  else
    qselect('#hour').innerText = '0';
  if (m >= 0)
    qselect('#minute').innerText = m;
  else
    qselect('#minute').innerText = '0';
  if (s >= 0)
    qselect('#second').innerText = s;
  else
    qselect('#second').innerText = '0';
}

let i = 0;

if (typeof slideSection === "undefined") {
  window.slideSection = qselect('.section', true);
}

const nextSlidetext = () => {
  slideSection[i].classList.remove('d-flex');
  i = (i + 1) % slideSection.length;
  console.log(i);
  slideSection[i].classList.add('d-flex');
  setTimeout(() => {
    AOS.refresh()
  }, 1000)
}

const prevSlideText = () => {
  slideSection[i].classList.remove('d-flex');
  i = (i - 1 + slideSection.length) % slideSection.length;
  slideSection[i].classList.add('d-flex');
  setTimeout(() => {
    AOS.refresh()
  }, 1000)
}

document.addEventListener("DOMContentLoaded", () => {

  const btnOpenAngpao = document.querySelector("#openAngpao")
  const formAngpao = document.querySelector("#formGift")

  if (btnOpenAngpao) {
    btnOpenAngpao.addEventListener('click', () => {
      formAngpao.classList.remove("d-none")
      btnOpenAngpao.classList.add("d-none")
      AOS.refresh()
    })
  }

  setInterval(() => {
    newYear();
  }, 1000);
})

$('.translate-btn').on('click', function () {
  lang = $(this).data('lang');
  changeLanguageByButtonClick(lang);
});

function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'viding' }, 'google_translate_element');
}

function changeLanguageByButtonClick(lang) {
  // var language = document.getElementById("language").value;
  var selectField = document.querySelector("#google_translate_element select");
  for (var i = 0; i < selectField.children.length; i++) {
    var option = selectField.children[i];
    // find desired langauge and change the former language of the hidden selection-field
    if (option.value == lang) {
      selectField.selectedIndex = i;
      // trigger change event afterwards to make google-lib translate this side
      selectField.dispatchEvent(new Event('change'));
      break;
    }
  }
}

function reset_translation() {
  $('.goog-te-banner-frame').contents().find('#\\:1\\.restore').click();
}
