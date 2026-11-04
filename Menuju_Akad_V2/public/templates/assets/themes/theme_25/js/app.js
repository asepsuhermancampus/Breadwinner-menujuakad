//music
const musicControl = $("#musicControl")
const playPauseIcon = document.querySelector("#playPause")
const bgMusic = document.querySelector("audio");

if (bgMusic) {
  bgMusic.load();
}

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

$(document).ready(() => {
  // countdown
  const date = $(".countdown").attr("date");
  Countdown(date);
  
  //autoslider
  setTimeout(function() {
    $("#wishes_wrapper_1, #wishes_wrapper_2").infiniteslide({
      speed: 50,
      direction: "up",
    });
  }, 1000);


  if (musicControl) {
    musicControl.on("click", (event) => {
      if (bgMusic.paused == true) {
        bgMusicPlay()
        playPauseIcon.classList.replace('icofont-music-alt', 'icofont-ui-pause')
      } else {
        bgMusicPlay(false)
        playPauseIcon.classList.replace('icofont-ui-pause', 'icofont-music-alt')
      }
    })
  }
  //endmusic

  var previousScroll = 70;
  $(window).scroll(function(e) {

    // add/remove class to navbar when scrolling to hide/show
    var scroll = $(window).scrollTop();
    if (scroll >= previousScroll) {
      $('nav').addClass("navbar-hide");
    }else if (scroll < previousScroll) {
      $('nav').removeClass("navbar-hide");
      $('nav').addClass("scrolled");
    }

    if(scroll == 0){
      $('nav').removeClass("navbar-hide");
      $('nav').removeClass("scrolled");
    }
    previousScroll = scroll;
  });

  $(document).scroll(function () {
    $('nav').toggleClass('scrolled', $(this).scrollTop() > $('nav').height())
  });

  $("body").css("overflow-y", "hidden");

    $(".zoom-gallery").magnificPopup({
        delegate: "a",
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
    
  $("#btn-envelope").on("click", function () {
    $("body").css("overflow-y", "auto");

    bgMusicPlay();
    $(".envelope-wrap").css("transform", "translateY(-100%)");
  });
});

$('iframe, img').on('load', function () {
    AOS.refresh();
    console.log('AOS Refreshed');
});

$(window).on('resize', function(){
    console.log('Window Resized');
    setTimeout(function() {
        AOS.refresh();
    }, 1000);
});

const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "felix-giovanny.menujuakad.com") {
	
	function simpleSuperscriptSolution() {
		const allH6 = document.querySelectorAll('h6');
		
		console.log('Total h6 elements found:', allH6.length);
		
		allH6.forEach((h6, index) => {
			const text = h6.textContent.trim();
			console.log(`H6 #${index}:`, text);
			
			// More flexible matching - check if it contains the date
			if (text.includes('November 23') && text.includes('2025')) {
				console.log('Found date h6:', text);
				// Replace any ordinal suffix (st, nd, rd, th) with superscript version
				h6.innerHTML = text.replace(/(\d+)(st|nd|rd|th)/g, '$1<sup>$2</sup>');
				console.log('After superscript:', h6.innerHTML);
			}
		});
	}

	function updateTimeFormat() {
		const elements = document.querySelectorAll('h6');
		
		console.log('Updating time format...');
		
		elements.forEach(element => {
			let text = element.textContent;
			console.log('Checking element:', text);
			
			// Replace "10:00 - 11:30 WIB" with "10:00 - 11:30 AM"
			text = text.replace(/(10:00)\s*-\s*(11:30)\s*WIB/, '$1 - $2 AM');
			
			// Replace "19:00 - 21:00 WIB" with "07:00 - 09:00 PM"
			text = text.replace(/(19:00)\s*-\s*(21:00)\s*WIB/, '07:00 - 09:00 PM');
			
			if (element.textContent !== text) {
				console.log('Changed from:', element.textContent, 'to:', text);
			}
			
			element.textContent = text;
		});
	}

	function changeVenueImage() {
		const venueImages = document.querySelectorAll('img[src="/templates/assets/themes/theme_25/images/venue.png"].mb-3.mx-auto');
		
		console.log(`Found ${venueImages.length} venue images to update`);
		
		venueImages.forEach(img => {
			img.src = '/templates/assets/themes/theme_25/images/venue_dusty.png';
			console.log('Updated image src');
		});
	}

	// Run both functions when DOM is loaded
	document.addEventListener('DOMContentLoaded', function() {
		console.log('DOM Content Loaded - Running scripts...');
		
		updateTimeFormat();
		changeVenueImage();
		simpleSuperscriptSolution();
	});
	
}
