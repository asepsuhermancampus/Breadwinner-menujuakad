$(() => {
  // countdown js
  const date = $("#countdown").attr("date");
  $("#countdown").countdown({
    date: date,
  });

  // autoscroll js
  $("#wishes_wrapper").infiniteslide({
    speed: 50,
    direction: "up",
  });
});


const qselect = (element, elements = false) => {
  if (elements === false) { //single element
    return document.querySelector(element)
  } else { //all elements
    return document.querySelectorAll(element)
  }
}

const getBody = qselect('body')

getBody.style.overflowY = "hidden"

// ios detection
const iOSversion = () => {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
}

const iosVer = iOSversion()
console.log(iosVer)
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
      element.setAttribute('slot', 'fixed');
    }

    console.log("U are using old iphone, go buy the new one. Or if u don't have money buy an android instead. It's cheaper & more powerful")
  }
} else {
  console.log("Not IOS")
}

const musicControl = qselect("#musicControl")
const playPauseIcon = qselect("#playPause")
const bgMusic = qselect("audio")

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
      playPauseIcon.classList.replace('icofont-music-alt', 'icofont-ui-pause')
    } else {
      bgMusicPlay(false)
      playPauseIcon.classList.replace('icofont-ui-pause', 'icofont-music-alt')
    }
  })
}

document.onreadystatechange = () => {

  if (document.readyState === 'complete') {

    AOS.init();

    $("#status").fadeOut();
    $("#preloader").delay(350).fadeOut("slow");

    if (document.querySelector(".loader-wrapper")) {
      document.querySelector(".loader-wrapper").style.visibility = "hidden";
    }

    window.scrollTo(0, 0)

    if (bgMusic) { bgMusic.load() }

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
        AOS.refresh()
      })
    } else {
      getBody.style.overflowY = "auto"
      bgMusicPlay()
    }

    // hide and show angpao form
    const btnOpenAngpao = document.querySelector("#openAngpao")
    const formAngpao = document.querySelector("#formGift")

    if (btnOpenAngpao) {
      btnOpenAngpao.addEventListener('click', () => {
        formAngpao.classList.remove("d-none")
        btnOpenAngpao.classList.add("d-none")
        AOS.refresh();
      })
    }

    const lightboxs = document.querySelector('#lightboxGallery.default-gallery')

    if (lightboxs) {
      lightGallery(lightboxs, {
        thumbnail: true,
        hash: true,
        download: false
      });
    }
  }
}

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
