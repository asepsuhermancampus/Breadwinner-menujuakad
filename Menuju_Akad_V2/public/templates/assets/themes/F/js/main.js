// ;(function () {
//
// 	'use strict';
//
// 	var mobileMenuOutsideClick = function() {
//
// 		$(document).click(function (e) {
// 	    var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
// 	    if (!container.is(e.target) && container.has(e.target).length === 0) {
//
// 	    	if ( $('body').hasClass('offcanvas') ) {
//
//     			$('body').removeClass('offcanvas');
//     			$('.js-fh5co-nav-toggle').removeClass('active');
// 	    	}
// 	    }
// 		});
//
// 	};
//
//
// 	var offcanvasMenu = function() {
//
// 		$('#page').prepend('<div id="fh5co-offcanvas" />');
// 		$('#page').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
// 		var clone1 = $('.menu-1 > ul').clone();
// 		$('#fh5co-offcanvas').append(clone1);
// 		var clone2 = $('.menu-2 > ul').clone();
// 		$('#fh5co-offcanvas').append(clone2);
//
// 		$('#fh5co-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
// 		$('#fh5co-offcanvas')
// 			.find('li')
// 			.removeClass('has-dropdown');
//
// 		// Hover dropdown menu on mobile
// 		$('.offcanvas-has-dropdown').mouseenter(function(){
// 			var $this = $(this);
//
// 			$this
// 				.addClass('active')
// 				.find('ul')
// 				.slideDown(500, 'easeOutExpo');
// 		}).mouseleave(function(){
//
// 			var $this = $(this);
// 			$this
// 				.removeClass('active')
// 				.find('ul')
// 				.slideUp(500, 'easeOutExpo');
// 		});
//
//
// 		$(window).resize(function(){
//
// 			if ( $('body').hasClass('offcanvas') ) {
//
//     			$('body').removeClass('offcanvas');
//     			$('.js-fh5co-nav-toggle').removeClass('active');
//
// 	    	}
// 		});
// 	};
//
//
// 	var burgerMenu = function() {
//
// 		$('body').on('click', '.js-fh5co-nav-toggle', function(event){
// 			var $this = $(this);
//
//
// 			if ( $('body').hasClass('overflow offcanvas') ) {
// 				$('body').removeClass('overflow offcanvas');
// 			} else {
// 				$('body').addClass('overflow offcanvas');
// 			}
// 			$this.toggleClass('active');
// 			event.preventDefault();
//
// 		});
// 	};
//
//
//
// 	// var contentWayPoint = function() {
// 	// 	var i = 0;
// 	// 	$('.animate-box').waypoint( function( direction ) {
//
// 	// 		if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
//
// 	// 			i++;
//
// 	// 			$(this.element).addClass('item-animate');
// 	// 			setTimeout(function(){
//
// 	// 				$('body .animate-box.item-animate').each(function(k){
// 	// 					var el = $(this);
// 	// 					setTimeout( function () {
// 	// 						var effect = el.data('animate-effect');
// 	// 						if ( effect === 'fadeIn') {
// 	// 							el.addClass('fadeIn animated-fast');
// 	// 						} else if ( effect === 'fadeInLeft') {
// 	// 							el.addClass('fadeInLeft animated-fast');
// 	// 						} else if ( effect === 'fadeInRight') {
// 	// 							el.addClass('fadeInRight animated-fast');
// 	// 						} else {
// 	// 							el.addClass('fadeInUp animated-fast');
// 	// 						}
//
// 	// 						el.removeClass('item-animate');
// 	// 					},  k * 200, 'easeInOutExpo' );
// 	// 				});
//
// 	// 			}, 100);
//
// 	// 		}
//
// 	// 	} , { offset: '85%' } );
// 	// };
//
//
// 	var dropdown = function() {
//
// 		$('.has-dropdown').mouseenter(function(){
//
// 			var $this = $(this);
// 			$this
// 				.find('.dropdown')
// 				.css('display', 'block')
// 				.addClass('animated-fast fadeInUpMenu');
//
// 		}).mouseleave(function(){
// 			var $this = $(this);
//
// 			$this
// 				.find('.dropdown')
// 				.css('display', 'none')
// 				.removeClass('animated-fast fadeInUpMenu');
// 		});
//
// 	};
//
//
// 	var testimonialCarousel = function(){
// 		var owl = $('.owl-carousel-fullwidth');
// 		owl.owlCarousel({
// 			items: 1,
// 			loop: true,
// 			margin: 0,
// 			responsiveClass: true,
// 			nav: false,
// 			dots: true,
// 			smartSpeed: 800,
// 			autoHeight: true,
// 		});
// 	};
//
//
// 	var goToTop = function() {
//
// 		$('.js-gotop').on('click', function(event){
//
// 			event.preventDefault();
//
// 			$('html, body').animate({
// 				scrollTop: $('html').offset().top
// 			}, 500, 'easeInOutExpo');
//
// 			return false;
// 		});
//
// 		$(window).scroll(function(){
//
// 			var $win = $(window);
// 			if ($win.scrollTop() > 200) {
// 				$('.js-top').addClass('active');
// 			} else {
// 				$('.js-top').removeClass('active');
// 			}
//
// 		});
//
// 	};
//
//
// 	// Loading page
// 	var loaderPage = function() {
// 		$(".fh5co-loader").fadeOut("slow");
// 	};
//
// 	var counter = function() {
// 		$('.js-counter').countTo({
// 			 formatter: function (value, options) {
// 	      return value.toFixed(options.decimals);
// 	    },
// 		});
// 	};
//
// 	var counterWayPoint = function() {
// 		if ($('#fh5co-counter').length > 0 ) {
// 			$('#fh5co-counter').waypoint( function( direction ) {
//
// 				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
// 					setTimeout( counter , 400);
// 					$(this.element).addClass('animated');
// 				}
// 			} , { offset: '90%' } );
// 		}
// 	};
//
// 	// Parallax
// 	var parallax = function() {
// 		$(window).stellar();
// 	};
//
//
// 	$(function(){
// 		mobileMenuOutsideClick();
// 		parallax();
// 		offcanvasMenu();
// 		burgerMenu();
// 		// contentWayPoint();
// 		dropdown();
// 		testimonialCarousel();
// 		goToTop();
// 		loaderPage();
// 		counter();
// 		counterWayPoint();
// 	});
//
// 	// $(document).scroll(function(){
// 	// 	$('.navbar').toggleClass('scrolled', $(this).scrollTop() > $('.navbar').height())
// 	// });
//
// }());

const qselect = (element, elements = false) => {
	if (elements === false) { //single element
		return document.querySelector(element)
	} else { //all elements
		return document.querySelectorAll(element)
	}
}

const getBody = qselect('body')

getBody.style.overflowY = "hidden"

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

		if (document.querySelector(".loader-wrapper")) {
			document.querySelector(".loader-wrapper").style.visibility = "hidden";
		} else {
			qselect(".spanner").classList.remove("show")
		}

		qselect('#sectionEnvelope').scrollIntoView();
		// window.scrollTo(0,0)

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

		// $(document).scroll(function(){
		// 	$('.navbar').toggleClass('scrolled', $(this).scrollTop() > $('.navbar').height())
		// });

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

qselect('#sectionEnvelope').scrollIntoView();

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

	const lightboxs = document.querySelector('#lightboxGallery.default-gallery')

	if (lightboxs) {
		lightGallery(lightboxs, {
			thumbnail: true,
			hash: true,
			download: false
		});
	}

	setInterval(() => {
		newYear();
	}, 1000);

})

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
